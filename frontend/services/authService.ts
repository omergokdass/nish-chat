import axios from "axios";
import { API_URL } from "@/constants";

export const login = async (
    email: string,
    password: string
): Promise<{ token: string }> => {
    try {

        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });

        return response.data;
    } catch (error: any) {
        console.log("got error: ", error);
        const msg = error?.response?.data?.msg || "Login failed";
        throw new Error(msg);
    }
};

export const register = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            name,
            avatar
        });
        return response.data;
    } catch (error: any) {
        console.log("got error: ", error);
        const msg = error?.response?.data?.msg || "Registration failed";
        throw new Error(msg);
    }
};

export const verifyCode = async (
    email: string,
    code: string
): Promise<{ success: boolean; token: string; user: any }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/verify-code`, {
            email,
            code,
        });
        return response.data;
    } catch (error: any) {
        console.log("verify code error: ", error);
        const msg = error?.response?.data?.msg || "Verification failed";
        throw new Error(msg);
    }
};

export const resendCode = async (email: string): Promise<{ success: boolean; msg: string }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/resend-code`, {
            email,
        });
        return response.data;
    } catch (error: any) {
        console.log("resend code error: ", error);
        const msg = error?.response?.data?.msg || "Resend code failed";
        throw new Error(msg);
    }
};