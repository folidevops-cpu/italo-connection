<template>
  <div
    v-if="announcement && !isDismissed"
    class="announcement-banner"
    :class="[`announcement-${announcement.type}`, { 'slide-in': isVisible }]"
  >
    <div class="announcement-container">
      <div class="announcement-content">
        <div class="announcement-icon">
          <span v-if="announcement.type === 'info'">ℹ️</span>
          <span v-else-if="announcement.type === 'warning'">⚠️</span>
          <span v-else-if="announcement.type === 'success'">✅</span>
          <span v-else-if="announcement.type === 'error'">❌</span>
        </div>
        <div class="announcement-text">
          <h3 v-if="announcement.title" class="announcement-title">
            {{ announcement.title }}
          </h3>
          <p class="announcement-message">{{ announcement.message }}</p>
        </div>
      </div>
      <button
        @click="dismissAnnouncement"
        class="announcement-close"
        aria-label="Close announcement"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const announcement = ref<any>(null)
const isDismissed = ref(false)
const isVisible = ref(false)

// Fetch active announcement on mount
onMounted(async () => {
  try {
    const response = await $fetch('/api/announcements/active')
    if (response.success && response.announcement) {
      announcement.value = response.announcement
      
      // Check if user has dismissed this announcement in this session
      const dismissedId = sessionStorage.getItem('dismissedAnnouncementId')
      if (dismissedId === response.announcement.id) {
        isDismissed.value = true
      } else {
        // Show with animation
        setTimeout(() => {
          isVisible.value = true
        }, 100)
      }
    }
  } catch (error) {
    console.error('Failed to fetch announcement:', error)
  }
})

// Dismiss announcement
const dismissAnnouncement = () => {
  if (announcement.value) {
    // Store dismissed announcement ID in session storage
    sessionStorage.setItem('dismissedAnnouncementId', announcement.value.id)
  }
  isVisible.value = false
  setTimeout(() => {
    isDismissed.value = true
  }, 300) // Wait for animation to complete
}
</script>

<style scoped>
.announcement-banner {
  width: 100%;
  position: relative;
  z-index: 40;
  opacity: 0;
  transform: translateY(-100%);
  transition: all 0.3s ease-in-out;
}

.announcement-banner.slide-in {
  opacity: 1;
  transform: translateY(0);
}

.announcement-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.announcement-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
}

.announcement-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.announcement-text {
  flex: 1;
}

.announcement-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.announcement-message {
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.announcement-close {
  flex-shrink: 0;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.announcement-close:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.announcement-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Type-specific colors */
.announcement-info {
  background-color: #dbeafe;
  border-bottom: 2px solid #3b82f6;
  color: #1e40af;
}

.announcement-info .announcement-close:hover {
  background-color: #bfdbfe;
}

.announcement-warning {
  background-color: #fef3c7;
  border-bottom: 2px solid #f59e0b;
  color: #92400e;
}

.announcement-warning .announcement-close:hover {
  background-color: #fde68a;
}

.announcement-success {
  background-color: #d1fae5;
  border-bottom: 2px solid #10b981;
  color: #065f46;
}

.announcement-success .announcement-close:hover {
  background-color: #a7f3d0;
}

.announcement-error {
  background-color: #fee2e2;
  border-bottom: 2px solid #ef4444;
  color: #991b1b;
}

.announcement-error .announcement-close:hover {
  background-color: #fecaca;
}

/* Responsive design */
@media (max-width: 768px) {
  .announcement-container {
    padding: 0.875rem 1rem;
    gap: 0.75rem;
  }

  .announcement-icon {
    font-size: 1.25rem;
  }

  .announcement-title {
    font-size: 0.9375rem;
  }

  .announcement-message {
    font-size: 0.8125rem;
  }
}
</style>
