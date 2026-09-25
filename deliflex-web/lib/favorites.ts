// Equivalente web de favorites.storage.ts en la app movil: ahi los
// favoritos se guardan en AsyncStorage (local al telefono, nunca en el
// backend), asi que no hay ninguna tabla en Supabase de donde traerlos -
// esto simplemente replica el mismo patron "local a este dispositivo" con
// localStorage.
const FAVORITES_KEY = "deliflex_favorite_stores";

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(storeId: string): boolean {
  return getFavoriteIds().includes(storeId);
}

export function toggleFavorite(storeId: string): string[] {
  const ids = getFavoriteIds();
  const next = ids.includes(storeId)
    ? ids.filter((id) => id !== storeId)
    : [...ids, storeId];

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  } catch {
    // Sin localStorage disponible (modo privado, etc.): el cambio no persiste.
  }

  return next;
}
