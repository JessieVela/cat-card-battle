import type { CardData, Rarity, Stats, StatsRange } from '@/types/game'

// Rarity config for further development
// prettier-ignore
export const RARITIES = {
  common:    { weight: 1, stats: { attack: [3,  8],  defense: [3,  7],  health: [19, 24] }},
  uncommon:  { weight: 1, stats: { attack: [6,  12], defense: [4,  8],  health: [27, 53] }},
  rare:      { weight: 1, stats: { attack: [10, 16], defense: [6, 10],  health: [32, 81] }},
  epic:      { weight: 1,  stats: { attack: [16, 23], defense: [9, 13], health: [55, 116] }},
  legendary: { weight: 1,  stats: { attack: [24, 29], defense: [13, 19], health: [97, 145] }},
} as const satisfies Readonly<Record<Rarity, CardData>>;

const weightedEntries = (Object.entries(RARITIES) as [Rarity, CardData][]).sort(
  ([, { weight: a }], [, { weight: b }]) => a - b,
)
const totalWeight = weightedEntries.reduce((sum, [, { weight }]) => sum + weight, 0)

// Generate random rarity by weight data
export const drawRarity = (): Rarity => {
  let random = Math.random() * totalWeight

  // Check if number is in rarity range
  for (const [rarity, { weight }] of weightedEntries) {
    if (random < weight) {
      return rarity
    }

    // Iterate further with next weight
    random -= weight
  }

  // Defauft fallback as lowest rarity
  return weightedEntries[0]![0]
}

// Generate min-max statistics from rarity
export const drawStats = (rarity: Rarity): Stats =>
  Object.fromEntries(
    (Object.entries(RARITIES[rarity].stats) as [keyof StatsRange, [number, number]][]).map(
      // Get random number in stat range
      ([stat, [min, max]]) => [stat, Math.ceil(Math.random() * (max - min) + min)],
    ),
  ) as { [Stat in keyof Stats]: number }

export default {
  drawRarity,
  drawStats,
}
