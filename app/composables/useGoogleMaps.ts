let isInitialized = false
let isLoading = false
let loadPromise: Promise<void> | null = null

export const useGoogleMaps = () => {
  const config = useRuntimeConfig()

  const loadGoogleMapsScript = (): Promise<void> => {
    // Return existing promise if already loading
    if (loadPromise) return loadPromise

    // Return immediately if already initialized
    if (isInitialized) return Promise.resolve()

    // Start loading
    if (isLoading) return loadPromise!

    isLoading = true

    loadPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if ((window as any).google?.maps) {
        isInitialized = true
        isLoading = false
        resolve()
        return
      }

      // Create script element
      const script = document.createElement('script')
      const apiKey = config.public.googleMapsApiKey
      
      // Debug: Log the API key (first/last 4 chars only for security)
      if (apiKey) {
        console.log('Google Maps API Key:', `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`)
      } else {
        console.error('Google Maps API Key is not set!')
      }
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=Function.prototype`
      script.async = true
      script.defer = true

      script.onload = () => {
        isInitialized = true
        isLoading = false
        resolve()
      }

      script.onerror = () => {
        isLoading = false
        loadPromise = null
        reject(new Error('Failed to load Google Maps script'))
      }

      document.head.appendChild(script)
    })

    return loadPromise
  }

  return {
    loadGoogleMapsScript,
    isInitialized: () => isInitialized
  }
}
