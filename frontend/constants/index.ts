import { Platform } from "react-native";

export const API_URL = 
    Platform.OS == "android" ? "http://192.168.122.1:3000" : "http://192.168.1.103:3000";

export const CLOUDINARY_CLOUD_NAME = "dzhdyjyja";
export const CLOUDINARY_UPLOAD_PRESET = "images";    
