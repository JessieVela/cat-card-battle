<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CardPack } from '@/types/game'
import CatCardItem from '@/components/game/CatCardItem.vue'
import { useCards } from '@/composables/cards'

defineProps<{
  pack: CardPack
}>()

const cards = useCards()
const showCards = ref(false)

onMounted(() => {
  // Stagger card appearance
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
