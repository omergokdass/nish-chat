import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import { ReactNode, useState, createContext, useContext} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';
import { login, register } from "@/services/authService";

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    updateToken: async () => {},
});

export const AuthProvider = ({children}: {children: ReactNode})=>{
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const router = useRouter();

    const updateToken = async (token: string)=>{
        if(token){
            setToken(token);
            await AsyncStorage.setItem("token", token);
            //decode token (user)
            const decoded = jwtDecode<DecodedTokenProps>(token);
            console.log("decoded token: ", decoded);
            setUser(decoded.user);
        }
    }

    const signIn = async(email: string, password: string)=>{
        const response = await login(email, password);
        await updateToken(response.token);
        router.replace("/(main)/home")
    }

    const signUp = async (
        email: string, 
        password: string,
        name: string,
        avatar?: string | null
    ) => {
        const response = await register(email, password, name, avatar);
        await updateToken(response.token);
        router.replace("/(main)/home")
    };


    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/welcome");
    }
    return (
        <AuthContext.Provider value={{token, user, signIn, signUp, signOut, updateToken}}
        >
        {children}
        </AuthContext.Provider>
    )
};


export const useAuth = ()=> useContext(AuthContext);