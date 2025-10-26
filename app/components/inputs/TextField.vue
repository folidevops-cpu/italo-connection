<template>
  <div>

    <div v-if="$slots.label || label" class="mb-2">
      <slot name="label">
        <label 
          :for="inputId" 
          class="block text-sm font-medium text-gray-700"
        >
          {{ label }}
          <span v-if="required" class="text-red-500">*</span>
        </label>
      </slot>
    </div>
    
    <!-- <label 
      v-if="label" 
      :for="inputId" 
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label> -->
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="customClass"
    />
    <p v-if="hint" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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
  },
  min: {
  type: [String, Number],
  default: undefined
},
step: {
  type: [String, Number],
  default: undefined
}
})

defineEmits(['update:modelValue'])

// Generate unique ID for label association
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)
</script>