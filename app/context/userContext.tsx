import { clearData, getData, storeData } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import { useNavigation } from "expo-router";
import { Alert, ToastAndroid } from "react-native";

type UserContextType = {
	user: any | null;
	setUser: (user: any) => void;
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	token: string | null;
	setToken: (token: string) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	savedSpeeches: SavedSpeechType[];
	setSavedSpeeches: (speeches: SavedSpeechType[]) => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
	token: "",
	setToken: () => {},
	tasks: [],
	setTasks: () => {},
	savedSpeeches: [],
	setSavedSpeeches: () => {},
});

interface SavedSpeechType {
	id: string;
	createdAt: string;
	template: string
	speech: string;
}

export interface Task {
	id: string;
	priority: "HIGH" | "MEDIUM" | "LOW";
	title: string;
	description: string;
	completed: false;
	deadline: Date;
}

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<any | null>({
		email: "",
		name: "",
	});
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	const [token, setToken] = React.useState<string | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [savedSpeeches, setSavedSpeeches] = useState<SavedSpeechType[]>([]);

	const fetchTasks = async () => {
		try {
			const response = await axios.get("/tasks");
			console.log(response.data);
			setTasks(response.data);
			// Store tasks in AsyncStorage
			await storeData("tasks", response.data);
		} catch (error) {
			// If API fails, try to get tasks from AsyncStorage
			const storedTasks = await getData("tasks");
			if (storedTasks) {
				setTasks(storedTasks);
			}
		}
	};

	useEffect(() => {
		const initializeData = async () => {
			// Get user data
			const userData = await getData("userData");
			if (userData) {
				setUser(userData);
				setIsLoggedIn(true);
			}

			// Get token
			const storedToken = await getData("token");
			if (storedToken) {
				setToken(storedToken);
				setIsLoggedIn(true);
			}

			// Get tasks from AsyncStorage first
			const storedTasks = await getData("tasks");
			if (storedTasks) {
				setTasks(storedTasks);
			}

			// Then fetch latest from API
			fetchTasks();
		};

		initializeData();
		
		const initializeSpeeches = async () => {
			const speeches = await getData("savedSpeeches").then((data) => {
				setSavedSpeeches(data);
			});
		}

		initializeSpeeches();

	}, []);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isLoggedIn,
				setIsLoggedIn,
				token,
				setToken,
				savedSpeeches,
				setSavedSpeeches,
				tasks,
				setTasks,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export { UserContext, UserContextProvider };

export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext must be used within an UserProvider");
	}
	return context;
};
