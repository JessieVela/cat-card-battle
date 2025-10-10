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
  attack: number
  defense: number
  health: number
  image: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

// TheCatAPI free endpoint response shape
export interface TheCatApiImage {
  id: string
  url: string
  width: number
  height: number
}
