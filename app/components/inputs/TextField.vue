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
      :min="min"
      :max="max"
      :step="step"
      :minlength="minlength"
      :maxlength="maxlength"
      :pattern="pattern"
      @input="handleInput"
      @blur="handleBlur"
      class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
      :class="[
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        customClass
      ]"
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
const props = defineProps({
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
  max: {
    type: [String, Number],
    default: undefined
  },
  step: {
    type: [String, Number],
    default: undefined
  },
  minlength: {
    type: Number,
    default: undefined
  },
  maxlength: {
    type: Number,
    default: undefined
  },
  pattern: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

// Generate unique ID for label association
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Handle input with validation
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  // Convert to number for number inputs
  if (props.type === 'number' && value !== '') {
    value = parseFloat(value)
  }
  
  emit('update:modelValue', value)
}

// Handle blur event for validation
const handleBlur = (event: Event) => {
  emit('blur', event)
}
</script>