"use client"
import { useState } from "react"
import "./addBooking.css"

function ParticipantesForm({
  mainFormData,
  participantes,
  setParticipantes,
  opcionesDisponibles,
  fechasEspeciales,
  volverAPrimeraVista,
  completarReserva,
  loading,
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  // Función para obtener la fecha especial actual con manejo seguro de undefined
  const obtenerFechaEspecial = () => {
    // Asegurarse de que fechasEspeciales es un array
    const fechasArray = Array.isArray(fechasEspeciales) ? fechasEspeciales : []

    // Buscar la fecha especial o devolver la primera (o un objeto por defecto si el array está vacío)
    return (
      fechasArray.find((fecha) => fecha?.id === mainFormData?.fechaEspecialId) ||
      fechasArray[0] || { id: "normal", nombre: "Día Normal", recargo: 0, recargoMultiplicador: 1, descripcion: "" }
    )
  }

  // Función para manejar cambios en los datos de los participantes
  const handleParticipanteChange = (index, field, value) => {
    // Verificar que participantes es un array válido
    if (!Array.isArray(participantes)) {
      console.error("participantes no es un array válido:", participantes)
      return
    }

    const nuevosParticipantes = [...participantes]

    if (field === "descuentoCumpleanos") {
      nuevosParticipantes[index].descuentoCumpleanos = value
    } else if (field === "otrosDescuentos") {
      nuevosParticipantes[index].otrosDescuentos = Number.parseInt(value) || 0
    } else {
      nuevosParticipantes[index][field] = value
    }

    setParticipantes(nuevosParticipantes)
  }

  // Función para calcular el precio por participante (solo para visualización)
  const calcularPrecioParticipante = (participante) => {
    // Verificar que tenemos datos válidos
    if (!mainFormData?.opcionSeleccionada || !Array.isArray(opcionesDisponibles) || opcionesDisponibles.length === 0) {
      return 0
    }

    const opcionSeleccionada = opcionesDisponibles.find((opcion) => opcion?.id === mainFormData.opcionSeleccionada)
    const fechaEspecial = obtenerFechaEspecial()

    if (!opcionSeleccionada) return 0

    let precio = opcionSeleccionada.precio

    // Aplicar recargo según la fecha especial usando el multiplicador directamente
    if (fechaEspecial?.recargoMultiplicador > 1) {
      precio *= fechaEspecial.recargoMultiplicador
    }

    // Aplicar descuento por cumpleaños (50%)
    if (participante?.descuentoCumpleanos) {
      precio *= 0.5
    }

    // Asegurar que el precio no sea negativo
    return Math.max(0, precio)
  }

  // Función para calcular el IVA (19%)
  const calcularIVA = (precio) => {
    return precio * 0.19
  }

  // Función para calcular el precio total
  const calcularPrecioTotal = () => {
    // Verificar que participantes es un array válido
    if (!Array.isArray(participantes)) {
      return 0
    }

    return participantes.reduce((total, participante) => {
      return total + calcularPrecioParticipante(participante) + calcularIVA(calcularPrecioParticipante(participante))
    }, 0)
  }

  // Manejar el envío del formulario de participantes
  const handleParticipantesSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)
    setError(null)

    try {
      // Verificar que participantes es un array válido
      if (!Array.isArray(participantes)) {
        throw new Error("No hay datos de participantes para enviar")
      }

      // Preparar los datos de los participantes para enviar al backend
      const participantesData = participantes.map((participante) => ({
        nombre: participante.nombre,
        correo: participante.correo,
        descuentoCumpleanos: participante.descuentoCumpleanos || false,
        otrosDescuentos: participante.otrosDescuentos || 0,
        // Estos valores son solo para visualización, el backend hará los cálculos reales
        precioCalculado: calcularPrecioParticipante(participante),
        ivaCalculado: calcularIVA(calcularPrecioParticipante(participante)),
        precioTotal: calcularPrecioParticipante(participante) + calcularIVA(calcularPrecioParticipante(participante)),
      }))

      console.log("Enviando datos de participantes:", participantesData)

      // Enviar los datos al backend usando la función del componente padre
      const result = await completarReserva(participantesData)

      if (!result) {
        throw new Error("No se pudo completar la reserva")
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err)
      setError(err.message || "Hubo un error al procesar su reserva. Por favor, intente nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

  // Verificar que tenemos datos válidos antes de renderizar
  if (!mainFormData || !Array.isArray(participantes) || !Array.isArray(opcionesDisponibles)) {
    return (
      <div className="reservation-container">
        <h2>Error al cargar datos</h2>
        <p>No se pudieron cargar los datos necesarios para mostrar el formulario de participantes.</p>
        <button className="back-button" onClick={volverAPrimeraVista}>
          Volver al formulario principal
        </button>
      </div>
    )
  }

  const opcionSeleccionada = opcionesDisponibles.find((opcion) => opcion?.id === mainFormData.opcionSeleccionada) || {
    vueltas: "",
    precio: 0,
  }
  const fechaEspecial = obtenerFechaEspecial()

  return (
    <div className="reservation-container">
      <h2>Datos de los Participantes</h2>

      {error && <div className="error-banner">{error}</div>}

      <div className="reservation-summary">
        <h3>Resumen de la Reserva</h3>
        <p>
          <strong>Reservante:</strong> {mainFormData.nombre} {mainFormData.apellido}
        </p>
        <p>
          <strong>Fecha y Hora:</strong> {mainFormData.fecha} a las {mainFormData.hora}
        </p>
        <p>
          <strong>Opción Seleccionada:</strong> {opcionSeleccionada.vueltas} - $
          {opcionSeleccionada.precio?.toLocaleString() || "0"}
        </p>
        <p>
          <strong>Tipo de Fecha:</strong>{" "}
          <span className={fechaEspecial.recargo > 0 ? "fecha-especial-texto" : ""}>
            {fechaEspecial.nombre}
            {fechaEspecial.recargo > 0 ? ` (+${fechaEspecial.recargo})` : ""}
          </span>
        </p>
        {fechaEspecial.recargo > 0 && fechaEspecial.descripcion && (
          <p className="fecha-especial-descripcion-resumen">
            <strong>Nota:</strong> {fechaEspecial.descripcion}
          </p>
        )}
      </div>

      <form onSubmit={handleParticipantesSubmit} className="participants-form">
        {participantes.map((participante, index) => (
          <div key={participante.id || index} className="participant-card">
            <h3>Participante {index + 1} {index === 0 ? "(Reservante)" : ""}</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor={`nombre-${index}`}>Nombre:</label>
                <input
                  type="text"
                  id={`nombre-${index}`}
                  value={participante.nombre || ""}
                  onChange={(e) => handleParticipanteChange(index, "nombre", e.target.value)}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor={`correo-${index}`}>Correo:</label>
              <input
                type="email"
                id={`correo-${index}`}
                value={participante.correo || ""}
                onChange={(e) => handleParticipanteChange(index, "correo", e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="form-row">
              <div className="form-group discount-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={participante.descuentoCumpleanos || false}
                    onChange={(e) => handleParticipanteChange(index, "descuentoCumpleanos", e.target.checked)}
                    disabled={submitting}
                  />
                  Descuento por Cumpleaños (50%)
                </label>
              </div>
            </div>

            <div className="price-summary">
              <div className="price-item">
                <span>Precio Base:</span>
                <span>${opcionSeleccionada.precio?.toLocaleString() || "0"}</span>
              </div>

              {fechaEspecial.recargo > 0 && (
                <div className="price-item surcharge">
                  <span>
                    Recargo por {fechaEspecial.nombre} ({fechaEspecial.recargo}%):
                  </span>
                  <span>
                    +$
                    {((opcionSeleccionada.precio || 0) * (fechaEspecial.recargoMultiplicador - 1)).toLocaleString()}
                  </span>
                </div>
              )}

              {participante.descuentoCumpleanos && (
                <div className="price-item discount">
                  <span>Descuento por Cumpleaños (15%):</span>
                  <span>
                    -$
                    {(
                      (opcionSeleccionada.precio || 0) *
                      (fechaEspecial.recargoMultiplicador || 1) *
                      0.5
                    ).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="price-item">
                <span>Subtotal:</span>
                <span>${calcularPrecioParticipante(participante).toLocaleString()}</span>
              </div>

              <div className="price-item">
                <span>IVA (19%):</span>
                <span>${calcularIVA(calcularPrecioParticipante(participante)).toLocaleString()}</span>
              </div>

              <div className="price-item total">
                <span>Total:</span>
                <span>
                  $
                  {(
                    calcularPrecioParticipante(participante) + calcularIVA(calcularPrecioParticipante(participante))
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="total-price">
          <h3>Precio Total de la Reserva: ${calcularPrecioTotal().toLocaleString()}</h3>
          <p className="price-disclaimer">
            * Los precios mostrados son estimativos. El precio final será calculado por el sistema considerando
            descuentos adicionales como cliente frecuente y numero de personas de la reserva.
          </p>
        </div>

        <div className="form-buttons">
          <button type="button" className="back-button" onClick={volverAPrimeraVista} disabled={submitting}>
            Volver
          </button>
          <button type="submit" className="submit-button" disabled={submitting || loading}>
            {submitting ? "Procesando..." : "Completar Reserva"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ParticipantesForm
