import { ref } from 'vue'
import { drawRarity, drawStats } from '@/game/stats'
import type { CatCard, TheCatApiImage } from '@/types/game'
import { isFirstPackClaimed, claimFirstPack } from '@/utils/firstPack'
import wizardPackImage from '@/assets/images/packs/wizard_pack.png'
import warriorPackImage from '@/assets/images/packs/warrior_pack.png'
import ninjaPackImage from '@/assets/images/packs/ninja_pack.png'

const amount = 5 as const
const cards = ref<CatCard[]>([])
const images = ref<string[]>([])
const visible = ref(false)
const imageLoadingStates = ref<boolean[]>([])
const selectedPackId = ref<number>(1)
let isFetching = false
let hasFetched = false

const packImages: Record<number, string> = {
  1: wizardPackImage,
  2: warriorPackImage,
  3: ninjaPackImage,
}

// Cat name generator function
const generateCatName = (): string => {
  const prefixes = [
    'Captain',
    'Sir',
    'Lady',
    'Doctor',
    'Professor',
    'Agent',
    'Major',
    'Duchess',
    'King',
    'Queen',
    'Prince',
    'Princess',
    'Lord',
    'Duke',
    'Count',
    'Baron',
    'Shadow',
    'Midnight',
    'Storm',
    'Thunder',
    'Lightning',
    'Mystic',
    'Cosmic',
    'Silver',
    'Golden',
    'Crystal',
    'Ruby',
    'Sapphire',
    'Emerald',
    'Diamond',
    'Stealth',
    'Phantom',
    'Ghost',
    'Spirit',
    'Ancient',
    'Eternal',
  ]

  const titles = [
    'Whisker',
    'Paw',
    'Claw',
    'Tail',
    'Fang',
    'Purr',
    'Meow',
    'Hiss',
    'Fluff',
    'Fuzz',
    'Pounce',
    'Dash',
    'Blaze',
    'Spark',
    'Whisper',
    'Twinkle',
    'Bean',
    'Boots',
    'Mittens',
    'Socks',
    'Sneakers',
    'Jumper',
    'Hunter',
    'Leaper',
    'Springer',
    'Dancer',
  ]
  const usePrefix = Math.random() < 0.5

  if (usePrefix) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]!
    const title = titles[Math.floor(Math.random() * titles.length)]!
    return `${prefix} ${title}`
  } else {
    const adjectives = [
      'Fluffy',
      'Sneaky',
      'Brave',
      'Mischievous',
      'Sleepy',
      'Sassy',
      'Curious',
      'Swift',
      'Gentle',
      'Clever',
      'Royal',
      'Wild',
      'Fuzzy',
      'Grumpy',
    ]
    const nouns = [
      'Paws',
      'Whiskers',
      'Tail',
      'Claw',
      'Furball',
      'Shadow',
      'Storm',
      'Hunter',
      'Moon',
      'Spark',
      'Snuggle',
      'Napper',
    ]
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]!
    const noun = nouns[Math.floor(Math.random() * nouns.length)]!
    return `${adj} ${noun}`
  }
}

export function useCards() {
  const fetchCatImages = async (): Promise<void> => {
    if (isFetching || hasFetched) {
      return
    }

    isFetching = true

    const headers: Record<string, string> = {}
    if (import.meta.env.VITE_CAT_API_KEY) {
      headers['x-api-key'] = import.meta.env.VITE_CAT_API_KEY
    }

    try {
      const params = new URLSearchParams({
        limit: String(amount),
        size: 'small',
        order: 'RAND',
        mime_types: 'jpg,png',
      })

      const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?${params.toString()}`,
        { headers },
      )

      if (!response.ok) {
        throw new Error('Failed to fetch cat images')
      }

      const data = (await response.json()) as TheCatApiImage[]
      images.value = data.map((d) => d.url)

      cards.value = generate(amount)
      hasFetched = true

      setTimeout(() => {
        visible.value = true
        loadImagesIncrementally()
      }, 500)
    } finally {
      isFetching = false
    }
  }

  const create = (id: number, forceLegendary = false): CatCard => {
    const rarity = forceLegendary ? 'legendary' : drawRarity()

    return {
      id,
      name: generateCatName(), // Using the new name generator
      image: packImages[selectedPackId.value] || wizardPackImage,
      rarity,
      stats: drawStats(rarity),
    }
  }

  const setPackId = (packId: number) => {
    selectedPackId.value = packId
  }

  const loadImageForCard = async (cardIndex: number): Promise<void> => {
    if (imageLoadingStates.value[cardIndex] || !images.value[cardIndex]) {
      return
    }

    imageLoadingStates.value[cardIndex] = true

    try {
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = images.value[cardIndex]!
      })

      if (cards.value[cardIndex]) {
        cards.value[cardIndex]!.image = images.value[cardIndex]!
      }
    } catch (error) {
      console.warn(`Failed to load image for card ${cardIndex}:`, error)
    }
  }

  const loadImagesIncrementally = async (): Promise<void> => {
    for (let i = 0; i < amount; i++) {
      await loadImageForCard(i)
      if (i < amount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }
  }

  const generate = (amount: number): CatCard[] => {
    const firstPack = !isFirstPackClaimed()
    const result = Array.from({ length: amount }, (_, id) => create(id))

    if (firstPack && !result.some((c) => c.rarity === 'legendary')) {
      const randomIndex = Math.floor(Math.random() * result.length)
      result[randomIndex] = create(randomIndex, true)
    }

    if (firstPack) {
      claimFirstPack()
    }

    return result
  }

  return {
    cards,
    visible,
    fetchCatImages,
    loadImagesIncrementally,
    imageLoadingStates,
    setPackId,
  }
}
