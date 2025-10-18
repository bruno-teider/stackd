import { Header } from "../components/Header";

export default function Profile() {
  const userData = {
    nome: "Bruno Teider",
    email: "bruno@stackd.com",
    perfilInvestidor: "Moderado",
  };

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
                  <span className="text-black font-medium">
                    {userData.perfilInvestidor}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {userData.perfilInvestidor === "Conservador" &&
                    "Prioriza segurança e estabilidade nos investimentos"}
                  {userData.perfilInvestidor === "Moderado" &&
                    "Busca equilíbrio entre segurança e rentabilidade"}
                  {userData.perfilInvestidor === "Arrojado" &&
                    "Aceita maior risco em busca de maiores retornos"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Refazer Perfil Investidor
            </button>
            {/* <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Editar Perfil
            </button>
            <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Alterar Senha
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
