export function shuffle<T>(items: readonly T[], random = Math.random) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1))
    const value = result[index]
    result[index] = result[other]
    result[other] = value
  }
  return result
}

export function leastRecent<T>(items: readonly T[], count: number, id: (item: T) => string, recent: readonly string[], random = Math.random) {
  const lastSeen = new Map(recent.map((key, index) => [key, index]))
  return shuffle(items, random).sort((a, b) => (lastSeen.get(id(a)) ?? -1) - (lastSeen.get(id(b)) ?? -1)).slice(0, count)
}

export function rememberPractice(recent: string[], added: string[]) {
  return [...recent.filter(id => !added.includes(id)), ...added].slice(-240)
}
