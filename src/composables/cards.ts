import { onMounted, ref } from 'vue'
import { drawRarity, drawStats } from '@/game/stats'
import type { CatCard, TheCatApiImage } from '@/types/game'
import { isFirstPackClaimed, claimFirstPack } from '@/utils/firstPack'
import placeholderImage from '@/assets/images/placeholder-card.svg'

const amount = 5 as const
const cards = ref<CatCard[]>([])
const images = ref<string[]>([])
const visible = ref(false)
const imageLoadingStates = ref<boolean[]>(new Array(amount).fill(false))

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

  // This is a filter function
  // It filters out problematic image hosts that may return placeholder images
  const isValidImageUrl = (url: string): boolean => {
    const problematicHosts = ['tumblr.com', '64.media.tumblr.com', 'static.tumblr.com']

    try {
      const urlObj = new URL(url)
      // Return true when none of the problematic hosts are substrings of the URL hostname
      return !problematicHosts.some((host) => urlObj.hostname.includes(host))
    } catch {
      return false
    }
  }

  const fetchCatImages = async (): Promise<void> => {
    const validImages: string[] = []

    const headers: Record<string, string> = {}
    if (import.meta.env.VITE_CAT_API_KEY) {
      headers['x-api-key'] = import.meta.env.VITE_CAT_API_KEY
    }

    // Keep fetching until we have exactly amount of valid images
    while (validImages.length < amount) {
      const needed = amount - validImages.length
      // Over-fetch (2x needed, minimum 10) to reduce loops.
      const requestAmount = Math.max(needed * 2, 10)

      const params = new URLSearchParams({
        limit: String(requestAmount),
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

      // Filter out problematic URLs
      const newValidImages = data.map((d) => d.url).filter(isValidImageUrl)

      validImages.push(...newValidImages)
    }

    images.value = validImages.slice(0, amount)
  }

  const create = (id: number, forceLegendary = false): CatCard => {
    const rarity = forceLegendary ? 'legendary' : drawRarity()

    return {
      id,
      name: fetchCatName(),
      image: placeholderImage, // Start with placeholder
      rarity,
      stats: drawStats(rarity),
    }
  }

  const loadImageForCard = async (cardIndex: number): Promise<void> => {
    if (imageLoadingStates.value[cardIndex] || !images.value[cardIndex]) {
      return
    }

    imageLoadingStates.value[cardIndex] = true

    try {
      // Preload the image to ensure it's ready
      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = images.value[cardIndex]
      })

      // Update the card with the real image
      if (cards.value[cardIndex]) {
        cards.value[cardIndex].image = images.value[cardIndex]
      }
    } catch (error) {
      console.warn(`Failed to load image for card ${cardIndex}:`, error)
    }
  }

  const loadImagesIncrementally = async (): Promise<void> => {
    // Load images one by one with a small delay between each
    for (let i = 0; i < amount; i++) {
      await loadImageForCard(i)
      // Small delay between image loads for visual effect
      if (i < amount - 1) {
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }
  }

  // Generate the pack (guarantee legendary if first pack)
  const generate = (amount: number): CatCard[] => {
    const firstPack = !isFirstPackClaimed()
    const result = Array.from({ length: amount }, (_, id) => create(id))

    // Guarantee one Legendary if it's the first pack
    if (firstPack && !result.some((c) => c.rarity === 'legendary')) {
      const randomIndex = Math.floor(Math.random() * result.length)
      result[randomIndex] = create(randomIndex, true)
    }

    if (firstPack) {
      claimFirstPack()
    }

    return result
  }

  // Generate cards immediately with placeholders, then load real images
  onMounted(async () => {
    visible.value = false

    // Generate cards immediately with placeholder images
    cards.value = generate(amount)

    // Show cards with placeholders first
    setTimeout(() => (visible.value = true), 500)

    // Load real images in the background
    try {
      await fetchCatImages()
      await loadImagesIncrementally()
    } catch (err) {
      console.warn('Failed to load cat images:', err)
      // Cards will continue showing placeholders if images fail to load
    }
  })

  return {
    cards,
    visible,
    fetchCatImages,
    loadImagesIncrementally,
    imageLoadingStates,
  }
}
