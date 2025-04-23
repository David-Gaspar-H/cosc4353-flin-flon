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
	const [isLoading, setIsLoading] = useState(true);

	// Function to log in and set user data
	const login = useCallback((userData) => {
		const formattedUserData = {
			id: userData.id,
			first_name: userData.first_name,
			last_name: userData.last_name,
			role: userData.role,
			status: userData.status,
			email: userData.email,
			username: userData.username,
			unit: userData.unit,
		};

		setUser(formattedUserData);
		localStorage.setItem("user_data", JSON.stringify(formattedUserData)); // Store user data in local storage
	}, []);

	// Function to log out and clear user data
	const logout = () => {
		setUser(null);
		// Clear user data from local storage
		localStorage.removeItem("user_data");
	};

	// Initialize user data from localStorage
	useEffect(() => {
		const loadUserData = () => {
			try {
				setIsLoading(true);
				const storedUserData = localStorage.getItem("user_data");

				// Only set user if we have both user data, type and a token
				if (storedUserData && storedUserType && accessToken) {
					const userData = JSON.parse(storedUserData);
					setUser(userData);
				} else {
					// Clear potentially inconsistent state
					logout();
				}
			} catch (error) {
				console.error("Error loading user data:", error);
				logout();
			} finally {
				setIsLoading(false);
			}
		};

		loadUserData();
	}, []);

	return (
		<UserContext.Provider value={{ user, login, logout, isLoading }}>
			{children}
		</UserContext.Provider>
	);
};
