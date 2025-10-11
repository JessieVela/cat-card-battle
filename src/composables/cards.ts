import { onMounted, ref } from 'vue'
import { drawRarity, drawStats } from '@/game/stats'
import type { CatCard, TheCatApiImage } from '@/types/game'

const amount = 5 as const
const cards = ref<CatCard[]>([])
const images = ref<string[]>([])
const visible = ref(false)

export function useCards() {
  // Mocking API call for the Cat's name
  const fetchCatName = (): string => {
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

  const fetchCatImages = async (): Promise<void> => {
    const params = new URLSearchParams({
      limit: String(amount),
      size: 'small',
      order: 'RAND',
      mime_types: 'jpg,png',
    })
    const headers: Record<string, string> = {}
    if (import.meta.env.VITE_CAT_API_KEY) {
      headers['x-api-key'] = import.meta.env.VITE_CAT_API_KEY
    }
    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?${params.toString()}`,
      {
        headers,
      },
    )
    if (!response.ok) {
      throw new Error('Failed to fetch cat images')
    }
    const data = (await response.json()) as TheCatApiImage[]
    images.value = data.map((d) => d.url)
  }

  const create = (id: number): CatCard => {
    const rarity = drawRarity()

    return {
      id,
      name: fetchCatName(),
      image: images.value[id] ?? '',
      rarity,
      stats: drawStats(rarity),
    }
  }

  const generate = (amount: number): CatCard[] =>
    Array.from({ length: amount }, (_, id) => create(id))

  onMounted(async () => {
    cards.value = generate(amount)

    setTimeout(() => (visible.value = true), 500)
  })

  return {
    cards,
    visible,
    fetchCatImages,
  }
}
