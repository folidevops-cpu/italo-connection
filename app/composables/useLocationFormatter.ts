/**
 * Composable for formatting location strings
 * Converts long addresses to "Town, Country" format
 */
export const useLocationFormatter = () => {
  /**
   * Formats a location string to show only town and country
   * Examples:
   * - "Strada Napoleonica, 34151 Opicina TS, Italy" -> "Opicina, Italy"
   * - "Bologna, Italy" -> "Bologna, Italy" (already formatted)
   * - "Via Roma, 123, Milan, Italy" -> "Milan, Italy"
   * 
   * @param location - The full location string
   * @returns Formatted location as "Town, Country"
   */
  const formatLocation = (location: string | null | undefined): string => {
    if (!location) return 'Location not specified'
    
    // If already in simple format (contains only one comma), return as is
    const parts = location.split(',').map(part => part.trim())
    
    if (parts.length <= 2) {
      return location
    }
    
    // For longer addresses, extract the last part (country) and the second-to-last significant part (town)
    // Remove parts that are just postal codes or provinces (2-3 chars or all numbers)
    const filteredParts = parts.filter(part => {
      // Keep if not empty and not just postal code/province code
      return part && 
             part.length > 3 && 
             !/^\d+$/.test(part) && // Not all numbers
             !/^[A-Z]{2,3}$/.test(part) // Not 2-3 uppercase letters (province code)
    })
    
    // Get the last part (country) and second-to-last (town/city)
    if (filteredParts.length >= 2) {
      const country = filteredParts[filteredParts.length - 1]
      const town = filteredParts[filteredParts.length - 2]
      return `${town}, ${country}`
    }
    
    // Fallback: just return the original if we can't parse it properly
    return location
  }
  
  return {
    formatLocation
  }
}
