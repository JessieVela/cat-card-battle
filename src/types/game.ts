export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export type Stat = 'attack' | 'defense' | 'health'

export type Stats = Record<Stat, number>

export type StatsRange = Record<Stat, [number, number]>

export interface CardData {
  weight: number
  stats: StatsRange
}

export interface CardPack {
  id: number
  name: string
  description: string
  color: string
  emoji: string
}

export interface CatCard {
  id: number
  name: string
  image: string
  rarity: Rarity
  stats: Stats
}
