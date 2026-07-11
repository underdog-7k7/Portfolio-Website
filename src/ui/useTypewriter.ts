import { useEffect, useState } from 'react'

/** classic type / pause / delete / next-word loop (replaces Typed.js) */
export function useTypewriter(words: string[], typeMs = 60, deleteMs = 28, pauseMs = 1500): string {
  const [text, setText] = useState('')

  useEffect(() => {
    let word = 0
    let chars = 0
    let deleting = false
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = words[word]
      let delay = deleting ? deleteMs : typeMs
      if (!deleting) {
        chars++
        if (chars === current.length) {
          deleting = true
          delay = pauseMs
        }
      } else {
        chars--
        if (chars === 0) {
          deleting = false
          word = (word + 1) % words.length
        }
      }
      setText(words[word].slice(0, chars))
      timer = setTimeout(tick, delay)
    }
    timer = setTimeout(tick, typeMs)
    return () => clearTimeout(timer)
  }, [words, typeMs, deleteMs, pauseMs])

  return text
}
