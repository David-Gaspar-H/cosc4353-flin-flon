import "./App.css";
import Login from "./components/Login";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register.jsx";
import HomePage from "./components/HomePage.jsx";
import AuthCallback from "./components/AuthCallback";
import ReduceCourseLoadForm from "./components/ReduceCourseLoadForm.jsx";
import FerpaForm from "./components/FerpaForm.jsx";
import Signature from "./components/Signature.jsx";
import FormsTable from "./components/FormsTable.jsx";
import UserFormRequest from "./components/UserFormRequest.jsx";

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
				{/*for testing purpose START*/}
				<Routes>
					<Route path="/reduce" element={<ReduceCourseLoadForm />} />
				</Routes>
				<Routes>
					<Route path="/ferpa" element={<FerpaForm />} />
				</Routes>
				<Routes>
					<Route path="/form-request" element={<UserFormRequest />} />
				</Routes>
				<Routes>
					<Route path="/signature" element={<Signature />} />
				</Routes>
				<Routes>
					<Route path="/forms" element={<FormsTable />} />
				</Routes>
				{/*for testing purpose END*/}
				<Routes>
					<Route path="/auth/callback" element={<AuthCallback />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
