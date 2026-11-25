export const CRIPTOMONEDAS = [
  { id: 'bitcoin', nombre: 'Bitcoin', simbolo: 'BTC' },
  { id: 'ethereum', nombre: 'Ethereum', simbolo: 'ETH' },
  { id: 'solana', nombre: 'Solana', simbolo: 'SOL' },
] as const;

export type CryptoId = (typeof CRIPTOMONEDAS)[number]['id'];
export type FiltroCriptomoneda = 'todas' | CryptoId;

export interface Criptomoneda {
  id: CryptoId;
  nombre: string;
  simbolo: string;
  precioUsd: number;
}

export interface FiltrosConsulta {
  texto: string;
  criptomoneda: FiltroCriptomoneda;
}

export function esCryptoId(value: unknown): value is CryptoId {
  return (
    typeof value === 'string' &&
    CRIPTOMONEDAS.some((criptomoneda) => criptomoneda.id === value)
  );
}
