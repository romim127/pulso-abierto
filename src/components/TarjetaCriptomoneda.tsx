import { Link } from 'react-router-dom';
import type { Criptomoneda } from '../types/crypto';
import { ICONOS_CRIPTOMONEDAS } from '../constants/crypto';
import { BotonFavorito } from './BotonFavorito';

type TarjetaCriptomonedaProps = {
  criptomoneda: Criptomoneda;
};

const formateadorUsd = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

export function TarjetaCriptomoneda({ criptomoneda }: TarjetaCriptomonedaProps) {
  return (
    <article className="coin-card">
      <div className="coin-head">
        <span className="coin-icon" aria-hidden="true">
          {ICONOS_CRIPTOMONEDAS[criptomoneda.id]}
        </span>
        <div>
          <Link
            className="coin-detail-link"
            to={`/criptomonedas/${criptomoneda.id}`}
          >
            <h3 className="coin-name">{criptomoneda.nombre}</h3>
          </Link>
          <div className="coin-code">{criptomoneda.simbolo}</div>
        </div>
      </div>

      <div className="coin-label">Precio actual</div>
      <div className="coin-price">
        ${formateadorUsd.format(criptomoneda.precioUsd)} <small>USD</small>
      </div>

      <BotonFavorito criptomonedaId={criptomoneda.id} />
    </article>
  );
}
