/** Remove the retired Begoro alias from farm-location text during display. */
export function displayFarmLocationText(value: string | null) {
  return value?.replace(/begoro\s*\(\s*agora\s+darko\s*\)/gi, "Begoro") ?? value;
}

export function displayFarmLocationName(name: string) {
  return displayFarmLocationText(name) ?? name;
}
