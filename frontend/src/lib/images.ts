/** Product image helper (Unsplash CDN paths used for placeholders / legacy assets) */
export function photo(id: string, width = 900) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}
