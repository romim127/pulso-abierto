type Estado = 'inicial' | 'carga' | 'resultado' | 'vacio' | 'error';

type EstadoConsultaProps = {
  estado: Estado;
  cantidad: number;
  esSimulado: boolean;
  mensajeError: string | null;
  onReintentar: () => void;
};

export function EstadoConsulta({
  estado,
  cantidad,
  esSimulado,
  mensajeError,
  onReintentar,
}: EstadoConsultaProps) {
  const mensajes: Record<Estado, string> = {
    inicial:
      'Todavía no realizaste una consulta. Presioná «Consultar precios» para comenzar.',
    carga: esSimulado
      ? 'SIMULACIÓN: solicitud en curso…'
      : 'Consultando CoinGecko. Esperá mientras recuperamos los precios…',
    resultado: `Consulta completada. Se muestran ${cantidad} ${
      cantidad === 1 ? 'cotización' : 'cotizaciones'
    } en USD.`,
    vacio: esSimulado
      ? 'SIMULACIÓN: la consulta finalizó sin resultados.'
      : 'La consulta se completó, pero no se encontraron precios disponibles.',
    error: esSimulado
      ? 'SIMULACIÓN: el servicio no respondió correctamente.'
      : (mensajeError ??
        'No fue posible obtener los precios. Podés volver a intentarlo.'),
  };

  return (
    <>
      <div
        className={`status status-${estado}`}
        role={estado === 'error' ? 'alert' : 'status'}
        aria-live={estado === 'error' ? 'assertive' : 'polite'}
        aria-atomic="true"
        aria-busy={estado === 'carga'}
      >
        {mensajes[estado]}
      </div>
      {estado === 'error' && (
        <button
          id="reintentar"
          className="retry"
          type="button"
          onClick={onReintentar}
        >
          Volver a intentar <span aria-hidden="true">↻</span>
        </button>
      )}
    </>
  );
}
