<template>
  <div>
    <label 
      v-if="label" 
      :for="selectId" 
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="selectId"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="handleChange"
      @blur="handleBlur"
      class="w-full border rounded-md px-3 py-2.5 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      :class="[
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        customClass
      ]"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <p v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  options: {
    type: Array as () => Option[],
    required: true,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
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
  customClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

// Generate unique ID for label association
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

// Handle change event
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}

// Handle blur event for validation
const handleBlur = (event: Event) => {
  emit('blur', event)
}
</script>