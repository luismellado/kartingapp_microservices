"use client"

import { useState, useEffect } from "react"
import CalendarHeader from "./CalendarHeader"
import MonthView from "./MonthView"
import WeekView from "./WeekView"
import DayView from "./DayView"
import "./Calendar.css"
import RackInfo from "../../services/weeklyrack.service"
import Bookings from "../../services/booking.service"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState("week")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Obtener reservaciones
        const rackInfo = await RackInfo.getAllInfo()
        
        // Crear eventos
        const transformedEvents = rackInfo.data.map(info => {
          const [year, month, day] = info.date.split('-').map(Number)
          const [startHours, startMinutes] = info.startTime.split(':').map(Number)
          const [endHours, endMinutes] = info.endTime.split(':').map(Number)
          
          const startDate = new Date(year, month - 1, day, startHours, startMinutes)
          const endDate = new Date(year, month - 1, day, endHours, endMinutes)
          
          return {
            title: `${info.bookerName} (${info.quantity} pers.)`,
            start: startDate,
            end: endDate,
            color: getEventColor(info.quantity),
            bookingData: info
          }
        })
        
        setEvents(transformedEvents)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [currentDate, view])

  const getEventColor = (quantity) => {
    return "#4CAF50"
  }

  const navigateToPrev = () => {
    const newDate = new Date(currentDate)
    if (view === "month") newDate.setMonth(newDate.getMonth() - 1)
    else if (view === "week") newDate.setDate(newDate.getDate() - 7)
    else if (view === "day") newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const navigateToNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") newDate.setMonth(newDate.getMonth() + 1)
    else if (view === "week") newDate.setDate(newDate.getDate() + 7)
    else if (view === "day") newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const navigateToToday = () => {
    setCurrentDate(new Date())
  }

  /*const addEvent = async (newEvent) => {
    try {
      const createdBooking = await Bookings.newBooking({
        date: newEvent.start.toISOString().split('T')[0],
        time: `${String(newEvent.start.getHours()).padStart(2, '0')}:${String(newEvent.start.getMinutes()).padStart(2, '0')}:00`,
        lapTimeId: newEvent.lopId || 1,
        numberOfPersons: newEvent.quantityPeople || 2,
        reserver: newEvent.booker || "Nuevo Cliente"
      })
      
      const duration = lapTimes[createdBooking.lapTimeId] || 60
      const [year, month, day] = createdBooking.date.split('-').map(Number)
      const [hours, minutes] = createdBooking.time.split(':').map(Number)
      
      setEvents([...events, {
        id: createdBooking.id,
        title: `${createdBooking.reserver} (${createdBooking.numberOfPersons} pers.)`,
        start: new Date(year, month - 1, day, hours, minutes),
        end: new Date(year, month - 1, day, hours, minutes + duration),
        color: getEventColor(createdBooking.numberOfPersons),
        bookingData: createdBooking
      }])
    } catch (err) {
      console.error('Error al agregar evento:', err)
      setError(err.message)
    }
  }
*/
  if (loading) return <div>Cargando calendario...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="calendar">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrev={navigateToPrev}
        onNext={navigateToNext}
        onToday={navigateToToday}
      />

      <div className="calendar-body">
        {view === "month" && <MonthView currentDate={currentDate} events={events} />}
        {view === "week" && <WeekView currentDate={currentDate} events={events} />}
        {view === "day" && <DayView currentDate={currentDate} events={events} />}
      </div>
    </div>
  )
}

export default Calendar