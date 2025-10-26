````typescript
// app/components/inputs/GooglePlacesField.vue
<template>
  <div>
    <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <input
        :id="inputId"
        ref="autocompleteInput"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        @input="handleInput"
        class="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      
      <!-- Location icon -->
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    </div>
    
    <p v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface AddressComponent {
  street_number?: string
  route?: string
  locality?: string
  administrative_area_level_2?: string
  administrative_area_level_1?: string
  postal_code?: string
  country?: string
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Start typing an address...'
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  // Restrict to Italy only
  countryRestrict: {
    type: String,
    default: 'IT'
  }
})

const emit = defineEmits(['update:modelValue', 'place-selected'])

const autocompleteInput = ref<HTMLInputElement | null>(null)
const autocomplete = ref<any>(null)
const inputId = computed(() => `places-input-${Math.random().toString(36).substr(2, 9)}`)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

// Initialize Google Places Autocomplete
onMounted(async () => {
  if (!autocompleteInput.value) return

  try {
    // Wait for Google Maps to load
    const { loadGoogleMapsScript } = useGoogleMaps()
    await loadGoogleMapsScript()

    // Access google from window
    const google = (window as any).google

    if (!google || !google.maps || !google.maps.places) {
      throw new Error('Google Maps Places library not loaded')
    }

    // Initialize autocomplete with country restriction
    autocomplete.value = new google.maps.places.Autocomplete(
      autocompleteInput.value,
      {
        componentRestrictions: { country: props.countryRestrict },
        fields: [
          'address_components',
          'formatted_address',
          'geometry',
          'place_id',
          'name'
        ],
        types: ['address'] // Restrict to addresses only
      }
    )

    // Listen for place selection
    autocomplete.value.addListener('place_changed', () => {
      const place = autocomplete.value?.getPlace()
      
      if (!place || !place.address_components) {
        return
      }

      // Parse address components
      const addressData: AddressComponent = {}
      
      place.address_components.forEach((component: any) => {
        const type = component.types[0]
        
        switch (type) {
          case 'street_number':
            addressData.street_number = component.long_name
            break
          case 'route':
            addressData.route = component.long_name
            break
          case 'locality':
            addressData.locality = component.long_name
            break
          case 'administrative_area_level_2':
            addressData.administrative_area_level_2 = component.short_name
            break
          case 'administrative_area_level_1':
            addressData.administrative_area_level_1 = component.short_name
            break
          case 'postal_code':
            addressData.postal_code = component.long_name
            break
          case 'country':
            addressData.country = component.long_name
            break
        }
      })

      // Emit the parsed address data
      emit('update:modelValue', place.formatted_address || '')
      emit('place-selected', {
        placeId: place.place_id,
        formattedAddress: place.formatted_address,
        addressComponents: addressData,
        geometry: {
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng()
        }
      })
    })
  } catch (error) {
    console.error('Error loading Google Maps:', error)
  }
})
</script>