import {
  CRIPTOMONEDAS,
  type Criptomoneda,
} from '../types/crypto';

export type TipoErrorCoinGecko = 'http' | 'red' | 'datos' | 'tiempo';

export class ErrorCoinGecko extends Error {
  constructor(
    public readonly tipo: TipoErrorCoinGecko,
    public readonly estadoHttp?: number,
  ) {
    super('No se pudieron obtener cotizaciones válidas de CoinGecko.');
    this.name = 'ErrorCoinGecko';
  }
}

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price' +
  '?ids=bitcoin,ethereum,solana&vs_currencies=usd';

function esObjeto(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function procesarRespuesta(payload: unknown): Criptomoneda[] {
  if (!esObjeto(payload)) {
    throw new ErrorCoinGecko('datos');
  }

  return CRIPTOMONEDAS.flatMap((criptomoneda) => {
    const cotizacion = payload[criptomoneda.id];

    if (cotizacion === undefined) {
      return [];
    }

    if (
      !esObjeto(cotizacion) ||
      typeof cotizacion.usd !== 'number' ||
      !Number.isFinite(cotizacion.usd)
    ) {
      throw new ErrorCoinGecko('datos');
    }

    return [{ ...criptomoneda, precioUsd: cotizacion.usd }];
  });
}

export async function obtenerPrecios(
  signal?: AbortSignal,
): Promise<Criptomoneda[]> {
  const controlador = new AbortController();
  const reenviarCancelacion = () => controlador.abort();
  signal?.addEventListener('abort', reenviarCancelacion, { once: true });
  if (signal?.aborted) {
    controlador.abort();
  }
  const temporizador = setTimeout(() => controlador.abort(), 12_000);

  try {
    let response: Response;

    try {
      response = await fetch(API_URL, {
        signal: controlador.signal,
        headers: { Accept: 'application/json' },
      });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }

      if (controlador.signal.aborted) {
        throw new ErrorCoinGecko('tiempo');
      }

      throw new ErrorCoinGecko('red');
    }

    if (!response.ok) {
      throw new ErrorCoinGecko('http', response.status);
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }

      if (controlador.signal.aborted) {
        throw new ErrorCoinGecko('tiempo');
      }

      throw new ErrorCoinGecko('datos');
    }

    return procesarRespuesta(payload);
  } finally {
    clearTimeout(temporizador);
    signal?.removeEventListener('abort', reenviarCancelacion);
  }
}
