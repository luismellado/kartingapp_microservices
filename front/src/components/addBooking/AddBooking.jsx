"use client"

import { useState, useEffect } from "react"
import "./addBooking.css"
import ParticipantesForm from "./ParticipantsReservation"
import BookingService from "../../services/booking.service"
import LapOptionsService from "../../services/laportimeprice.service"
import SpecialDatesService from "../../services/specialdays.service"
import PaymentDetailService from "../../services/paymentdetail.service"

function ReservationFormMain() {
  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState(1)

  // Estado para los datos del formulario principal
  const [mainFormData, setMainFormData] = useState({
    nombre: "",
    correo: "",
    cantidadPersonas: 1,
    fecha: "",
    hora: "",
    opcionSeleccionada: null,
    fechaEspecialId: "normal", // normal o id de fecha especial
  })

  // Estado para los errores del formulario principal
  const [mainFormErrors, setMainFormErrors] = useState({})

  // Estado para los datos de los participantes
  const [participantes, setParticipantes] = useState([])

  // Estado para las fechas especiales cargadas desde el backend
  const [fechasEspeciales, setFechasEspeciales] = useState([
    {
      id: "normal",
      nombre: "Día Normal",
      recargo: 0,
      recargoMultiplicador: 1,
      descripcion: "Tarifa estándar sin recargos adicionales.",
    }
  ])

  // Estado para indicar carga
  const [loading, setLoading] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [loadingDates, setLoadingDates] = useState(false)
  const [error, setError] = useState(null)

  // Estado para las opciones de vueltas/tiempo disponibles
  const [opcionesDisponibles, setOpcionesDisponibles] = useState([])

  // Función para formatear el porcentaje sin decimales
  const formatearPorcentaje = (multiplicador) => {
    // Convertir el multiplicador a porcentaje y redondear a entero
    return Math.round((multiplicador - 1) * 100);
  }

  // Cargar opciones de vueltas y fechas especiales desde el backend al iniciar el componente
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Cargar opciones de vueltas
      setLoadingOptions(true)
      try {
        const responseLapOptions = await LapOptionsService.getAll()

        // Mapear los datos del backend al formato que espera nuestra aplicación
        const mappedOptions = responseLapOptions.data.map((option) => ({
          id: option.id,
          precio: option.price,
          duracion: `${option.duration} minutos`,
          vueltas: option.description,
        }))

        setOpcionesDisponibles(mappedOptions)
      } catch (err) {
        console.error("Error al cargar opciones de vueltas:", err)
        setError("No se pudieron cargar las opciones disponibles. Por favor, intente nuevamente más tarde.")
      } finally {
        setLoadingOptions(false)
      }

      // Cargar fechas especiales
      setLoadingDates(true)
      try {
        const responseSpecialDates = await SpecialDatesService.getAll()

        // Mapear los datos del backend al formato que espera nuestra aplicación
        const mappedDates = responseSpecialDates.data.map((date) => {
          const porcentajeRecargo = formatearPorcentaje(date.specialSurcharge);
          return {
            id: date.id.toString(),
            nombre: date.description,
            recargo: porcentajeRecargo,
            recargoMultiplicador: date.specialSurcharge,
            descripcion: `${date.description} con recargo del ${porcentajeRecargo}%.`,
          };
        })

        // Combinar la opción normal con las fechas especiales del backend
        setFechasEspeciales([...mappedDates])
      } catch (err) {
        console.error("Error al cargar fechas especiales:", err)
        // No establecemos un error general aquí para no bloquear toda la aplicación
        // ya que podemos seguir usando la opción "normal"
      } finally {
        setLoadingDates(false)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  // Función para obtener la fecha especial actual
  const obtenerFechaEspecial = () => {
    return fechasEspeciales.find((fecha) => fecha.id === mainFormData.fechaEspecialId) || fechasEspeciales[0]
  }

  // Función para manejar cambios en el formulario principal
  const handleMainFormChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === "cantidadPersonas") {
      // Limitar a 15 personas como máximo
      const cantidad = Math.min(Math.max(1, Number.parseInt(value) || 1), 15)
      setMainFormData({
        ...mainFormData,
        [name]: cantidad,
      })
    } else if (type === "radio" && name === "opcionSeleccionada") {
      setMainFormData({
        ...mainFormData,
        [name]: Number.parseInt(value),
      })
    } else if (name === "fechaEspecialId") {
      setMainFormData({
        ...mainFormData,
        [name]: value,
      })
    } else {
      setMainFormData({
        ...mainFormData,
        [name]: value,
      })
    }

    // Limpiar error cuando el usuario escribe
    if (mainFormErrors[name]) {
      setMainFormErrors({
        ...mainFormErrors,
        [name]: "",
      })
    }
  }

  // Validar el formulario principal
  const validateMainForm = () => {
    const errors = {}

    if (!mainFormData.nombre.trim()) {
      errors.nombre = "El nombre es requerido"
    }

    if (!mainFormData.correo.trim()) {
      errors.correo = "El correo es requerido"
    } else if (!/\S+@\S+\.\S+/.test(mainFormData.correo)) {
      errors.correo = "El correo no es válido"
    }

    if (!mainFormData.fecha) {
      errors.fecha = "La fecha es requerida"
    }

    if (!mainFormData.hora) {
      errors.hora = "La hora es requerida"
    }

    if (mainFormData.opcionSeleccionada === null) {
      errors.opcionSeleccionada = "Debe seleccionar una opción"
    }

    return errors
  }

  // Manejar el envío del formulario principal
  const handleMainFormSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateMainForm()
    if (Object.keys(formErrors).length > 0) {
      setMainFormErrors(formErrors)
      return
    }

    // Inicializar los datos de los participantes
    const nuevosParticipantes = []
    for (let i = 0; i < mainFormData.cantidadPersonas; i++) {
      nuevosParticipantes.push({
        id: i + 1,
        nombre: i === 0 ? mainFormData.nombre : "", // El primer participante es el que reserva
        correo: i === 0 ? mainFormData.correo : "",
        descuentoCumpleanos: false,
        otrosDescuentos: 0,
      })
    }

    setParticipantes(nuevosParticipantes)

    // Cambiar a la segunda vista
    setCurrentView(2)
  }

  // Función para volver a la primera vista
  const volverAPrimeraVista = () => {
    setCurrentView(1)
  }

  // Función para completar la reserva y enviarla al backend
  const completarReserva = async (datosParticipantes) => {
    try {
      setLoading(true)

      // Preparar los datos para enviar al backend
      const datosReserva = {
        bookerName: mainFormData.nombre,
        quantityPeople: mainFormData.cantidadPersonas,
        date: mainFormData.fecha,
        time: mainFormData.hora,
        lopId: mainFormData.opcionSeleccionada,
      }
      participantes: datosParticipantes,
      // Enviar los datos al backend
      console.log("Enviando datos de reserva:", datosReserva)
      
      // 2. Crear la reserva principal
      const reservaResponse = await BookingService.newBooking(datosReserva)
      const reservaCreada = reservaResponse.data

      console.log("Reserva creada:", reservaCreada)

      if (!reservaCreada?.id) {
        throw new Error("No se pudo obtener el ID de la reserva creada")
      }

      // 3. Obtener información para los cálculos de pago
      const fechaEspecial = obtenerFechaEspecial();
      const opcionSeleccionada = opcionesDisponibles.find(
        opcion => opcion.id === mainFormData.opcionSeleccionada
      );

      if (!opcionSeleccionada) {
        throw new Error("No se encontró la opción seleccionada");
      }

      // 4. Crear paymentDetails para cada participante
      const promisesPaymentDetails = datosParticipantes.map(async (participante, index) => {
        // El primer participante es el reservante (ya tiene datos completos)
        // Los demás participantes podrían tener datos incompletos
        const nombreCompleto = participante.nombre
          ? participante.nombre
          : index === 0 
            ? mainFormData.nombre
            : `Participante ${index + 1}`;
  
        const email = participante.correo || mainFormData.correo;
  
        // Calcular descuento especial (cumpleaños u otros)
        const descuentoEspecial = participante.descuentoCumpleanos ? 10 : 0; // 10% de descuento por cumpleaños
  
        const paymentDetailDTO = {
          bookingId: reservaCreada.id,
          clientName: nombreCompleto,
          clientEmail: email,
          iva: 0.19, // IVA fijo del 19%, ajusta según necesites
          specialDiscount: descuentoEspecial,
          spfee: mainFormData.fechaEspecialId === "normal" ? 1 : Number(mainFormData.fechaEspecialId)
        };

        console.log(`Creando paymentDetail para ${participante.nombre}:`, paymentDetailDTO);
        return PaymentDetailService.newPaymentDetail(paymentDetailDTO);
      });

      // 5. Esperar a que se creen todos los paymentDetails
      await Promise.all(promisesPaymentDetails);

      // 3. Generar y descargar el voucher
      try {
        const response = await PaymentDetailService.excelVoucher(reservaCreada.id);
        
        // Crear URL para el blob y forzar descarga
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `voucher_reserva_${reservaCreada.id}.xlsx`);
        document.body.appendChild(link);
        link.click();
        
        // Limpiar
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al generar el voucher:", error);
        // No detenemos el flujo por este error, solo lo informamos
        alert("Reserva completada pero hubo un problema al generar el voucher. Por favor contacte al administrador.");
      }

      // Éxito - reiniciar formulario
      alert("¡Reserva completada con éxito!")
      setCurrentView(1)
      setMainFormData({
        nombre: "",
        correo: "",
        cantidadPersonas: 1,
        fecha: "",
        hora: "",
        opcionSeleccionada: null,
        fechaEspecialId: "normal",
      })
      setParticipantes([])

      return reservaCreada
    } catch (err) {
      console.error("Error al crear la reserva:", err)
      console.error("Detalles del error:", err.response?.data || err.message)
      alert("Hubo un error al procesar su reserva. Por favor, contacte al administrador.")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Renderizar la primera vista (formulario principal)
  const renderPrimeraVista = () => {
    const fechaEspecial = obtenerFechaEspecial()

    return (
      <div className="reservation-container">
        <h2>Formulario de Reserva</h2>

        {error && <div className="error-banner">{error}</div>}
        {loading && <div className="loading-spinner">Cargando...</div>}

        <form onSubmit={handleMainFormSubmit} className="reservation-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={mainFormData.nombre}
                onChange={handleMainFormChange}
                className={mainFormErrors.nombre ? "error" : ""}
              />
              {mainFormErrors.nombre && <span className="error-message">{mainFormErrors.nombre}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo:</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={mainFormData.correo}
              onChange={handleMainFormChange}
              className={mainFormErrors.correo ? "error" : ""}
            />
            {mainFormErrors.correo && <span className="error-message">{mainFormErrors.correo}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cantidadPersonas">Cantidad de Personas (máx. 15):</label>
              <input
                type="number"
                id="cantidadPersonas"
                name="cantidadPersonas"
                min="1"
                max="15"
                value={mainFormData.cantidadPersonas}
                onChange={handleMainFormChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="fecha">Fecha de Reserva:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={mainFormData.fecha}
                onChange={handleMainFormChange}
                className={mainFormErrors.fecha ? "error" : ""}
              />
              {mainFormErrors.fecha && <span className="error-message">{mainFormErrors.fecha}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="hora">Hora de Reserva:</label>
              <input
                type="time"
                id="hora"
                name="hora"
                value={mainFormData.hora}
                onChange={handleMainFormChange}
                className={mainFormErrors.hora ? "error" : ""}
              />
              {mainFormErrors.hora && <span className="error-message">{mainFormErrors.hora}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fechaEspecialId">Tipo de Fecha:</label>
            {loadingDates ? (
              <div className="loading-dates">Cargando tipos de fechas...</div>
            ) : (
              <>
                <select
                  id="fechaEspecialId"
                  name="fechaEspecialId"
                  value={mainFormData.fechaEspecialId}
                  onChange={handleMainFormChange}
                  className="fecha-especial-select"
                  disabled={loading}
                >
                  {fechasEspeciales.map((fecha) => (
                    <option key={fecha.id} value={fecha.id}>
                      {fecha.nombre} {fecha.recargo > 0 ? `(+${fecha.recargo})` : ""}
                    </option>
                  ))}
                </select>

                {fechaEspecial.recargo > 0 && (
                  <div className="fecha-especial-info">
                    <div className="fecha-especial-badge">Recargo: +{fechaEspecial.recargo}%</div>
                    <p className="fecha-especial-descripcion">{fechaEspecial.descripcion}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="form-group">
            <label>Seleccione una Opción:</label>
            {mainFormErrors.opcionSeleccionada && (
              <span className="error-message">{mainFormErrors.opcionSeleccionada}</span>
            )}

            {loadingOptions ? (
              <div className="loading-options">Cargando opciones disponibles...</div>
            ) : opcionesDisponibles.length === 0 ? (
              <div className="no-options">No hay opciones disponibles en este momento.</div>
            ) : (
              <table className="options-table">
                <thead>
                  <tr>
                    <th>Selección</th>
                    <th>Vueltas/Tiempo</th>
                    <th>Precio Regular</th>
                    <th>Duración Total</th>
                  </tr>
                </thead>
                <tbody>
                  {opcionesDisponibles.map((opcion) => (
                    <tr key={opcion.id}>
                      <td>
                        <input
                          type="radio"
                          name="opcionSeleccionada"
                          value={opcion.id}
                          checked={mainFormData.opcionSeleccionada === opcion.id}
                          onChange={handleMainFormChange}
                        />
                      </td>
                      <td>{opcion.vueltas}</td>
                      <td>${opcion.precio.toLocaleString()}</td>
                      <td>{opcion.duracion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading || loadingOptions || loadingDates || opcionesDisponibles.length === 0}
          >
            {loading || loadingOptions || loadingDates ? "Procesando..." : "Continuar con los Datos de Participantes"}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="reservation-system">
      {currentView === 1 ? (
        renderPrimeraVista()
      ) : (
        <ParticipantesForm
          mainFormData={mainFormData}
          participantes={participantes}
          setParticipantes={setParticipantes}
          opcionesDisponibles={opcionesDisponibles}
          fechasEspeciales={fechasEspeciales}
          volverAPrimeraVista={volverAPrimeraVista}
          completarReserva={completarReserva}
          loading={loading}
        />
      )}
    </div>
  )
}

export default ReservationFormMain
