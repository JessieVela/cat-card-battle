<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(true)

const closeModal = () => {
  showModal.value = false
}
</script>

<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Arena Battle Background -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900 via-red-900 to-orange-800">
      <!-- Arena floor effect -->
      <div class="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-yellow-900/40 to-transparent"></div>

      <!-- Spotlight effects -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-red-300/20 rounded-full blur-3xl"></div>

      <!-- Arena elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-1/4 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div class="absolute top-1/4 right-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div class="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-64 h-2 bg-white"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div class="text-center">
        <h1 class="text-6xl md:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
          🐱 Cat Card Battle 🐱
        </h1>
        <p class="text-2xl text-yellow-300 font-semibold drop-shadow-lg">
          Enter the Arena!
        </p>
      </div>

      <!-- Instructions Modal -->
      <Transition name="modal">
        <div v-if="showModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="closeModal">
          <div
            class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-2xl max-w-2xl w-full p-8 transform transition-all">
            <!-- Modal Header -->
            <div class="text-center mb-6">
              <h2 class="text-4xl font-bold text-purple-900 mb-2">
                How to Play
              </h2>
              <div class="flex justify-center gap-2 text-4xl">
                🐱 🃏 ⚔️
              </div>
            </div>

            <!-- Instructions -->
            <div class="space-y-4 text-gray-800 mb-8">
              <div class="bg-white/50 rounded-lg p-4">
                <h3 class="font-bold text-lg text-purple-800 mb-2">
                  1. Choose Your Cat
                </h3>
                <p class="text-gray-700">
                  Select a powerful feline warrior to represent you in battle.
                </p>
              </div>

              <div class="bg-white/50 rounded-lg p-4">
                <h3 class="font-bold text-lg text-purple-800 mb-2">
                  2. Play Your Cards
                </h3>
                <p class="text-gray-700">
                  Each card has unique abilities. Use them strategically to defeat your opponent!
                </p>
              </div>

              <div class="bg-white/50 rounded-lg p-4">
                <h3 class="font-bold text-lg text-purple-800 mb-2">
                  3. Win the Battle
                </h3>
                <p class="text-gray-700">
                  Reduce your opponent's health to zero and claim victory in the arena!
                </p>
              </div>
            </div>

            <!-- Okay Button -->
            <div class="text-center">
              <button @click="closeModal"
                class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95">
                Let's Battle! 🎮
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
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
