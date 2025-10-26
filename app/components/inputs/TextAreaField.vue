<template>
  <div>
    <label 
      v-if="label" 
      :for="textareaId" 
      class="block text-sm font-medium text-gray-700 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="textareaId"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      :maxlength="maxlength"
      :minlength="minlength"
      @input="handleInput"
      @blur="handleBlur"
      class="mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed resize-y transition-colors"
      :class="[
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        customClass
      ]"
    />
    <div v-if="maxlength" class="mt-1 text-xs text-gray-500 text-right">
      {{ (modelValue as string)?.length || 0 }} / {{ maxlength }} characters
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
interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxlength?: number;
  minlength?: number;
  customClass?: string;
  showCharCount?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  placeholder: '',
  error: '',
  hint: '',
  required: false,
  disabled: false,
  rows: 4,
  maxlength: undefined,
  minlength: undefined,
  customClass: '',
  showCharCount: true
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'blur', event: Event): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: Event) => {
  emit('blur', event);
};

const textareaId = `textarea-${Math.random().toString(36).substring(2, 9)}`;

const characterCount = computed(() => {
  return props.modelValue?.length || 0;
});

const isNearLimit = computed(() => {
  if (!props.maxlength) return false;
  const percentage = (characterCount.value / props.maxlength) * 100;
  return percentage >= 80;
});
</script>
