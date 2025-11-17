import { Platform } from "react-native";

export const API_URL = 
    Platform.OS == "android" ? "http://10.0.2.2:3000" : "http://10.19.18.239:3000";

export const CLOUDINARY_CLOUD_NAME = "dzhdyjyja";
export const CLOUDINARY_UPLOAD_PRESET = "images";    
