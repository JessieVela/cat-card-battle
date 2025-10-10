import { onMounted, ref } from 'vue'
import { drawRarity, drawStats } from '@/game/stats'
import type { CatCard } from '@/types/game'

// Mocking API call for the Cat's name
const getRandomNameFromApi = (): string => {
  const result = [
    'Whiskers',
    'Shadow',
    'Luna',
    'Tiger',
    'Mittens',
    'Felix',
    'Nala',
    'Simba',
    'Garfield',
    'Tom',
  ] satisfies string[]

  return result[Math.floor(Math.random() * result.length)]!
}

export function useCards() {
  const cards = ref<CatCard[]>([])

  const create = (): CatCard => {
    const rarity = drawRarity()

    return {
      id: cards.value.length + 1,
      name: getRandomNameFromApi(),
      image: '🐱',
      rarity,
      stats: drawStats(rarity),
    }
  }

  const generate = (amount: number): CatCard[] => Array.from({ length: amount }, create)

  onMounted(() => (cards.value = generate(5)))

  return cards
}
