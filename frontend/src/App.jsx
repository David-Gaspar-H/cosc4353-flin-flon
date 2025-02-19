import "./App.css";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserTable from "./components/UserTabel.jsx";
import User from "./components/User.jsx";

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
					<Route path="/users" element={<UserTable />} />
				</Routes>
				<Routes>
					<Route path="/user" element={<User />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
