import "./App.css";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import HomePage from "./components/HomePage.jsx";
import AuthCallback from './components/AuthCallback';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
				</Routes>
				<Routes>
					<Route path="/dashboard" element={<Admin />} />
				</Routes>
				<Routes>
					<Route path="/register" element={<Register />} />
				</Routes>
				<Routes>
					<Route path="/" element={<HomePage />} />
				</Routes>
				<Routes>
					<Route path="/auth/callback" element={<AuthCallback />} />
				</Routes>

			</Router>
		</>
	);
}

export default App;
