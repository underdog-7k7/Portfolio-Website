import { getJSON } from './http'
import config from '../data/config.json'

/** Computer-science trivia via Open Trivia DB (free, no key). */

export interface TriviaQ {
  question: string
  answers: string[]
  correct: number
  difficulty: string
}

interface OTDB {
  response_code: number
  results: Array<{
    question: string
    correct_answer: string
    incorrect_answers: string[]
    difficulty: string
  }>
}

/** the API base64-encodes fields (encode=base64) — decode as UTF-8 */
function b64(s: string): string {
  try {
    return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)))
  } catch {
    return s
  }
}

export async function getTrivia(): Promise<TriviaQ[] | null> {
  const d = await getJSON<OTDB>(config.apis.trivia)
  if (!d || d.response_code !== 0 || !d.results?.length) return null
  return d.results.map((r) => {
    const correct = b64(r.correct_answer)
    const answers = [...r.incorrect_answers.map(b64), correct]
    // Fisher–Yates so the right answer isn't always last
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[answers[i], answers[j]] = [answers[j], answers[i]]
    }
    return { question: b64(r.question), answers, correct: answers.indexOf(correct), difficulty: b64(r.difficulty) }
  })
}
