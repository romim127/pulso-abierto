import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ListaCriptomonedas } from '../components/ListaCriptomonedas';
import { Detalle } from '../pages/Detalle';
import { crearFavoritosStore, useFavoritosStore } from './favoritos';
import { CRIPTOMONEDAS, type Criptomoneda } from '../types/crypto';

const CRIPTOS: Criptomoneda[] = CRIPTOMONEDAS.map((cripto, index) => ({
  ...cripto,
  precioUsd: 100 + index,
}));

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

function botonFavoritoDe(cripto: string) {
  const enlace = screen.getByRole('link', { name: cripto });
  const tarjeta = enlace.closest('article');
  if (!tarjeta) {
    throw new Error(`No se encontró la tarjeta de ${cripto}.`);
  }

  return within(tarjeta).getByRole('button');
}

function RutasFavoritos() {
  return (
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route
          path="/"
          element={<ListaCriptomonedas criptomonedas={CRIPTOS} />}
        />
        <Route path="/criptomonedas/:id" element={<Detalle />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('favoritos compartidos y persistidos', () => {
  beforeEach(() => {
    useFavoritosStore.setState({ favoritos: [] });
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respuestaOk()));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sincroniza el cambio entre listado y detalle', async () => {
    const user = userEvent.setup();
    render(<RutasFavoritos />);

    await user.click(botonFavoritoDe('Bitcoin'));
    expect(botonFavoritoDe('Bitcoin')).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('link', { name: 'Bitcoin' }));
    const botonDetalle = await screen.findByRole('button', {
      name: '★ Favorita',
    });
    expect(botonDetalle).toHaveAttribute('aria-pressed', 'true');

    await user.click(botonDetalle);
    expect(botonDetalle).toHaveAttribute('aria-pressed', 'false');

    await user.click(
      screen.getByRole('link', { name: 'Volver a cotizaciones' }),
    );
    expect(botonFavoritoDe('Bitcoin')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('rehidrata los IDs guardados y persiste también el desmarcado', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <MemoryRouter>
        <ListaCriptomonedas criptomonedas={CRIPTOS} />
      </MemoryRouter>,
    );

    await user.click(botonFavoritoDe('Bitcoin'));
    const clave = 'pulso-abierto-favoritos';
    const favoritoGuardado = localStorage.getItem(clave);
    expect(JSON.parse(favoritoGuardado ?? '{}').state.favoritos).toEqual([
      'bitcoin',
    ]);

    unmount();
    const storeRehidratado = crearFavoritosStore();
    expect(storeRehidratado.getState().favoritos).toEqual(['bitcoin']);

    render(
      <MemoryRouter>
        <ListaCriptomonedas criptomonedas={CRIPTOS} />
      </MemoryRouter>,
    );
    const boton = botonFavoritoDe('Bitcoin');
    expect(boton).toHaveAttribute('aria-pressed', 'true');

    await user.click(boton);
    const desmarcado = localStorage.getItem(clave);
    expect(JSON.parse(desmarcado ?? '{}').state.favoritos).toEqual([]);
    expect(desmarcado).not.toContain('alternarFavorito');
    expect(desmarcado).not.toContain('error');
    expect(desmarcado).not.toContain('carga');
    expect(crearFavoritosStore().getState().favoritos).toEqual([]);
  });
});
