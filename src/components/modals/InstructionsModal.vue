<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="handleClose"
    >
      <div
        class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all"
      >
        <!-- Modal Header -->
        <div class="text-center mb-6">
          <h2 class="text-4xl font-bold text-purple-900 mb-2">How to Play</h2>
          <div class="flex justify-center gap-2 text-4xl">🐱 🃏 ⚔️</div>
        </div>

        <!-- Instructions -->
        <div class="space-y-4 text-gray-800 mb-8">
          <div class="bg-white/50 rounded-lg p-4">
            <h3 class="font-bold text-lg text-purple-800 mb-2">1. Choose Your Pack</h3>
            <p class="text-gray-700">Select one of three card packs to begin your journey.</p>
          </div>

          <div class="bg-white/50 rounded-lg p-4">
            <h3 class="font-bold text-lg text-purple-800 mb-2">2. Play Your Cards</h3>
            <p class="text-gray-700">
              Each card has unique abilities. Use them strategically to defeat your opponent!
            </p>
          </div>

          <div class="bg-white/50 rounded-lg p-4">
            <h3 class="font-bold text-lg text-purple-800 mb-2">3. Win the Battle</h3>
            <p class="text-gray-700">
              Reduce your opponent's health to zero and claim victory in the arena!
            </p>
          </div>
        </div>

        <!-- Okay Button -->
        <div class="text-center">
          <button
            @click="handleClose"
            class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95"
          >
            Let's Battle! 🎮
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-gradient-to-br,
.modal-leave-active .bg-gradient-to-br {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-gradient-to-br {
  transform: scale(0.9);
}

.modal-leave-to .bg-gradient-to-br {
  transform: scale(0.9);
}
</style>
