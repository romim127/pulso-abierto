import { afterEach, describe, expect, it, vi } from 'vitest';
import { obtenerPrecios } from './coingecko';

describe('obtenerPrecios', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('normaliza una respuesta HTTP exitosa al modelo de la aplicación', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          bitcoin: { usd: 61_000 },
          ethereum: { usd: 1_700 },
          solana: { usd: 70 },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(obtenerPrecios()).resolves.toEqual([
      {
        id: 'bitcoin',
        nombre: 'Bitcoin',
        simbolo: 'BTC',
        precioUsd: 61_000,
      },
      {
        id: 'ethereum',
        nombre: 'Ethereum',
        simbolo: 'ETH',
        precioUsd: 1_700,
      },
      {
        id: 'solana',
        nombre: 'Solana',
        simbolo: 'SOL',
        precioUsd: 70,
      },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rechaza una respuesta HTTP no exitosa', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response('', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(obtenerPrecios()).rejects.toMatchObject({
      name: 'ErrorCoinGecko',
      tipo: 'http',
      estadoHttp: 503,
    });
  });
});
