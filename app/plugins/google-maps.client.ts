export default defineNuxtPlugin(async () => {
  const { loadGoogleMapsScript } = useGoogleMaps()
  
  // Load Google Maps script on app start
  try {
    await loadGoogleMapsScript()
    console.log('Google Maps loaded successfully')
  } catch (error) {
    console.error('Failed to load Google Maps:', error)
  }
})
