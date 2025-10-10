<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CardPack, CatCard, TheCatApiImage } from '@/types/game'
import CatCardItem from '@/components/game/CatCardItem.vue'

defineProps<{
  pack: CardPack
}>()

const cards = ref<CatCard[]>([])
const showCards = ref(false)

const catNames = [
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
]

const rarities: Array<'common' | 'rare' | 'epic' | 'legendary'> = [
  'common',
  'common',
  'common',
  'rare',
  'epic',
]

async function fetchCatImages(count: number): Promise<string[]> {
  const params = new URLSearchParams({
    limit: String(count),
    size: 'small',
    order: 'RAND',
    mime_types: 'jpg,png',
  })
  const headers: Record<string, string> = {}
  if (import.meta.env.VITE_CAT_API_KEY) {
    headers['x-api-key'] = import.meta.env.VITE_CAT_API_KEY
  }
  const response = await fetch(`https://api.thecatapi.com/v1/images/search?${params.toString()}`, {
    headers,
  })
  if (!response.ok) {
    throw new Error('Failed to fetch cat images')
  }
  const data = (await response.json()) as TheCatApiImage[]
  return data.map((d) => d.url)
}

async function generateCards(): Promise<CatCard[]> {
  const images = await fetchCatImages(5)
  return Array.from({ length: 5 }, (_, i) => {
    const randomName = catNames[Math.floor(Math.random() * catNames.length)]
    return {
      id: i + 1,
      name: randomName,
      attack: Math.floor(Math.random() * 50) + 20,
      defense: Math.floor(Math.random() * 40) + 10,
      health: Math.floor(Math.random() * 100) + 50,
      image: images[i] ?? '',
      rarity: rarities[i % rarities.length],
    }
  })
}

onMounted(async () => {
  try {
    cards.value = await generateCards()
  } catch (e) {
    // fallback to emoji if API fails
    cards.value = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: catNames[Math.floor(Math.random() * catNames.length)],
      attack: Math.floor(Math.random() * 50) + 20,
      defense: Math.floor(Math.random() * 40) + 10,
      health: Math.floor(Math.random() * 100) + 50,
      image: '🐱',
      rarity: rarities[i % rarities.length],
    }))
  }

  setTimeout(() => {
    showCards.value = true
  }, 500)
})
</script>

<template>
  <div class="w-full">
    <!-- Title -->
    <div class="text-center mb-12">
      <h2 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">Your Cards! 🎉</h2>
      <p class="text-xl text-yellow-300 drop-shadow-lg">You opened the {{ pack.name }}</p>
    </div>

    <!-- Cards Display -->
    <div class="flex flex-wrap justify-center gap-6 px-4">
      <TransitionGroup name="card">
        <CatCardItem
          v-for="(card, index) in cards"
          v-show="showCards"
          :key="card.id"
          :card="card"
          :style="{ transitionDelay: `${index * 100}ms` }"
        />
      </TransitionGroup>
    </div>

    <!-- Continue Button -->
    <div class="text-center mt-12">
      <button
        class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
      >
        Continue to Battle! ⚔️
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-enter-active {
  transition: all 0.6s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(100px) scale(0.5) rotate(10deg);
}

.card-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1) rotate(0deg);
}
</style>
