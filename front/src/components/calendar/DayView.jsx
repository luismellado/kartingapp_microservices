"use client"
import "./DayView.css"
import Event from "./Event"

const DayView = ({ currentDate, events, onAddEvent }) => {
  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour}:00`)
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // Get events for a specific hour
  const getEventsForHour = (hour) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getHours() === hour
      )
    })
  }

  const handleTimeSlotClick = (hour) => {
    const eventTitle = prompt("Enter event title:")
    if (!eventTitle) return

    const newEvent = {
      title: eventTitle,
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour, 0),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hour + 1, 0),
      color: "#4285F4",
    }

    onAddEvent(newEvent)
  }

  // Format day header
  const formatDayHeader = () => {
    const today = new Date()
    const isToday =
      currentDate.getDate() === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()

    return (
      <div className={`day-view-header ${isToday ? "today" : ""}`}>
        <div className="day-name">{currentDate.toLocaleString("default", { weekday: "long" })}</div>
        <div className="day-date">{currentDate.toLocaleString("default", { month: "long", day: "numeric" })}</div>
      </div>
    )
  }

  return (
    <div className="day-view">
      {formatDayHeader()}

      <div className="day-time-slots">
        {timeSlots.map((time, index) => (
          <div key={index} className="day-time-slot" onClick={() => handleTimeSlotClick(index)}>
            <div className="time-label">{time}</div>
            <div className="time-slot-content">
              {getEventsForHour(index).map((event) => (
                <Event key={event.id} event={event} isDayView={true} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DayView
