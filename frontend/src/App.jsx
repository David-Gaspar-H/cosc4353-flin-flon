import './App.css'
import Login from './components/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
     </Router>
    </>
  )
}

export default App
