import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Navbar from './components/NavBar';
import Calendar from "./components/calendar/Calendar"
import AddBooking from './components/addBooking/AddBooking.jsx';
import Config from './components/configPanel/Configpanel.jsx'
import Report from './components/reportPanel/reportPanel.jsx'


function App() {
  return (
      <Router>
          <div className="container">
          <Navbar></Navbar>
            <Routes>
              <Route path="/" element={<Calendar/>} />
              <Route path="/add" element={<AddBooking/>} />
              <Route path="/config" element={<Config/>} />
              <Route path="/reports" element={<Report/>} />
            </Routes>
          </div>
      </Router>
  );
}

export default App
