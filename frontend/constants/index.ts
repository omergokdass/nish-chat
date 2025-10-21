import { Platform } from "react-native";

export const API_URL = 
    Platform.OS == "android" ? "http://10.0.2.2:3000" : "http://172.20.10.3:3000"
;
