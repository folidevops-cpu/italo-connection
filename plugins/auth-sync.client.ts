export default defineNuxtPlugin(() => {
  const { fetch } = useUserSession()
  
  // Sync session on route change to ensure UI is always up to date
  const router = useRouter()
  
  router.afterEach(async () => {
    try {
      await fetch()
    } catch (error) {
      // Ignore errors during session sync
    }
  })
})