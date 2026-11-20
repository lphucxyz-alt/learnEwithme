import { useState } from 'react'
import { useStudy } from '../../app/StudyProvider'
import { playIpaWord } from './ipa-audio'

export function IpaListen({ text, label }: { text: string; label: string }) {
  const { state } = useStudy()
  const [error, setError] = useState('')
  function play() {
    setError('')
    const options = { error: setError }
    playIpaWord(text, state.accent, state.rate, options)
  }

  return <span className="inline-action"><button type="button" onClick={play}>{label}</button>
    {error && <small role="status">{error}</small>}
  </span>
}
