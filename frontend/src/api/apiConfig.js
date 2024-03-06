import axios from "axios";

export const BASE_URL = "https://social-media-k9ng.onrender.com";
export const AUTH_API_BASE_URL = BASE_URL + "/auth";
export const API_BASE_URL_V1 = BASE_URL + "/api/v1";
export const API_BASE_URL = API_BASE_URL_V1;
export const REQUEST_HEADER = "Authorization";
axios.defaults.baseURL = API_BASE_URL;
