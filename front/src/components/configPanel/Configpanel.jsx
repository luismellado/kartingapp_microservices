"use client"

import { useState, useEffect } from "react"
import "./ConfigPanel.css"
import LapOrTimePriceService from "../../services/laportimeprice.service"
import QuantityPeopleDiscountService from "../../services/quantitypeoplediscount.service"
import SpecialDayService from "../../services/specialdays.service"
import FrequentClientDiscountService from "../../services/frecuentclientdiscount.service"

const ConfigPanel = () => {
  // Estados para los datos de configuración
  const [turnOptions, setTurnOptions] = useState([])
  const [peopleOptions, setPeopleOptions] = useState([])
  const [specialDays, setSpecialDays] = useState([])
  const [frequentCustomerOptions, setFrequentCustomerOptions] = useState([])

  // Estado para nuevos días especiales
  const [newSpecialDay, setNewSpecialDay] = useState({
    description: "",
    specialSurcharge: 0.0,
  })

  // Estados para modos de edición
  const [editModeTurn, setEditModeTurn] = useState(null)
  const [editModePeople, setEditModePeople] = useState(null)
  const [editModeFrequent, setEditModeFrequent] = useState(null)

  // Estados para manejo de carga y errores
  const [loading, setLoading] = useState({
    turns: true,
    people: true,
    specialDays: true,
    frequentCustomer: true,
    saving: false,
  })
  const [error, setError] = useState({
    turns: null,
    people: null,
    specialDays: null,
    frequentCustomer: null,
    saving: null,
  })
  const [saveStatus, setSaveStatus] = useState(null)

  // Cargar datos de configuración al montar el componente
  useEffect(() => {
    fetchTurnOptions()
    fetchPeopleOptions()
    fetchSpecialDays()
    fetchFrequentCustomerOptions()
  }, [])

  // Función para cargar opciones de vueltas/tiempo
  const fetchTurnOptions = async () => {
    try {
      setLoading((prev) => ({ ...prev, turns: true }))
      const response = await LapOrTimePriceService.getAll()
      setTurnOptions(response.data)
      setError((prev) => ({ ...prev, turns: null }))
    } catch (err) {
      console.error("Error fetching turn options:", err)
      setError((prev) => ({ ...prev, turns: "Error al cargar las opciones de vueltas/tiempo" }))
    } finally {
      setLoading((prev) => ({ ...prev, turns: false }))
    }
  }

  // Función para cargar opciones de personas
  const fetchPeopleOptions = async () => {
    try {
      setLoading((prev) => ({ ...prev, people: true }))
      const response = await QuantityPeopleDiscountService.getAll()
      setPeopleOptions(response.data)
      setError((prev) => ({ ...prev, people: null }))
    } catch (err) {
      console.error("Error fetching people options:", err)
      setError((prev) => ({ ...prev, people: "Error al cargar las opciones de personas" }))
    } finally {
      setLoading((prev) => ({ ...prev, people: false }))
    }
  }

  // Función para cargar días especiales
  const fetchSpecialDays = async () => {
    try {
      setLoading((prev) => ({ ...prev, specialDays: true }))
      const response = await SpecialDayService.getAll()
      setSpecialDays(response.data)
      setError((prev) => ({ ...prev, specialDays: null }))
    } catch (err) {
      console.error("Error fetching special days:", err)
      setError((prev) => ({ ...prev, specialDays: "Error al cargar los días especiales" }))
    } finally {
      setLoading((prev) => ({ ...prev, specialDays: false }))
    }
  }

  // Función para cargar opciones de cliente frecuente
  const fetchFrequentCustomerOptions = async () => {
    try {
      setLoading((prev) => ({ ...prev, frequentCustomer: true }))
      const response = await FrequentClientDiscountService.getAll()
      setFrequentCustomerOptions(response.data)
      setError((prev) => ({ ...prev, frequentCustomer: null }))
    } catch (err) {
      console.error("Error fetching frequent customer options:", err)
      setError((prev) => ({ ...prev, frequentCustomer: "Error al cargar las opciones de cliente frecuente" }))
    } finally {
      setLoading((prev) => ({ ...prev, frequentCustomer: false }))
    }
  }

  // Handle turn option changes
  const handleTurnOptionChange = (index, field, value) => {
    const updatedTurnOptions = [...turnOptions]
    updatedTurnOptions[index] = {
      ...updatedTurnOptions[index],
      [field]: field === "price" || field === "duration" ? Number(value) : value,
    }
    setTurnOptions(updatedTurnOptions)
  }

  // Handle people option changes
  const handlePeopleOptionChange = (index, field, value) => {
    const updatedPeopleOptions = [...peopleOptions]
    updatedPeopleOptions[index] = {
      ...updatedPeopleOptions[index],
      [field]: field === "discount"? Number.parseFloat(value) : value,
    }
    setPeopleOptions(updatedPeopleOptions)
  }

  // Handle frequent customer option changes
  const handleFrequentCustomerOptionChange = (index, field, value) => {
    const updatedFrequentCustomerOptions = [...frequentCustomerOptions]
    updatedFrequentCustomerOptions[index] = {
      ...updatedFrequentCustomerOptions[index],
      [field]: field === "discount"? Number.parseFloat(value) : value,
    }
    setFrequentCustomerOptions(updatedFrequentCustomerOptions)
  }

  // Toggle edit mode for a turn option
  const toggleEditModeTurn = async (index) => {
    // Si estamos saliendo del modo edición, guardar los cambios
    if (editModeTurn === index) {
      try {
        setLoading((prev) => ({ ...prev, saving: true }))
        const option = turnOptions[index]

        // Primero obtenemos la versión más reciente del objeto
        const response = await LapOrTimePriceService.getById(option.id)
        const currentOption = response.data

        // Actualizamos solo los campos que han cambiado
        const updatedOption = {
          ...currentOption,
          description: option.description,
          price: option.price,
          duration: option.duration,
        }

        // Enviamos la actualización
        await LapOrTimePriceService.update(updatedOption)

        setSaveStatus({ type: "success", message: "Opción de vueltas actualizada correctamente" })

        // Refrescar los datos
        fetchTurnOptions()
      } catch (err) {
        console.error("Error updating turn option:", err)
        setSaveStatus({ type: "error", message: "Error al actualizar la opción de vueltas" })
      } finally {
        setLoading((prev) => ({ ...prev, saving: false }))
      }
    }

    setEditModeTurn(editModeTurn === index ? null : index)
  }

  // Toggle edit mode for a people option
  const toggleEditModePeople = async (index) => {
    // Si estamos saliendo del modo edición, guardar los cambios
    if (editModePeople === index) {
      try {
        setLoading((prev) => ({ ...prev, saving: true }))
        const option = peopleOptions[index]

        // Primero obtenemos la versión más reciente del objeto
        const response = await QuantityPeopleDiscountService.getById(option.id)
        const currentOption = response.data

        // Actualizamos solo los campos que han cambiado
        const updatedOption = {
          ...currentOption,
          description: option.categoryName,
          discount: option.discount,
        }

        // Enviamos la actualización
        await QuantityPeopleDiscountService.update(updatedOption)

        setSaveStatus({ type: "success", message: "Opción de personas actualizada correctamente" })

        // Refrescar los datos
        fetchPeopleOptions()
      } catch (err) {
        console.error("Error updating people option:", err)
        setSaveStatus({ type: "error", message: "Error al actualizar la opción de personas" })
      } finally {
        setLoading((prev) => ({ ...prev, saving: false }))
      }
    }

    setEditModePeople(editModePeople === index ? null : index)
  }

  // Toggle edit mode for a frequent customer option
  const toggleEditModeFrequent = async (index) => {
    // Si estamos saliendo del modo edición, guardar los cambios
    if (editModeFrequent === index) {
      try {
        setLoading((prev) => ({ ...prev, saving: true }))
        const option = frequentCustomerOptions[index]

        // Primero obtenemos la versión más reciente del objeto
        const response = await FrequentClientDiscountService.getById(option.id)
        const currentOption = response.data

        // Actualizamos solo los campos que han cambiado
        const updatedOption = {
          ...currentOption,
          description: option.description,
          discount: option.discount,
        }

        // Enviamos la actualización
        await FrequentClientDiscountService.update(updatedOption)

        setSaveStatus({ type: "success", message: "Opción de cliente frecuente actualizada correctamente" })

        // Refrescar los datos
        fetchFrequentCustomerOptions()
      } catch (err) {
        console.error("Error updating frequent customer option:", err)
        setSaveStatus({ type: "error", message: "Error al actualizar la opción de cliente frecuente" })
      } finally {
        setLoading((prev) => ({ ...prev, saving: false }))
      }
    }

    setEditModeFrequent(editModeFrequent === index ? null : index)
  }

  // Add new special day
  const addSpecialDay = async () => {
    if (newSpecialDay.description) {
      try {
        setLoading((prev) => ({ ...prev, saving: true }))
        // Crear el nuevo día especial
        const response = await SpecialDayService.create(newSpecialDay)

        setSaveStatus({ type: "success", message: "Día especial añadido correctamente" })
        setNewSpecialDay({ description: "", specialSurcharge: 0.0 })

        // Refrescar los días especiales
        fetchSpecialDays()
      } catch (err) {
        console.error("Error adding special day:", err)
        setSaveStatus({ type: "error", message: "Error al añadir el día especial" })
      } finally {
        setLoading((prev) => ({ ...prev, saving: false }))
      }
    }
  }

  // Remove special day
  const removeSpecialDay = async (id) => {
    try {
      setLoading((prev) => ({ ...prev, saving: true }))

      // Eliminar el día especial
      await SpecialDayService.deleteSpDay(id)

      setSaveStatus({ type: "success", message: "Día especial eliminado correctamente" })

      // Refrescar los días especiales
      fetchSpecialDays()
    } catch (err) {
      console.error("Error removing special day:", err)
      setSaveStatus({ type: "error", message: "Error al eliminar el día especial" })
    } finally {
      setLoading((prev) => ({ ...prev, saving: false }))
    }
  }

  // Format price with thousands separator
  const formatPrice = (price) => {
    if (price === undefined || price === null) {
      return "0"
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Format discount as percentage
  const formatDiscount = (discount) => {
    if (discount === undefined || discount === null) {
      return "0%"
    }
    return `${(discount * 100).toFixed(1)}%`
  }

  // Format surcharge as percentage
  const formatSurcharge = (surcharge) => {
    if (surcharge === undefined || surcharge === null) {
      return "0%"
    }
    return `${((surcharge - 1) * 100).toFixed(1)}%`
  }

  // Limpiar el mensaje de estado después de 5 segundos
  useEffect(() => {
    if (saveStatus) {
      const timer = setTimeout(() => {
        setSaveStatus(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [saveStatus])

  // Verificar si todos los datos están cargando
  const isLoading = loading.turns || loading.people || loading.specialDays || loading.frequentCustomer

  // Verificar si hay algún error
  const hasError = error.turns || error.people || error.specialDays || error.frequentCustomer

  if (
    isLoading &&
    turnOptions.length === 0 &&
    peopleOptions.length === 0 &&
    specialDays.length === 0 &&
    frequentCustomerOptions.length === 0
  ) {
    return <div className="loading-container">Cargando configuración...</div>
  }

  if (
    hasError &&
    turnOptions.length === 0 &&
    peopleOptions.length === 0 &&
    specialDays.length === 0 &&
    frequentCustomerOptions.length === 0
  ) {
    return (
      <div className="error-container">
        {error.turns && <p>{error.turns}</p>}
        {error.people && <p>{error.people}</p>}
        {error.specialDays && <p>{error.specialDays}</p>}
        {error.frequentCustomer && <p>{error.frequentCustomer}</p>}
        <button
          onClick={() => {
            fetchTurnOptions()
            fetchPeopleOptions()
            fetchSpecialDays()
            fetchFrequentCustomerOptions()
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="config-panel">
      <h2>Configuración de Reservas</h2>

      {saveStatus && <div className={`status-message ${saveStatus.type}`}>{saveStatus.message}</div>}

      {/* Turn Options Table */}
      <section className="config-section">
        <h3>Opciones de Vueltas y Duración</h3>

        {loading.turns && turnOptions.length === 0 ? (
          <div className="section-loading">Cargando opciones de vueltas...</div>
        ) : error.turns && turnOptions.length === 0 ? (
          <div className="section-error">
            <p>{error.turns}</p>
            <button onClick={fetchTurnOptions} className="retry-btn small">
              Reintentar
            </button>
          </div>
        ) : turnOptions.length === 0 ? (
          <div className="empty-state">No hay opciones de vueltas configuradas.</div>
        ) : (
          <div className="turn-options-table">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Precio regular</th>
                  <th>Tiempo total de reserva</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {turnOptions.map((option, index) => (
                  <tr key={option.id} className={editModeTurn === index ? "editing" : ""}>
                    {editModeTurn === index ? (
                      // Edit mode
                      <>
                        <td>
                          <input
                            type="text"
                            value={option.description || ""}
                            onChange={(e) => handleTurnOptionChange(index, "description", e.target.value)}
                            className="full-width"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={option.price || 0}
                            onChange={(e) => handleTurnOptionChange(index, "price", e.target.value)}
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={option.duration || 0}
                            onChange={(e) => handleTurnOptionChange(index, "duration", e.target.value)}
                            min="1"
                          />
                          <span>min</span>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td>{option.description}</td>
                        <td>{formatPrice(option.price)}</td>
                        <td>{option.duration} min</td>
                      </>
                    )}
                    <td className="actions-cell">
                      <button
                        type="button"
                        className={editModeTurn === index ? "save-btn small" : "edit-btn small"}
                        onClick={() => toggleEditModeTurn(index)}
                        disabled={loading.saving}
                      >
                        {editModeTurn === index ? "Guardar" : "Editar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* People Options Table */}
      <section className="config-section">
        <h3>Opciones de Descuento por Número de Personas</h3>

        {loading.people && peopleOptions.length === 0 ? (
          <div className="section-loading">Cargando opciones de personas...</div>
        ) : error.people && peopleOptions.length === 0 ? (
          <div className="section-error">
            <p>{error.people}</p>
            <button onClick={fetchPeopleOptions} className="retry-btn small">
              Reintentar
            </button>
          </div>
        ) : peopleOptions.length === 0 ? (
          <div className="empty-state">No hay opciones de personas configuradas.</div>
        ) : (
          <div className="people-options-table">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Descuento aplicado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peopleOptions.map((option, index) => (
                  <tr key={option.id} className={editModePeople === index ? "editing" : ""}>
                    {editModePeople === index ? (
                      // Edit mode
                      <>
                        <td>
                          <input
                            type="text"
                            value={option.description || ""}
                            onChange={(e) => handlePeopleOptionChange(index, "description", e.target.value)}
                            className="full-width"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={(option.discount || 0) * 100}
                            onChange={(e) =>
                              handlePeopleOptionChange(
                                index,
                                "discount",
                                Number.parseFloat(e.target.value) / 100,
                              )
                            }
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span>%</span>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td>{option.description}</td>
                        <td>{formatDiscount(option.discount)}</td>
                      </>
                    )}
                    <td className="actions-cell">
                      <button
                        type="button"
                        className={editModePeople === index ? "save-btn small" : "edit-btn small"}
                        onClick={() => toggleEditModePeople(index)}
                        disabled={loading.saving}
                      >
                        {editModePeople === index ? "Guardar" : "Editar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Frequent Customer Options Table */}
      <section className="config-section">
        <h3>Opciones de Descuento por Cliente Frecuente</h3>

        {loading.frequentCustomer && frequentCustomerOptions.length === 0 ? (
          <div className="section-loading">Cargando opciones de cliente frecuente...</div>
        ) : error.frequentCustomer && frequentCustomerOptions.length === 0 ? (
          <div className="section-error">
            <p>{error.frequentCustomer}</p>
            <button onClick={fetchFrequentCustomerOptions} className="retry-btn small">
              Reintentar
            </button>
          </div>
        ) : frequentCustomerOptions.length === 0 ? (
          <div className="empty-state">No hay opciones de cliente frecuente configuradas.</div>
        ) : (
          <div className="frequent-customer-table">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Descuento aplicado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {frequentCustomerOptions.map((option, index) => (
                  <tr key={option.id} className={editModeFrequent === index ? "editing" : ""}>
                    {editModeFrequent === index ? (
                      // Edit mode
                      <>
                        <td>
                          <input
                            type="text"
                            value={option.description || ""}
                            onChange={(e) => handleFrequentCustomerOptionChange(index, "description", e.target.value)}
                            className="full-width"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={(option.discount || 0) * 100}
                            onChange={(e) =>
                              handleFrequentCustomerOptionChange(
                                index,
                                "discount",
                                Number.parseFloat(e.target.value) / 100,
                              )
                            }
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span>%</span>
                        </td>
                      </>
                    ) : (
                      // View mode
                      <>
                        <td>{option.description}</td>
                        <td>{formatDiscount(option.discount)}</td>
                      </>
                    )}
                    <td className="actions-cell">
                      <button
                        type="button"
                        className={editModeFrequent === index ? "save-btn small" : "edit-btn small"}
                        onClick={() => toggleEditModeFrequent(index)}
                        disabled={loading.saving}
                      >
                        {editModeFrequent === index ? "Guardar" : "Editar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Special Days Surcharges */}
      <section className="config-section">
        <h3>Recargos para Días Especiales</h3>

        {loading.specialDays && specialDays.length === 0 ? (
          <div className="section-loading">Cargando días especiales...</div>
        ) : error.specialDays && specialDays.length === 0 ? (
          <div className="section-error">
            <p>{error.specialDays}</p>
            <button onClick={fetchSpecialDays} className="retry-btn small">
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="special-days-list">
              {specialDays.length === 0 ? (
                <div className="empty-state">No hay días especiales configurados.</div>
              ) : (
                specialDays.map((day) => (
                  <div key={day.id} className="special-day-item">
                    <span>
                      {day.description}: {formatSurcharge(day.specialSurcharge)} recargo
                    </span>
                    
                  </div>
                ))
              )}
            </div>

            <div className="add-special-day">
              <input
                type="text"
                placeholder="Nombre del día especial"
                value={newSpecialDay.description}
                onChange={(e) =>
                  setNewSpecialDay({
                    ...newSpecialDay,
                    description: e.target.value,
                  })
                }
                disabled={loading.saving}
              />
              <input
                type="number"
                placeholder="% de recargo"
                min="1"
                max="2"
                step="0.1"
                value={newSpecialDay.specialSurcharge}
                onChange={(e) =>
                  setNewSpecialDay({
                    ...newSpecialDay,
                    specialSurcharge: Number.parseFloat(e.target.value),
                  })
                }
                disabled={loading.saving}
              />
              <button type="button" onClick={addSpecialDay} disabled={loading.saving || !newSpecialDay.description}>
                Agregar
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default ConfigPanel
