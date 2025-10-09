<script setup lang="ts">
import type { CatCard } from '@/types/game'

defineProps<{
  card: CatCard
}>()

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-600',
}

const rarityGlow = {
  common: 'shadow-gray-500/50',
  rare: 'shadow-blue-500/50',
  epic: 'shadow-purple-500/50',
  legendary: 'shadow-yellow-500/50',
}
</script>

<template>
  <div
    :class="[
      'bg-gradient-to-br rounded-xl shadow-2xl p-6 w-64 transform transition-all hover:scale-105',
      rarityColors[card.rarity],
      `hover:${rarityGlow[card.rarity]}`,
    ]"
  >
    <!-- Card Header -->
    <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-4">
      <h3 class="text-2xl font-bold text-white text-center truncate">{{ card.name }}</h3>
      <p class="text-xs text-white/80 text-center uppercase tracking-wider">{{ card.rarity }}</p>
    </div>

    <!-- Card Image -->
    <div class="bg-white/30 backdrop-blur-sm rounded-lg p-8 mb-4 flex items-center justify-center">
      <div class="text-8xl">{{ card.image }}</div>
    </div>

    <!-- Card Stats -->
    <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 space-y-2">
      <div class="flex justify-between items-center">
        <span class="text-white font-semibold">⚔️ Attack:</span>
        <span class="text-white font-bold">{{ card.attack }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white font-semibold">🛡️ Defense:</span>
        <span class="text-white font-bold">{{ card.defense }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-white font-semibold">❤️ Health:</span>
        <span class="text-white font-bold">{{ card.health }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
