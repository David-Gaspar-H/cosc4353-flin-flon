import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

// Context for user data
const UserContext = createContext(null);

// Custom hook to access the user context
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	// Function to log in and set user data
	const login = useCallback((userData, userType) => {
		const formattedUserData = {
			name: userData.name,
			role: userData.role,
		};

		setUser(formattedUserData);
		localStorage.setItem("user_data", JSON.stringify(formattedUserData)); // Store user data in local storage
		localStorage.setItem("user_type", userType); // Store type
	}, []);

	// Function to log out and clear user data
	const logout = () => {
		setUser(null);
		// Clear user data from local storage
		localStorage.removeItem("user_data");
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user_type");
	};

	useEffect(() => {
		const storedUserData = localStorage.getItem("user_data");
		const storedUserType = localStorage.getItem("user_type");

		if (storedUserData && storedUserType) {
			const userData = JSON.parse(storedUserData);
			login(userData, storedUserType); // Set user data in context
		}
	}, [login]);

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};
