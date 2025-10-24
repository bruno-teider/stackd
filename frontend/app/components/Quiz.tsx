"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    texto: "Qual porcentagem do seu dinheiro você estaria disposto a arriscar em busca de mais ganhos?",
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
  const router = useRouter();

  const handleResposta = (valor: number) => {
    setPontuacao((prev) => prev + valor);

    if (indice < perguntas.length - 1) {
      setIndice(indice + 1);
    } else {
      router.push(`/home`);
    }
  };

  const perguntaAtual = perguntas[indice];

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
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-100 transition-colors"
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
