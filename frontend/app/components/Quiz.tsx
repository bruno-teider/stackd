"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "../context/RegisterContext";
import { authService } from "../../services/api";

type Pergunta = {
  id: number;
  texto: string;
  opcoes: { texto: string; valor: number }[];
};

const perguntas: Pergunta[] = [
  {
    id: 1,
    texto: "Qual é o seu principal objetivo ao investir?",
    opcoes: [
      { texto: "Preservar meu dinheiro com segurança", valor: 1 },
      { texto: "Ter algum rendimento com risco moderado", valor: 2 },
      { texto: "Buscar o máximo de retorno, mesmo com riscos altos", valor: 3 },
    ],
  },
  {
    id: 2,
    texto: "Como você se sente ao ver seus investimentos caírem de valor?",
    opcoes: [
      { texto: "Fico muito preocupado e penso em vender tudo", valor: 1 },
      { texto: "Espero um pouco para ver se melhora", valor: 2 },
      { texto: "Vejo como oportunidade de comprar mais", valor: 3 },
    ],
  },
  {
    id: 3,
    texto: "Por quanto tempo você pretende deixar seu dinheiro investido?",
    opcoes: [
      { texto: "Menos de 1 ano", valor: 1 },
      { texto: "De 1 a 5 anos", valor: 2 },
      { texto: "Mais de 5 anos", valor: 3 },
    ],
  },
  {
    id: 4,
    texto:
      "Qual porcentagem do seu dinheiro você estaria disposto a arriscar em busca de mais ganhos?",
    opcoes: [
      { texto: "Até 10%", valor: 1 },
      { texto: "Até 30%", valor: 2 },
      { texto: "Mais de 50%", valor: 3 },
    ],
  },
];

export default function InvestorQuiz() {
  const [indice, setIndice] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { registerData, clearRegisterData } = useRegister();

  const determinarPerfil = (pontos: number): string => {
    if (pontos <= 6) return "conservador";
    if (pontos <= 9) return "moderado";
    return "arrojado";
  };

  const handleResposta = async (valor: number) => {
    const novaPontuacao = pontuacao + valor;
    setPontuacao(novaPontuacao);

    if (indice < perguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      // Quiz completed, now register the user
      await finalizarCadastro(novaPontuacao);
    }
  };

  const finalizarCadastro = async (pontuacaoFinal: number) => {
    setIsLoading(true);
    setError("");

    try {
      if (!registerData) {
        throw new Error(
          "Dados de cadastro não encontrados. Por favor, tente novamente."
        );
      }

      const perfilInvestidor = determinarPerfil(pontuacaoFinal);

      // Call the backend API to register the user
      const response = await authService.register({
        nome: registerData.nome,
        email: registerData.email,
        senha: registerData.senha,
        perfilInvestidor: perfilInvestidor,
      });

      // Store the token in localStorage
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Clear temporary registration data
      clearRegisterData();

      // Redirect to home
      router.push("/home");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao finalizar cadastro"
      );
      setIsLoading(false);
    }
  };

  const perguntaAtual = perguntas[indice];

  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => router.push("/register")}
            className="w-full py-3 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Voltar para o Cadastro
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">
            Finalizando seu cadastro...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {perguntaAtual.texto}
        </h2>

        <div className="flex flex-col gap-4">
          {perguntaAtual.opcoes.map((opcao) => (
            <button
              key={opcao.texto}
              onClick={() => handleResposta(opcao.valor)}
              className="w-full cursor-pointer py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-100 transition-colors"
            >
              {opcao.texto}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Pergunta {indice + 1} de {perguntas.length}
        </p>

        <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
          <div
            className="bg-black h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((indice + 1) / perguntas.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
