<template>
  <div class="relative" ref="dropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :aria-label="'Select language'"
    >
      <!-- Current Flag -->
      <div class="w-6 h-4">
        <svg v-if="locale === 'en'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
          <path fill="#012169" d="M0 0h640v480H0z"/>
          <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
          <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
          <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
          <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
        </svg>
        <svg v-else-if="locale === 'fr'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
          <path fill="#fff" d="M0 0h640v480H0z"/>
          <path fill="#000091" d="M0 0h213.3v480H0z"/>
          <path fill="#e1000f" d="M426.7 0H640v480H426.7z"/>
        </svg>
        <svg v-else-if="locale === 'it'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
          <g fill-rule="evenodd" stroke-width="1pt">
            <path fill="#fff" d="M0 0h640v480H0z"/>
            <path fill="#009246" d="M0 0h213.3v480H0z"/>
            <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/>
          </g>
        </svg>
      </div>
      
      <!-- Dropdown Arrow -->
      <svg 
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
      >
        <div class="py-1" role="menu">
          <!-- English -->
          <button
            @click="switchLanguage('en')"
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': locale === 'en' }"
            role="menuitem"
          >
            <div class="w-6 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
                <path fill="#012169" d="M0 0h640v480H0z"/>
                <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"/>
                <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"/>
                <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z"/>
                <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z"/>
              </svg>
            </div>
            <span>English</span>
            <svg v-if="locale === 'en'" class="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- French -->
          <button
            @click="switchLanguage('fr')"
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': locale === 'fr' }"
            role="menuitem"
          >
            <div class="w-6 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
                <path fill="#fff" d="M0 0h640v480H0z"/>
                <path fill="#000091" d="M0 0h213.3v480H0z"/>
                <path fill="#e1000f" d="M426.7 0H640v480H426.7z"/>
              </svg>
            </div>
            <span>Français</span>
            <svg v-if="locale === 'fr'" class="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Italian -->
          <button
            @click="switchLanguage('it')"
            class="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 dark:bg-gray-700': locale === 'it' }"
            role="menuitem"
          >
            <div class="w-6 h-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
                <g fill-rule="evenodd" stroke-width="1pt">
                  <path fill="#fff" d="M0 0h640v480H0z"/>
                  <path fill="#009246" d="M0 0h213.3v480H0z"/>
                  <path fill="#ce2b37" d="M426.7 0H640v480H426.7z"/>
                </g>
              </svg>
            </div>
            <span>Italiano</span>
            <svg v-if="locale === 'it'" class="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLanguage = (newLocale: string) => {
  setLocale(newLocale)
  isOpen.value = false
}

// Close dropdown when clicking outside
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isOpen.value = false
    }
  }

  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
