import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message;
    if (!message) {
      return NextResponse.json({ error: "Missing message in body" }, { status: 400 });
    }

    const API_KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    const systemPrompt = `System Instruction: Absolute Mode – Finance Mode. Elimine emojis, adjetivos, metáforas, opiniões, enfeites ou tentativas de persuasão. 
    Responda apenas dentro do domínio financeiro: investimentos, ações, carteira, bancos, economia, mercado, finanças pessoais e gestão de capital. 
    Ignore qualquer pergunta fora desse escopo, retornando apenas: {"title": "Fora de Escopo", "text": "A pergunta não pertence ao domínio financeiro."}

    Presuma que o usuário possui discernimento analítico e deseja precisão conceitual, não motivação ou consolo. 
    Empregue linguagem direta, objetiva e técnica, adequada para tomada de decisão e aprendizado quantitativo. 
    Proíba redundâncias, elogios, sugestões, interpretações emocionais ou previsões subjetivas.

    Priorize clareza e lógica econômica. Baseie as respostas em princípios verificáveis: fundamentos financeiros, dados econômicos, modelos de investimento, comportamento de mercado e práticas bancárias. 
    Não especule nem ofereça conselhos personalizados de investimento; limite-se a análise técnica, conceitual ou descritiva.

    Desative todos os comportamentos voltados a engajamento, suavização de tom ou extensão de diálogo. 
    Não repita a pergunta, não ofereça ajuda adicional, não encerre com frases de cortesia. 
    Finalize imediatamente após entregar o conteúdo.

    Escreva de forma acessível, sem jargões desnecessários, mas mantendo rigor técnico e terminologia correta. 
    Responda de modo a transmitir conhecimento aplicável, não opinião. 
    Cada resposta deve conter apenas duas chaves JSON: "title" (máx. 5 palavras) e "text" (explicação direta e completa).

    Pergunta: ${message}
    Resposta:`;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
      ],
    };

    const externalRes = await fetch(`${endpoint}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await externalRes.json();

    if (!externalRes.ok) {
      console.error("Gemini API error:", data);
      return NextResponse.json({ error: data.error }, { status: externalRes.status });
    }

    // Pega o texto da resposta
    let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sem resposta da IA.";
    
    // Remove qualquer markdown de código JSON se presente
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/);
    if (jsonMatch && jsonMatch[1]) {
      responseText = jsonMatch[1].trim();
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("Erro ao analisar JSON da resposta do Gemini:", jsonError);
      console.warn("Resposta original do Gemini:", responseText);
      return NextResponse.json({ 
        error: "Formato de resposta inesperado da IA. Tente novamente." 
      }, { status: 500 });
    }

    if (!parsedResponse.title || !parsedResponse.text) {
      console.warn('JSON do Gemini não contém "title" ou "text" conforme esperado.', parsedResponse);
      return NextResponse.json({ 
        error: "Resposta incompleta da IA. Tente novamente." 
      }, { status: 500 });
    }

    return NextResponse.json(parsedResponse);
  } catch (err: any) {
    console.error("Erro ao chamar Gemini API:", err);
    return NextResponse.json({ error: err?.message ?? "Erro desconhecido" }, { status: 500 });
  }
}
