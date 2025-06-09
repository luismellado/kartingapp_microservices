"use client"
import "./CalendarHeader.css"

const CalendarHeader = ({ currentDate, view, onViewChange, onPrev, onNext, onToday }) => {
  const formatHeaderDate = () => {
    const options = { month: "long", year: "numeric" }
    if (view === "day") {
      options.day = "numeric"
    } else if (view === "week") {
      const startOfWeek = new Date(currentDate)
      const day = currentDate.getDay()
      startOfWeek.setDate(currentDate.getDate() - day)

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.getDate()} - ${endOfWeek.getDate()} ${startOfWeek.toLocaleString("default", { month: "long" })} ${startOfWeek.getFullYear()}`
      } else if (startOfWeek.getFullYear() === endOfWeek.getFullYear()) {
        return `${startOfWeek.getDate()} ${startOfWeek.toLocaleString("default", { month: "short" })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString("default", { month: "long" })} ${startOfWeek.getFullYear()}`
      } else {
        return `${startOfWeek.getDate()} ${startOfWeek.toLocaleString("default", { month: "short" })} ${startOfWeek.getFullYear()} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString("default", { month: "short" })} ${endOfWeek.getFullYear()}`
      }
    }

    return currentDate.toLocaleString("default", options)
  }

  return (
    <div className="calendar-header">
      <div className="calendar-nav">
        <button className="today-btn" onClick={onToday}>
          Today
        </button>
        <div className="nav-arrows">
          <button onClick={onPrev}>&lt;</button>
          <button onClick={onNext}>&gt;</button>
        </div>
        <h2>{formatHeaderDate()}</h2>
      </div>

      <div className="view-options">
        <button className={view === "day" ? "active" : ""} onClick={() => onViewChange("day")}>
          Day
        </button>
        <button className={view === "week" ? "active" : ""} onClick={() => onViewChange("week")}>
          Week
        </button>
        <button className={view === "month" ? "active" : ""} onClick={() => onViewChange("month")}>
          Month
        </button>
      </div>
    </div>
  )
}

export default CalendarHeader
