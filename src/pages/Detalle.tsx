import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { BotonFavorito } from '../components/BotonFavorito';
import { ICONOS_CRIPTOMONEDAS } from '../constants/crypto';
import { NoEncontrada } from './NoEncontrada';
import { obtenerPrecios } from '../services/coingecko';
import {
  CRIPTOMONEDAS,
  esCryptoId,
  type Criptomoneda,
  type CryptoId,
} from '../types/crypto';

type EstadoDetalle =
  | { tipo: 'carga' }
  | { tipo: 'resultado'; criptomoneda: Criptomoneda }
  | { tipo: 'vacio' }
  | { tipo: 'error' };

type DetalleValidadoProps = {
  id: CryptoId;
};

function DetalleValidado({ id }: DetalleValidadoProps) {
  const [estado, setEstado] = useState<EstadoDetalle>({ tipo: 'carga' });
  const [intentos, setIntentos] = useState(0);
  const metadata = CRIPTOMONEDAS.find((cripto) => cripto.id === id);

  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;

    async function cargarDetalle() {
      try {
        const precios = await obtenerPrecios(controlador.signal);
        if (!vigente) {
          return;
        }

        const criptomoneda = precios.find((precio) => precio.id === id);
        setEstado(
          criptomoneda
            ? { tipo: 'resultado', criptomoneda }
            : { tipo: 'vacio' },
        );
      } catch {
        if (vigente && !controlador.signal.aborted) {
          setEstado({ tipo: 'error' });
        }
      }
    }

    void cargarDetalle();

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [id, intentos]);

  if (!metadata) {
    return <NoEncontrada />;
  }

  if (estado.tipo === 'carga' || estado.tipo === 'vacio' || estado.tipo === 'error') {
    const estadoConsulta =
      estado.tipo === 'carga'
        ? 'carga'
        : estado.tipo === 'error'
          ? 'error'
          : 'vacio';

    return (
      <main id="contenido" className="container detail-page">
        <div className="section-kicker">DETALLE / {metadata.simbolo}</div>
        <h1>{metadata.nombre}</h1>
        <EstadoConsulta
          estado={estadoConsulta}
          cantidad={0}
          esSimulado={false}
          mensajeError="No pudimos cargar esta cotización. Revisá tu conexión e intentá nuevamente."
          onReintentar={() => {
            setEstado({ tipo: 'carga' });
            setIntentos((actuales) => actuales + 1);
          }}
        />
        <Link className="page-link" to="/">
          Volver a cotizaciones
        </Link>
      </main>
    );
  }

  const { criptomoneda } = estado;
  const precio = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(criptomoneda.precioUsd);

  return (
    <main id="contenido" className="container detail-page">
      <div className="section-kicker">DETALLE / {criptomoneda.simbolo}</div>
      <h1>{criptomoneda.nombre}</h1>
      <article className="coin-card detail-card">
        <div className="coin-head">
          <span className="coin-icon" aria-hidden="true">
            {ICONOS_CRIPTOMONEDAS[criptomoneda.id]}
          </span>
          <div>
            <h2 className="coin-name">{criptomoneda.nombre}</h2>
            <div className="coin-code">{criptomoneda.simbolo}</div>
          </div>
        </div>
        <div className="coin-label">Precio actual</div>
        <div className="coin-price">{precio}</div>
        <BotonFavorito criptomonedaId={criptomoneda.id} />
      </article>
      <Link className="page-link" to="/">
        Volver a cotizaciones
      </Link>
    </main>
  );
}

export function Detalle() {
  const { id } = useParams();

  if (!esCryptoId(id)) {
    return <NoEncontrada mensaje="No encontramos esa criptomoneda." />;
  }

  return <DetalleValidado key={id} id={id} />;
}
