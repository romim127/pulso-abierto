import { Link } from 'react-router-dom';

type NoEncontradaProps = {
  mensaje?: string;
};

export function NoEncontrada({
  mensaje = 'La página que buscás no existe.',
}: NoEncontradaProps) {
  return (
    <main id="contenido" className="container detail-page">
      <div className="eyebrow">PÁGINA NO ENCONTRADA</div>
      <h1>404</h1>
      <p className="lead">{mensaje}</p>
      <Link className="page-link" to="/">
        Ir a Pulso Abierto
      </Link>
    </main>
  );
}
