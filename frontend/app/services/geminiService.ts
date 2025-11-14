// Serviço do frontend que chama a rota server-side /api/gemini
// Mantemos a chave no servidor (GOOGLE_API_KEY) e a rota faz a chamada ao endpoint Google Generative Language API.
export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('API /api/gemini returned error:', res.status, errText);
      throw new Error('Erro na API interna');
    }
    const data = await res.json();
    // Garantir que sempre retornamos uma string para o frontend
    if (typeof data?.reply === 'string' && data.reply.trim() !== '') return data.reply;
    // tenta extrair campos comuns de data.raw
    const raw = data?.raw ?? data;
    if (raw) {
      if (Array.isArray(raw.candidates) && raw.candidates[0]) {
        const c = raw.candidates[0];
        if (typeof c.content === 'string') return c.content;
        if (typeof c.output === 'string') return c.output;
        if (typeof c.text === 'string') return c.text;
      }
      if (Array.isArray(raw.output) && raw.output[0]) {
        const o = raw.output[0];
        if (typeof o.content === 'string') return o.content;
        if (typeof o.text === 'string') return o.text;
      }
      if (typeof raw === 'string') return raw;
      try {
        return JSON.stringify(raw);
      } catch (e) {
        return 'Sem resposta da IA.';
      }
    }
    return 'Sem resposta da IA.';
  } catch (err) {
    console.error('sendMessageToGemini error:', err);
    return 'Erro ao conectar com a IA.';
  }
}
