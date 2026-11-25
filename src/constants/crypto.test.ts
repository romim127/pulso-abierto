import { describe, expect, it } from 'vitest';
import { ICONOS_CRIPTOMONEDAS } from './crypto';

describe('iconos de criptomonedas', () => {
  it('mantiene los iconos visibles de cada criptomoneda admitida', () => {
    expect(ICONOS_CRIPTOMONEDAS).toEqual({
      bitcoin: '₿',
      ethereum: 'Ξ',
      solana: '◎',
    });
  });
});
