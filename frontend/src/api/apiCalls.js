import axios from "axios";
import { BASE_URL } from "./baseURL";

export const signup = (user) => {
  return axios.post(BASE_URL + "/api/v1/users", user);
};

export const login = (user) => {
  return axios.post(BASE_URL + "/api/v1/login", {}, { auth: user });
};

export const setAuthorizationHeader = ({ username, password, isLoggedIn }) => {
  if (isLoggedIn) {
    axios.defaults.headers.common["Authorization"] = `Basic ${btoa(
      username + ":" + password
    )}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const listUsers = (param = { page: 0, size: 3 }) => {
  const path =
    BASE_URL + `/api/v1/users?page=${param.page || 0}&size=${param.size || 3}`;
  return axios.get(path);
};

export const getUser = (username) => {
  return axios.get(BASE_URL + `/api/v1/users/${username}`);
};

export const updateUser = (userId, body) => {
  return axios.put(BASE_URL + "/api/v1/users/" + userId, body);
};

export const postPost = (post) => {
  return axios.post(BASE_URL + "/api/v1/posts", post);
};

export const loadPosts = (username) => {
  const basePath = username
    ? BASE_URL + `/api/v1/users/${username}/posts`
    : BASE_URL + "/api/v1/posts";
  return axios.get(basePath + "?page=0&size=5&sort=id,desc");
};

export const loadOldPosts = (postId, username) => {
  const basePath = username
    ? BASE_URL + `/api/v1/users/${username}/posts`
    : BASE_URL + "/api/v1/posts";
  const path = `${basePath}/${postId}?direction=before&page=0&size=5&sort=id,desc`;
  return axios.get(path);
};

export const loadNewPosts = (postId, username) => {
  const basePath = username
    ? BASE_URL + `/api/v1/users/${username}/posts`
    : BASE_URL + "/api/v1/posts";
  const path = `${basePath}/${postId}?direction=after&sort=id,desc`;
  return axios.get(path);
};

export const loadNewPostCount = (postId, username) => {
  const basePath = username
    ? BASE_URL + `/api/v1/users/${username}/posts`
    : BASE_URL + "/api/v1/posts";
  const path = `${basePath}/${postId}?direction=after&count=true`;
  return axios.get(path);
};

export const postPostFile = (file) => {
  return axios.post(BASE_URL + "/api/v1/posts/upload", file);
};

export const deletePost = (postId) => {
  return axios.delete(BASE_URL + "/api/v1/posts/" + postId);
};
