// El chatbot habla con un Worker de Cloudflare (ver carpeta /worker), que es
// quien guarda la API key de Groq y construye el prompt. Aquí solo enviamos los
// mensajes de la conversación; nunca viaja ninguna clave al navegador.

const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL as string | undefined

export interface Message {
  role: 'user' | 'model'
  text: string
}

export async function sendToGemini(messages: Message[]): Promise<string> {
  if (!CHAT_API_URL) throw new Error('VITE_CHAT_API_URL is not set')

  const res = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Chat error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content as string
}
