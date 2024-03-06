import axios from "axios";
import { API_BASE_URL, AUTH_API_BASE_URL } from "../../api/apiConfig";
import {
  FIND_USER_BY_ID_FAILURE,
  FIND_USER_BY_ID_REQUEST,
  FIND_USER_BY_ID_SUCCESS,
  FIND_USER_FAILURE,
  FIND_USER_REQUEST,
  FIND_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  SEARCH_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SIGN_IN_FAILURE,
  SIGN_IN_REQUEST,
  SIGN_IN_SUCCESS,
  SIGN_OUT,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./actionType";

export const signUp = (reqData, authSignIn) => async (dispatch) => {
  dispatch({ type: SIGN_UP_REQUEST });
  try {
    axios.defaults.baseURL = AUTH_API_BASE_URL;
    const { data } = await axios.post("/signup", reqData);
    if (data.token) {
      authSignIn(data.token, data.admin);
    }
    dispatch({ type: SIGN_UP_SUCCESS });
  } catch (error) {
    dispatch({
      type: SIGN_UP_FAILURE,
      payload: error?.response?.data?.message,
    });
  } finally {
    axios.defaults.baseURL = API_BASE_URL;
  }
};

export const signIn = (reqData, authSignIn) => async (dispatch) => {
  dispatch({ type: SIGN_IN_REQUEST });
  try {
    axios.defaults.baseURL = AUTH_API_BASE_URL;
    const { data } = await axios.post(`/signin`, reqData);
    if (data.token) {
      authSignIn(data.token, data.admin);
    }
    dispatch({ type: SIGN_IN_SUCCESS });
  } catch (error) {
    dispatch({
      type: SIGN_IN_FAILURE,
      payload: error?.response?.data?.message,
    });
  } finally {
    axios.defaults.baseURL = API_BASE_URL;
  }
};

export const currentUser = (authSignOut) => async (dispatch) => {
  dispatch({ type: FIND_USER_REQUEST });
  try {
    const { data } = await axios.get(`/users/profile`);
    dispatch({ type: FIND_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_USER_FAILURE,
      payload: error?.response?.data?.message,
    });
    if (error?.response?.data?.status === false) {
      dispatch(signOut(authSignOut));
    }
  }
};

export const findUserById = (userId, navigate) => async (dispatch) => {
  dispatch({ type: FIND_USER_BY_ID_REQUEST });
  try {
    const { data } = await axios.get(`users/${userId}`);
    dispatch({ type: FIND_USER_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_USER_BY_ID_FAILURE,
      payload: error?.response?.data?.message,
    });
    if (navigate) {
      navigate("/");
    }
  }
};

export const searchUsers = (keyword) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const { data } = await axios.get(`users/search?query=${keyword}`);
    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_USER_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const followUser = (userId) => async (dispatch) => {
  dispatch({ type: FOLLOW_USER_REQUEST });
  try {
    const { data } = await axios.put(`users/${userId}/follow`);
    dispatch({ type: FOLLOW_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FOLLOW_USER_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const updateUser = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await axios.put(`users`, reqData);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const signOut = (authSignOut) => async (dispatch) => {
  if (authSignOut) authSignOut();
  dispatch({ type: SIGN_OUT, payload: null });
};
