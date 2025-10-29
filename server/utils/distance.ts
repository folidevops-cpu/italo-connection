/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Sort items by distance from a given location
 * @param items - Array of items with latitude and longitude
 * @param userLat - User's latitude
 * @param userLon - User's longitude
 * @returns Sorted array with distance property added
 */
export function sortByDistance<T extends { latitude: number | null; longitude: number | null }>(
  items: T[],
  userLat: number,
  userLon: number
): (T & { distance: number | null })[] {
  return items
    .map(item => {
      if (item.latitude && item.longitude) {
        const distance = calculateDistance(userLat, userLon, item.latitude, item.longitude)
        return { ...item, distance }
      }
      return { ...item, distance: null }
    })
    .sort((a, b) => {
      // Items with null distance go to the end
      if (a.distance === null) return 1
      if (b.distance === null) return -1
      return a.distance - b.distance
    })
}
