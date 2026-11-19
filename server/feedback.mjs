function normalize(text) {
  return text.normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim()
}

export function groundedFeedback(feedback, input, hasAudio) {
  const transcript = hasAudio ? feedback.transcript : null
  const source = normalize(hasAudio ? transcript ?? '' : input.answer ?? '')
  const sufficient = feedback.sufficient && Boolean(source.replace(/\[không rõ\]|[^\p{L}]/gu, ''))
  return {
    ...feedback, sufficient, transcript,
    strength: sufficient ? feedback.strength : null,
    criteria: sufficient ? feedback.criteria : null,
    corrections: sufficient ? feedback.corrections.filter(correction =>
      source.includes(normalize(correction.original))) : [],
    comparison: sufficient && input.previous ? feedback.comparison : null,
    audioNote: sufficient && hasAudio ? feedback.audioNote : null,
    nextAction: feedback.sufficient && !sufficient ? 'Thử ghi lại 2–3 câu ở nơi yên tĩnh rồi bấm chấm.' : feedback.nextAction
  }
}
