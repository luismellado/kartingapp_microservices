"use client"
import "./MonthView.css"
import Event from "./Event"

const MonthView = ({ currentDate, events, onAddEvent }) => {
  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Create calendar days array
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: "", isCurrentMonth: false })
  }

  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, isCurrentMonth: true })
  }

  // Get events for a specific day
  const getEventsForDay = (day) => {
    if (!day) return []

    return events.filter((event) => {
      const eventDate = new Date(event.start)
      return eventDate.getDate() === day && eventDate.getMonth() === month && eventDate.getFullYear() === year
    })
  }

  const handleCellClick = (day) => {
    if (!day) return

    const eventTitle = prompt("Enter event title:")
    if (!eventTitle) return

    const startHour = Number.parseInt(prompt("Enter start hour (0-23):", "9"), 10)
    const endHour = Number.parseInt(prompt("Enter end hour (0-23):", "10"), 10)

    const newEvent = {
      title: eventTitle,
      start: new Date(year, month, day, startHour, 0),
      end: new Date(year, month, day, endHour, 0),
      color: "#4285F4",
    }

    onAddEvent(newEvent)
  }

  // Get day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="month-view">
      <div className="weekdays">
        {dayNames.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="days-grid">
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-cell ${day.isCurrentMonth ? "current-month" : "other-month"}`}
            onClick={() => handleCellClick(day.day)}
          >
            {day.day && (
              <>
                <div className="day-number">{day.day}</div>
                <div className="day-events">
                  {getEventsForDay(day.day)
                    .slice(0, 3)
                    .map((event) => (
                      <Event key={event.id} event={event} isMonthView={true} />
                    ))}
                  {getEventsForDay(day.day).length > 3 && (
                    <div className="more-events">{`+${getEventsForDay(day.day).length - 3} more`}</div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthView
