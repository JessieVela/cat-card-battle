<script setup lang="ts" async>
import { ref } from 'vue'
import type { CardPack } from '@/types/game'
import CardPackItem from '@/components/game/CardPackItem.vue'
import CardReveal from '@/components/game/CardReveal.vue'
import { useCards } from '@/composables/cards'

const packs = ref<CardPack[]>([
  {
    id: 1,
    name: 'Mystic Pack',
    description: 'Ancient feline magic',
    color: 'from-purple-500 to-indigo-600',
    emoji: '🔮',
  },
  {
    id: 2,
    name: 'Warrior Pack',
    description: 'Battle-hardened cats',
    color: 'from-red-500 to-orange-600',
    emoji: '⚔️',
  },
  {
    id: 3,
    name: 'Shadow Pack',
    description: 'Stealthy night prowlers',
    color: 'from-gray-700 to-blue-900',
    emoji: '🌙',
  },
])

const selectedPack = ref<CardPack | null>(null)
const isAnimating = ref(false)
const showCards = ref(false)

const selectPack = async (pack: CardPack) => {
  if (isAnimating.value) {
    return
  }

  selectedPack.value = pack
  isAnimating.value = true

  // Preload images for no layout shift
  useCards().fetchCatImages()

  // Wait for shake animation, then show cards
  setTimeout(() => {
    showCards.value = true
  }, 1500)
}
</script>

<template>
  <div class="w-full max-w-6xl">
    <Transition name="fade">
      <div v-if="!showCards">
        <!-- Title -->
        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
            Choose Your Pack
          </h2>
          <p class="text-xl text-yellow-300 drop-shadow-lg">
            Select wisely - your destiny awaits! ✨
          </p>
        </div>

        <!-- Pack Selection -->
        <div class="relative flex flex-wrap justify-center gap-8 px-4">
          <CardPackItem
            v-for="pack in packs"
            :key="pack.id"
            :pack="pack"
            :is-selected="selectedPack?.id === pack.id"
            :is-animating="isAnimating"
            @select="selectPack"
          />
        </div>
      </div>
    </Transition>

    <!-- Card Reveal -->
    <Transition name="fade">
      <CardReveal v-if="showCards" :pack="selectedPack!" />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
