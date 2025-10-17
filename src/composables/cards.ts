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
      image: images.value[id] ?? '',
      rarity,
      stats: drawStats(rarity),
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

  // Ensure images are fetched first, then cards are generated
  onMounted(async () => {
    visible.value = false
    try {
      await fetchCatImages()
      cards.value = generate(amount)
    } catch (err) {
      // error handled silently
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
