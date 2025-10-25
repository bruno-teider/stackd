"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "../components/Header";
import { authService } from "../../services/api";

interface UserData {
  id: string;
  nome: string;
  email: string;
  perfilInvestidor: string;
  carteira: {
    id: string;
    saldo: string;
  };
  accountCreated: string;
  hasWallet: boolean;
  walletBalance: string;
}

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check for success message from quiz update
    if (searchParams.get("updated") === "true") {
      setSuccessMessage("Perfil de investidor atualizado com sucesso!");
      // Clear the URL parameter after showing the message
      setTimeout(() => {
        setSuccessMessage(null);
        window.history.replaceState({}, "", "/profile");
      }, 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await authService.getUserInfo(token);
        setUserData(response.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados");
        // If unauthorized, redirect to login
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("access_token");
          router.push("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const getPerfilDescription = (perfil: string) => {
    const perfilLower = perfil.toLowerCase();
    if (perfilLower === "conservador") {
      return "Prioriza segurança e estabilidade nos investimentos";
    } else if (perfilLower === "moderado") {
      return "Busca equilíbrio entre segurança e rentabilidade";
    } else if (perfilLower === "arrojado") {
      return "Aceita maior risco em busca de maiores retornos";
    }
    return "";
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium">
              {error || "Erro ao carregar dados do usuário"}
            </p>
            <button
              onClick={handleLogout}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Voltar ao Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Perfil</h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✓ {successMessage}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Profile Picture Section */}
          <div className="flex items-center mb-8 pb-8 border-b border-gray-200">
            <div className="w-24 h-24 rounded-full bg-gray-800 text-white flex items-center justify-center text-3xl font-bold">
              {userData.nome.charAt(0)}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-black">
                {userData.nome}
              </h2>
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>

          {/* Information Fields */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black">
                {userData.nome}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black">
                {userData.email}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perfil de Investidor
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-black font-medium capitalize">
                    {userData.perfilInvestidor}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {getPerfilDescription(userData.perfilInvestidor)}
                </p>
              </div>
            </div>

            {/* Wallet Information */}
            {userData.hasWallet && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carteira
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-medium">
                      Saldo Disponível
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      R$ {parseFloat(userData.walletBalance).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    {userData.accountCreated}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => router.push("/quiz")}
              className="px-6 py-2 cursor-pointer bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refazer Perfil Investidor
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
