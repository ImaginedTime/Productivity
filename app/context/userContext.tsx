import { clearData, getData } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";

import { useNavigation } from "expo-router";
import { ToastAndroid } from "react-native";

type UserContextType = {
	user: any | null;
	setUser: (user: any) => void;
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const UserContext = createContext<UserContextType>({
	user: null,
	setUser: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = React.useState<any | null>({
		email: "",
		name: "",
	});
	const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

	useEffect(() => {
		getData("userData").then((data) => {
			if (data) {
				setUser(data);
				setIsLoggedIn(true);
			}
		});
	}, [user]);

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				isLoggedIn,
				setIsLoggedIn,
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
