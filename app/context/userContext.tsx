import { clearData, getData } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import { useNavigation } from "expo-router";
import { Alert, ToastAndroid } from "react-native";
import { Task } from "@/app/(tabs)/tasks";
import { SavedSpeech } from "@/app/(tabs)/documents";

type UserContextType = {
	user: any | null;
	setUser: (user: any) => void;
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
	token: string | null;
	setToken: (token: string) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	savedSpeeches: SavedSpeech[];
	setSavedSpeeches: (speeches: SavedSpeech[]) => void;
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

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<any | null>({
		email: "",
		name: "",
	});
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	const [token, setToken] = React.useState<string | null>(null);
	const [tasks, setTasks] = useState<Task[]>([]);
	const [savedSpeeches, setSavedSpeeches] = useState<SavedSpeech[]>([]);

	const fetchTasks = async () => {
		try {
			const response = await axios.get("/tasks");
			console.log(response.data);
			setTasks(response.data);
		} catch (error) {
			//   Alert.alert("Error", "Failed to fetch tasks");
		}
	};

	useEffect(() => {
		getData("userData").then((data) => {
			if (data) {
				setUser(data);
				setIsLoggedIn(true);
			}
		});
		getData("token").then((data) => {
			if (data) {
				setToken(data);
				setIsLoggedIn(true);
			}
		});
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
