import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CryptoId } from '../types/crypto';

type EstadoFavoritos = {
  favoritos: CryptoId[];
  alternarFavorito: (id: CryptoId) => void;
};

type FavoritosPersistidos = Pick<EstadoFavoritos, 'favoritos'>;

export function crearFavoritosStore() {
  return create<EstadoFavoritos>()(
    persist<EstadoFavoritos, [], [], FavoritosPersistidos>(
      (set) => ({
        favoritos: [],
        alternarFavorito: (id) =>
          set((state) => ({
            favoritos: state.favoritos.includes(id)
              ? state.favoritos.filter((favorito) => favorito !== id)
              : [...state.favoritos, id],
          })),
      }),
      {
        name: 'pulso-abierto-favoritos',
        partialize: ({ favoritos }) => ({ favoritos }),
      },
    ),
  );
}

export const useFavoritosStore = crearFavoritosStore();
