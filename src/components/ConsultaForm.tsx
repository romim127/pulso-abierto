import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import {
  CRIPTOMONEDAS,
  esCryptoId,
  type FiltrosConsulta,
  type FiltroCriptomoneda,
} from '../types/crypto';

const esquemaConsulta = z.object({
  texto: z
    .string()
    .trim()
    .refine(
      (valor) => valor.length === 0 || valor.length >= 2,
      'Ingresá al menos 2 caracteres o dejá el campo vacío.',
    ),
  criptomoneda: z.enum([
    'todas',
    ...CRIPTOMONEDAS.map(({ id }) => id),
  ] as const),
});

type ErroresFormulario = Partial<Record<'texto' | 'criptomoneda', string>>;

type ConsultaFormProps = {
  estaCargando: boolean;
  onBuscar: (filtros: FiltrosConsulta) => void;
};

export function ConsultaForm({
  estaCargando,
  onBuscar,
}: ConsultaFormProps) {
  const [texto, setTexto] = useState('');
  const [criptomoneda, setCriptomoneda] =
    useState<FiltroCriptomoneda>('todas');
  const [errores, setErrores] = useState<ErroresFormulario>({});

  function enviarFormulario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const resultado = esquemaConsulta.safeParse({ texto, criptomoneda });

    if (!resultado.success) {
      const nuevosErrores: ErroresFormulario = {};

      for (const issue of resultado.error.issues) {
        const campo = issue.path[0];
        if (campo === 'texto' || campo === 'criptomoneda') {
          nuevosErrores[campo] ??= issue.message;
        }
      }

      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    onBuscar({
      texto: resultado.data.texto.toLocaleLowerCase(),
      criptomoneda: resultado.data.criptomoneda,
    });
  }

  return (
    <form
      id="consulta-form"
      className="query-panel query-form"
      aria-label="Consulta y filtro de cotizaciones"
      onSubmit={enviarFormulario}
      noValidate
    >
      <div className="query-description">
        <strong>Precios en USD</strong>
        <span>Actualización bajo demanda · 3 criptomonedas</span>
      </div>

      <div className="query-fields">
        <div className="form-field">
          <label htmlFor="filtro-texto">Buscar por nombre o símbolo</label>
          <input
            id="filtro-texto"
            name="texto"
            type="search"
            placeholder="Vacío para mostrar todas"
            value={texto}
            onChange={(event) => setTexto(event.target.value)}
            aria-invalid={Boolean(errores.texto)}
            aria-describedby={errores.texto ? 'error-texto' : undefined}
            disabled={estaCargando}
          />
          {errores.texto && (
            <p className="field-error" id="error-texto">
              {errores.texto}
            </p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="filtro-criptomoneda">Criptomoneda</label>
          <select
            id="filtro-criptomoneda"
            name="criptomoneda"
            value={criptomoneda}
            onChange={(event) => {
              const valor = event.target.value;
              if (valor === 'todas' || esCryptoId(valor)) {
                setCriptomoneda(valor);
              }
            }}
            aria-invalid={Boolean(errores.criptomoneda)}
            aria-describedby={
              errores.criptomoneda ? 'error-criptomoneda' : undefined
            }
            disabled={estaCargando}
          >
            <option value="todas">Todas</option>
            {CRIPTOMONEDAS.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
          </select>
          {errores.criptomoneda && (
            <p className="field-error" id="error-criptomoneda">
              {errores.criptomoneda}
            </p>
          )}
        </div>
      </div>

      <button id="consultar" type="submit" disabled={estaCargando}>
        {estaCargando ? 'Consultando…' : 'Consultar precios'}
        <span aria-hidden="true"> ↗</span>
      </button>
    </form>
  );
}
