import "./App.css";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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
			</Router>
		</>
	);
}

export default App;
