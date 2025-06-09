"use client"
import "./WeekView.css"
import Event from "./Event"

const WeekView = ({ currentDate, events, onAddEvent }) => {
  // Get the start of the week (Sunday)
  const getStartOfWeek = (date) => {
    const startOfWeek = new Date(date)
    const day = date.getDay()
    startOfWeek.setDate(date.getDate() - day)
    return startOfWeek
  }

  // Generate week days
  const generateWeekDays = (startDate) => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour}:00`)
    }
    return slots
  }

  const startOfWeek = getStartOfWeek(currentDate)
  const weekDays = generateWeekDays(startOfWeek)
  const timeSlots = generateTimeSlots()

  // Get events for a specific day and hour
  const getEventsForSlot = (day, hour) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getHours() === hour
      )
    })
  }

  const handleCellClick = (day, hour) => {
    const eventTitle = prompt("Enter event title:")
    if (!eventTitle) return

    const newEvent = {
      title: eventTitle,
      start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, 0),
      end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour + 1, 0),
      color: "#4285F4",
    }

    onAddEvent(newEvent)
  }

  // Format day header
  const formatDayHeader = (date) => {
    const today = new Date()
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()

    return (
      <div className={`day-header ${isToday ? "today" : ""}`}>
        <div className="day-name">{date.toLocaleString("default", { weekday: "short" })}</div>
        <div className="day-number">{date.getDate()}</div>
      </div>
    )
  }

  return (
    <div className="week-view">
      <div className="time-grid">
        <div className="time-labels">
          <div className="corner-header"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="day-column-header">
              {formatDayHeader(day)}
            </div>
          ))}
        </div>

        <div className="time-slots">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="time-row">
              <div className="time-label">{time}</div>
              {weekDays.map((day, dayIndex) => (
                <div
                  key={`${timeIndex}-${dayIndex}`}
                  className="time-cell"
                  onClick={() => handleCellClick(day, timeIndex)}
                >
                  {getEventsForSlot(day, timeIndex).map((event) => (
                    <Event key={event.id} event={event} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WeekView
