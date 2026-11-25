import { useEffect, useMemo, useRef, useState } from 'react';
import { ConsultaForm } from '../components/ConsultaForm';
import { EstadoConsulta } from '../components/EstadoConsulta';
import { ListaCriptomonedas } from '../components/ListaCriptomonedas';
import { ErrorCoinGecko, obtenerPrecios } from '../services/coingecko';
import { useFavoritosStore } from '../store/favoritos';
import type {
  Criptomoneda,
  FiltrosConsulta,
} from '../types/crypto';

type Estado = 'inicial' | 'carga' | 'resultado' | 'vacio' | 'error';

const FILTROS_INICIALES: FiltrosConsulta = {
  texto: '',
  criptomoneda: 'todas',
};

function describirError(error: unknown): string {
  if (!(error instanceof ErrorCoinGecko)) {
    return 'Ocurrió un problema inesperado. Podés volver a intentarlo.';
  }

  switch (error.tipo) {
    case 'http':
      return 'CoinGecko respondió con un error. Volvé a intentarlo en unos instantes.';
    case 'red':
      return 'Revisá tu conexión a internet e intentá nuevamente.';
    case 'datos':
      return 'CoinGecko devolvió una respuesta inválida. Volvé a intentarlo.';
    case 'tiempo':
      return 'La consulta superó el tiempo de espera. Volvé a intentarlo.';
  }
}

export function Inicio() {
  const [criptomonedas, setCriptomonedas] = useState<Criptomoneda[]>([]);
  const [estado, setEstado] = useState<Estado>('inicial');
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [esSimulado, setEsSimulado] = useState(false);
  const cantidadFavoritos = useFavoritosStore(
    (state) => state.favoritos.length,
  );
  const solicitudActual = useRef<AbortController | null>(null);
  const numeroSolicitud = useRef(0);
  const ultimaConsulta = useRef(FILTROS_INICIALES);

  useEffect(
    () => () => {
      solicitudActual.current?.abort();
      numeroSolicitud.current += 1;
    },
    [],
  );

  const criptomonedasVisibles = useMemo(
    () =>
      criptomonedas.filter((criptomoneda) => {
        const coincideTexto =
          criptomoneda.nombre.toLocaleLowerCase().includes(filtros.texto) ||
          criptomoneda.simbolo.toLocaleLowerCase().includes(filtros.texto);
        const coincideSeleccion =
          filtros.criptomoneda === 'todas' ||
          criptomoneda.id === filtros.criptomoneda;

        return coincideTexto && coincideSeleccion;
      }),
    [criptomonedas, filtros],
  );

  async function consultarPrecios(criterios: FiltrosConsulta) {
    solicitudActual.current?.abort();
    const controlador = new AbortController();
    solicitudActual.current = controlador;
    const numero = ++numeroSolicitud.current;

    ultimaConsulta.current = criterios;
    setFiltros(criterios);
    setEstado('carga');
    setEsSimulado(false);
    setMensajeError(null);
    setCriptomonedas([]);

    try {
      const datos = await obtenerPrecios(controlador.signal);

      if (numero !== numeroSolicitud.current) {
        return;
      }

      setCriptomonedas(datos);
      setEstado(datos.length > 0 ? 'resultado' : 'vacio');
    } catch (error) {
      if (controlador.signal.aborted || numero !== numeroSolicitud.current) {
        return;
      }

      setCriptomonedas([]);
      setMensajeError(describirError(error));
      setEstado('error');
    }
  }

  function simularEstado(nuevoEstado: Estado) {
    if (estado === 'carga' && !esSimulado) {
      return;
    }

    solicitudActual.current?.abort();
    numeroSolicitud.current += 1;
    setEsSimulado(true);
    setMensajeError(null);
    setEstado(nuevoEstado);
  }

  return (
    <main id="contenido" className="container">
      <section className="hero" aria-labelledby="titulo">
        <div className="eyebrow">
          <span className="live-dot" aria-hidden="true" />
          CONSULTA DE MERCADO
        </div>
        <h1 id="titulo">
          El mercado, <span>en perspectiva.</span>
        </h1>
        <p className="lead">
          Consultá el precio de Bitcoin, Ethereum y Solana en dólares
          estadounidenses, con información proporcionada por CoinGecko.
        </p>
        <ConsultaForm
          estaCargando={estado === 'carga' && !esSimulado}
          onBuscar={(criterios) => void consultarPrecios(criterios)}
        />
      </section>

      <section className="dashboard" aria-labelledby="precios-titulo">
        <div className="section-heading">
          <div>
            <div className="section-kicker">PANEL DE CONSULTA / 001</div>
            <h2 id="precios-titulo">Cotizaciones</h2>
          </div>
          <div className="dashboard-badges">
            <span className="currency-chip">MONEDA · USD</span>
            <span className="currency-chip">
              FAVORITAS · {cantidadFavoritos}
            </span>
          </div>
        </div>

        <EstadoConsulta
          estado={estado}
          cantidad={criptomonedasVisibles.length}
          esSimulado={esSimulado}
          mensajeError={mensajeError}
          onReintentar={() => void consultarPrecios(ultimaConsulta.current)}
        />

        {estado === 'resultado' && (
          <ListaCriptomonedas
            criptomonedas={criptomonedasVisibles}
          />
        )}
      </section>

      <details className="test-panel">
        <summary>Pruebas de estados de interfaz</summary>
        <p>
          Estos controles simulan estados para comprobar la interfaz. No
          consultan ni sustituyen datos reales de CoinGecko.
        </p>
        <div className="test-actions">
          <button
            type="button"
            disabled={estado === 'carga' && !esSimulado}
            onClick={() => simularEstado('carga')}
          >
            Simular carga
          </button>
          <button
            type="button"
            disabled={estado === 'carga' && !esSimulado}
            onClick={() => simularEstado('vacio')}
          >
            Simular vacío
          </button>
          <button
            type="button"
            disabled={estado === 'carga' && !esSimulado}
            onClick={() => simularEstado('error')}
          >
            Simular error
          </button>
          <button
            type="button"
            disabled={estado === 'carga' && !esSimulado}
            onClick={() => simularEstado('inicial')}
          >
            Estado inicial
          </button>
        </div>
      </details>
    </main>
  );
}
