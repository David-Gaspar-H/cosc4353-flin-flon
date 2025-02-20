import "./App.css";
import Login from "./components/Login";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserTable from "./components/UserTabel.jsx";
import User from "./components/User.jsx";
import Register from "./components/Register.jsx";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/login" element={<Login />} />
				</Routes>
				<Routes>
					<Route path="/admin" element={<Admin />} />
				</Routes>
				<Routes>
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
				<Routes>
					<Route path="/users" element={<UserTable />} />
				</Routes>
				<Routes>
					<Route path="/register" element={<Register />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
