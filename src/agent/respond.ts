/**
 * AI Agent stub — the future "digital twin" brain.
 *
 * INTEGRATION POINT: when the real agent is ready, replace the body of
 * `respond()` with a fetch to your hosted endpoint, e.g.:
 *
 *   const res = await fetch('https://your-agent.example.com/chat', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ message, history }),
 *   })
 *   return (await res.json()).reply
 *
 * The chat UI (src/ui/AgentPanel.tsx) only calls this function, so nothing
 * else needs to change. Remember: GitHub Pages is static — the endpoint must
 * be an external service (Cloudflare Workers, Vercel Edge, etc.).
 */

export interface ChatTurn {
  role: 'user' | 'bot'
  text: string
}

const CANNED = [
  "That's a great question! The real AI-me is still in training — meanwhile, the human Animesh reads every message sent from the kitchen's recipe card. 🍳",
  'Beep boop — my neural pathways are still under construction. Try ANIMESH·TV in the gallery for his projects, or the fridge for his resume!',
  'Can he build it? Yes. Can he learn it? Also yes. (I was trained on his fact sheet — but the shipped projects back it up.)',
  'My creator builds agentic AI for a living — LangGraph workflows, RAG pipelines, Redis-backed agents at Incedo. Ironically, I am still a hard-coded list of strings. He says my upgrade is "on the bench".',
  "Fun fact while you wait for my upgrade: this whole house runs in your browser with zero backend. I'm the only feature that will ever need a server. 🤖",
  'Ask me again after my LangGraph brain transplant — for now, check the workshop to see what he is building this month (spoiler: partly me).',
]

export async function respond(message: string, history: ChatTurn[]): Promise<string> {
  // deterministic-ish pick so repeated questions get varied answers
  const seed = (message.length + history.length) % CANNED.length
  await new Promise((r) => setTimeout(r, 600 + Math.random() * 500))
  return CANNED[seed]
}
