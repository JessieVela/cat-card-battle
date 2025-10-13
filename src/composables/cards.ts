import { onMounted, ref } from 'vue'
import { drawRarity, drawStats } from '@/game/stats'
import type { CatCard, TheCatApiImage } from '@/types/game'
import { isFirstPackClaimed, claimFirstPack } from '@/utils/firstPack'

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
      { headers },
    )
    if (!response.ok) {
      throw new Error('Failed to fetch cat images')
    }

    const data = (await response.json()) as TheCatApiImage[]
    images.value = data.map((d) => d.url)
  }

  const create = (id: number, forceLegendary = false): CatCard => {
  const rarity = forceLegendary ? 'legendary' : drawRarity()
console.log("Created card rarity:", rarity)


  return {
    id,
    name: fetchCatName(),
    image: images.value[id] ?? '',
    rarity,
    stats: drawStats(rarity),
  }
}


  //Generate the pack (guarantee legendary if first pack)
  const generate = (amount: number): CatCard[] => {
  const firstPack = !isFirstPackClaimed()
  const result = Array.from({ length: amount }, (_, id) => create(id))

  console.log("First pack?", firstPack)

  // Guarantee one Legendary if it's the first pack
  if (firstPack && !result.some((c) => c.rarity === 'legendary')) {
    const randomIndex = Math.floor(Math.random() * result.length)
    result[randomIndex] = create(randomIndex, true)
  }

  // claimFirstPack()
  if (firstPack) {
  console.log("🌟 Guaranteed Legendary Pack Triggered!")
  claimFirstPack()
  }
  return result
  }


  //Ensure images are fetched first, then cards are generated
  onMounted(async () => {
  visible.value = false
  try {
    await fetchCatImages()          
    cards.value = generate(amount) 
  } catch (err) {
    console.error('Error generating cards:', err)
  } finally {
    setTimeout(() => (visible.value = true), 500)
  }
})


  return {
    cards,
    visible,
    fetchCatImages,
  }
}
