import "./Event.css"

const Event = ({ event, isMonthView, isDayView }) => {
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getEventDuration = () => {
    return (event.end - event.start) / (1000 * 60 * 60) // in hours
  }

  const eventStyle = {
    backgroundColor: event.color,
    height: isMonthView ? "auto" : `${getEventDuration() * 60}px`,
  }

  return (
    <div
      className={`calendar-event ${isMonthView ? "month-event" : ""} ${isDayView ? "day-event" : ""}`}
      style={eventStyle}
    >
      <div className="event-title">{event.title}</div>
      {!isMonthView && (
        <div className="event-time">
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      )}
    </div>
  )
}

export default Event
