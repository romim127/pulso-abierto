import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { Detalle } from './pages/Detalle';
import { Inicio } from './pages/Inicio';
import { NoEncontrada } from './pages/NoEncontrada';

function Encabezado() {
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido principal
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/" aria-label="Pulso Abierto, inicio">
            <span className="brand-mark" aria-hidden="true">
              ◈
            </span>
            <span>
              PULSO <strong>ABIERTO</strong>
            </span>
          </Link>
          <span className="header-tag">DATOS PÚBLICOS · MÓDULO 03</span>
        </div>
      </header>
    </>
  );
}

function Pie() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span>© 2026 · Pulso Abierto · Programación Web</span>
        <span>
          Datos provistos por{' '}
          <a
            href="https://www.coingecko.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CoinGecko
          </a>
          . No constituye asesoramiento financiero.
        </span>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Encabezado />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/criptomonedas/:id" element={<Detalle />} />
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
      <Pie />
    </BrowserRouter>
  );
}

export default App;
