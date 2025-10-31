/**
 * Composable for generating default avatar colors and initials
 */
export const useAvatar = () => {
  // Predefined color palette for avatars
  const colors = [
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500',
    'bg-lime-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-rose-500',
    'bg-sky-500'
  ]

  /**
   * Generate a consistent color based on a string (like username or displayName)
   */
  const getAvatarColor = (str: string): string => {
    if (!str) return colors[0]
    
    // Simple hash function to get consistent color for same string
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Get color based on hash
    const colorIndex = Math.abs(hash) % colors.length
    return colors[colorIndex]
  }

  /**
   * Get the first letter (initial) from a name or username
   */
  const getInitial = (name: string | null | undefined): string => {
    if (!name || name.trim() === '') return 'U'
    return name.trim().charAt(0).toUpperCase()
  }

  /**
   * Get avatar data including initial and color
   */
  const getAvatarData = (name: string | null | undefined, colorSeed?: string) => {
    const initial = getInitial(name)
    const seedString = colorSeed || name || 'default'
    const color = getAvatarColor(seedString)
    
    return {
      initial,
      color,
      textColor: 'text-white' // White text for good contrast on all backgrounds
    }
  }

  return {
    getAvatarColor,
    getInitial,
    getAvatarData
  }
}