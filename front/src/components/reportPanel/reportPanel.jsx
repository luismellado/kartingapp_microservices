"use client"

import { useState, useEffect } from "react"
import "./reportPanel.css"
import ReportsService from "../../services/report.service"

function ReportView() {
  const [formData, setFormData] = useState({
    reportType: "",
    year: new Date().getFullYear(),
    startMonth: "",
    endMonth: "",
  })

  const [availableEndMonths, setAvailableEndMonths] = useState([])
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const reportTypes = [
    { value: "laps", label: "Por número de vueltas/tiempo máximo" },
    { value: "people", label: "Por número de personas" },
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  const allMonths = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  // Update available end months when start month changes
  useEffect(() => {
    if (formData.startMonth) {
      const startMonthIndex = Number.parseInt(formData.startMonth)
      const filteredEndMonths = allMonths.filter((month) => Number.parseInt(month.value) >= startMonthIndex)
      setAvailableEndMonths(filteredEndMonths)

      // Reset end month if it's now invalid
      if (formData.endMonth && Number.parseInt(formData.endMonth) < startMonthIndex) {
        setFormData((prev) => ({ ...prev, endMonth: "" }))
      }
    } else {
      setAvailableEndMonths([])
    }
  }, [formData.startMonth])

  // Validate form
  useEffect(() => {
    const { reportType, year, startMonth, endMonth } = formData
    setIsFormValid(reportType && year && startMonth && endMonth)
  }, [formData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateReport = async (e) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)

    try {
      const { reportType, year, startMonth, endMonth } = formData;
    
      // Llamar al servicio correspondiente
      const response = await (reportType === "laps" 
        ? ReportsService.getLopReport(year, startMonth, endMonth)
        : ReportsService.getQopReport(year, startMonth, endMonth));

      // Verificar si la respuesta es válida
      if (!response || !response.data) {
        throw new Error("No se recibieron datos del servidor");
      }

      // Crear URL para el blob descargado
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo del header o usar uno por defecto
      let fileName = `reporte_${reportType}_${year}.xlsx`;
      const contentDisposition = response.headers['content-disposition'];
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?;?/i);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // Limpieza
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Error al generar el reporte:", error)
      alert(`Error al descargar el reporte: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="report-view-container">
      <div className="report-card">
        <h1 className="report-title">Generador de Reportes</h1>
        <p className="report-description">
          Seleccione el tipo de reporte y el período de tiempo para generar un archivo Excel.
        </p>

        <form onSubmit={generateReport} className="report-form">
          <div className="form-group">
            <label htmlFor="reportType">1. Tipo de reporte</label>
            <select id="reportType" name="reportType" value={formData.reportType} onChange={handleInputChange} required>
              <option value="">Seleccione un tipo de reporte</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="year">2. Año que desea revisar</label>
            <select id="year" name="year" value={formData.year} onChange={handleInputChange} required>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startMonth">3. Mes de inicio</label>
            <select id="startMonth" name="startMonth" value={formData.startMonth} onChange={handleInputChange} required>
              <option value="">Seleccione mes de inicio</option>
              {allMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="endMonth">4. Mes de fin</label>
            <select
              id="endMonth"
              name="endMonth"
              value={formData.endMonth}
              onChange={handleInputChange}
              disabled={!formData.startMonth}
              required
            >
              <option value="">Seleccione mes de fin</option>
              {availableEndMonths.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {!formData.startMonth && <p className="helper-text">Primero seleccione un mes de inicio</p>}
          </div>

          <button type="submit" className="generate-button" disabled={!isFormValid || isLoading}>
            {isLoading ? "Generando..." : "Generar Reporte Excel"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ReportView
