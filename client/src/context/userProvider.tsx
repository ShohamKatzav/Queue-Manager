import { ReactNode, useEffect, useState } from "react";
import { User } from "../types/User";
import UserContext from "./userContext";
import { useCookies } from 'react-cookie';

type UserProviderProps = {
    children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['userInfo']);

    useEffect(() => {
        // Handle user state based on cookie
        const userInfo = cookies.userInfo;
        if (userInfo) {
            setUser(userInfo);
        } else if (!userInfo && user) {
            setUser(null);
        }
        setLoading(false);
    }, [cookies.userInfo, user]);

    const updateUser = (userData: User | null) => {
        setUser(userData);
        if (userData) {
            setCookie("userInfo", userData);
        } else {
            removeCookie("userInfo");
        }
    };

    const updateUserType = (userType: string) => {
        const updatedUser: User = {
            _id: user?._id ?? undefined,
            email: user?.email ?? undefined,
            userType,
        };

        if (user?.userType !== userType) {
            setUser(updatedUser);
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser, updateUserType, loading }}>
            {children}
        </UserContext.Provider>
    );
};