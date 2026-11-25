import type { CryptoId } from '../types/crypto';
import { useFavoritosStore } from '../store/favoritos';

type BotonFavoritoProps = {
  criptomonedaId: CryptoId;
};

export function BotonFavorito({ criptomonedaId }: BotonFavoritoProps) {
  const esFavorita = useFavoritosStore((state) =>
    state.favoritos.includes(criptomonedaId),
  );
  const alternarFavorito = useFavoritosStore(
    (state) => state.alternarFavorito,
  );

  return (
    <button
      className="favorite-button"
      type="button"
      aria-pressed={esFavorita}
      onClick={() => alternarFavorito(criptomonedaId)}
    >
      {esFavorita ? '★ Favorita' : '☆ Marcar favorita'}
    </button>
  );
}
