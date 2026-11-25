import type { Criptomoneda } from '../types/crypto';
import { TarjetaCriptomoneda } from './TarjetaCriptomoneda';

type ListaCriptomonedasProps = {
  criptomonedas: Criptomoneda[];
};

export function ListaCriptomonedas({
  criptomonedas,
}: ListaCriptomonedasProps) {
  if (criptomonedas.length === 0) {
    return (
      <p className="status status-empty" role="status">
        No hay criptomonedas que coincidan con los filtros seleccionados.
      </p>
    );
  }

  return (
    <div className="cards" aria-label="Resultados de la consulta">
      {criptomonedas.map((criptomoneda) => (
        <TarjetaCriptomoneda
          key={criptomoneda.id}
          criptomoneda={criptomoneda}
        />
      ))}
    </div>
  );
}
