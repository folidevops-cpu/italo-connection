<template>
  <div class="relative">
    <img 
      v-if="avatarUrl"
      :src="avatarUrl" 
      :alt="name || 'User Avatar'"
      :class="`rounded-full object-cover ${sizeClass} ${borderClass}`"
    />
    <div 
      v-else
      :class="`rounded-full flex items-center justify-center ${sizeClass} ${borderClass} ${avatarData.color}`"
    >
      <span :class="`font-bold ${avatarData.textColor} ${textSizeClass}`">
        {{ avatarData.initial }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  avatarUrl?: string | null
  name?: string | null
  displayName?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  border?: boolean
  borderColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  border: false,
  borderColor: 'border-gray-200'
})

const { getAvatarData } = useAvatar()

// Avatar data computed property
const avatarData = computed(() => {
  // Use name for the avatar, with displayName as fallback
  const userName = props.name || props.displayName || 'User'
  const seed = props.displayName || props.name || 'default'
  return getAvatarData(userName, seed)
})

// Size classes
const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8', 
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32'
}

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl'
}

const sizeClass = computed(() => sizeClasses[props.size])
const textSizeClass = computed(() => textSizeClasses[props.size])
const borderClass = computed(() => props.border ? `border-4 ${props.borderColor}` : '')
</script>