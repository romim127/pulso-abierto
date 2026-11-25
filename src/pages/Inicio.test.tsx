import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Inicio } from './Inicio';
import { useFavoritosStore } from '../store/favoritos';

const RESPUESTA_API = {
  bitcoin: { usd: 61_000 },
  ethereum: { usd: 1_700 },
  solana: { usd: 70 },
};

function respuestaOk(): Response {
  return new Response(JSON.stringify(RESPUESTA_API), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function renderInicio() {
  return render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>,
  );
}

describe('consulta de cotizaciones', () => {
  beforeEach(() => {
    useFavoritosStore.setState({ favoritos: [] });
    localStorage.clear();
  });

  it('muestra la carga y luego las tres cotizaciones', async () => {
    const user = userEvent.setup();
    let resolver: ((response: Response) => void) | undefined;
    const respuestaPendiente = new Promise<Response>((resolve) => {
      resolver = resolve;
    });
    const fetchMock = vi.fn<typeof fetch>().mockReturnValue(respuestaPendiente);
    vi.stubGlobal('fetch', fetchMock);
    renderInicio();

    await user.click(screen.getByRole('button', { name: /consultar precios/i }));
    expect(screen.getByRole('status')).toHaveTextContent('Consultando CoinGecko');

    await act(async () => {
      resolver?.(respuestaOk());
    });

    expect(await screen.findByRole('link', { name: 'Bitcoin' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Ethereum' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Solana' })).toBeVisible();
    expect(screen.getByText('FAVORITAS · 0')).toBeVisible();
  });

  it('no consulta con un texto inválido y muestra el error junto al campo', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn<typeof fetch>();
    vi.stubGlobal('fetch', fetchMock);
    renderInicio();

    await user.type(
      screen.getByRole('searchbox', { name: 'Buscar por nombre o símbolo' }),
      'x',
    );
    await user.click(screen.getByRole('button', { name: /consultar precios/i }));

    expect(
      screen.getByText('Ingresá al menos 2 caracteres o dejá el campo vacío.'),
    ).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('muestra un error comprensible y permite reintentar', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockRejectedValueOnce(new TypeError('network unavailable'))
      .mockResolvedValueOnce(respuestaOk());
    vi.stubGlobal('fetch', fetchMock);
    renderInicio();

    await user.click(screen.getByRole('button', { name: /consultar precios/i }));
    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent('Revisá tu conexión a internet');
    const reintentar = screen.getByRole('button', { name: /volver a intentar/i });
    expect(reintentar).toBeVisible();

    await user.click(reintentar);
    expect(await screen.findByRole('link', { name: 'Bitcoin' })).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
