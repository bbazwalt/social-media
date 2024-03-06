import axios from "axios";
import {
  CREATE_POST_FAILURE,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_REPLY_POST_FAILURE,
  CREATE_REPLY_POST_REQUEST,
  CREATE_REPLY_POST_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  FIND_ALL_FOLLOWING_USER_POSTS_FAILURE,
  FIND_ALL_FOLLOWING_USER_POSTS_REQUEST,
  FIND_ALL_FOLLOWING_USER_POSTS_SUCCESS,
  FIND_ALL_POSTS_FAILURE,
  FIND_ALL_POSTS_REQUEST,
  FIND_ALL_POSTS_SUCCESS,
  FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_FAILURE,
  FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_REQUEST,
  FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_SUCCESS,
  FIND_ALL_USER_LIKED_POSTS_FAILURE,
  FIND_ALL_USER_LIKED_POSTS_REQUEST,
  FIND_ALL_USER_LIKED_POSTS_SUCCESS,
  FIND_ALL_USER_MEDIA_POSTS_FAILURE,
  FIND_ALL_USER_MEDIA_POSTS_REQUEST,
  FIND_ALL_USER_MEDIA_POSTS_SUCCESS,
  FIND_ALL_USER_POSTS_FAILURE,
  FIND_ALL_USER_POSTS_REQUEST,
  FIND_ALL_USER_POSTS_SUCCESS,
  FIND_ALL_USER_REPLY_POSTS_FAILURE,
  FIND_ALL_USER_REPLY_POSTS_REQUEST,
  FIND_ALL_USER_REPLY_POSTS_SUCCESS,
  FIND_POST_BY_ID_FAILURE,
  FIND_POST_BY_ID_REQUEST,
  FIND_POST_BY_ID_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  REPOST_FAILURE,
  REPOST_REQUEST,
  REPOST_SUCCESS,
} from "./actionType";

export const createPost = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_REQUEST });
  try {
    const { data } = await axios.post(`/posts`, reqData);
    dispatch({ type: CREATE_POST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CREATE_POST_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const createReplyPost =
  (reqData, handleClose, resetForm) => async (dispatch) => {
    dispatch({ type: CREATE_REPLY_POST_REQUEST });
    try {
      const { data } = await axios.post(`/posts/reply`, reqData);
      handleClose();
      resetForm();
      dispatch({ type: CREATE_REPLY_POST_SUCCESS, payload: data });
      dispatch(findAllReplyPostsByParentPostId(reqData.postId));
    } catch (error) {
      dispatch({
        type: CREATE_REPLY_POST_FAILURE,
        payload: error?.response?.data?.message,
      });
    }
  };

export const findPostById = (postId) => async (dispatch) => {
  dispatch({ type: FIND_POST_BY_ID_REQUEST });
  try {
    const { data } = await axios.get(`/posts/${postId}`);
    dispatch({ type: FIND_POST_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_POST_BY_ID_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const likePost = (postId) => async (dispatch) => {
  dispatch({ type: LIKE_POST_REQUEST });
  try {
    const { data } = await axios.put(`/likes/${postId}`);
    dispatch({ type: LIKE_POST_SUCCESS, payload: data.post });
  } catch (error) {
    dispatch({
      type: LIKE_POST_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const repost = (postId) => async (dispatch) => {
  dispatch({ type: REPOST_REQUEST });
  try {
    const { data } = await axios.put(`/posts/${postId}/repost`);
    dispatch({ type: REPOST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: REPOST_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const deletePost = (postId, navigate) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    await axios.delete(`/posts/${postId}`);
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
    if (navigate) {
      navigate("/");
    }
  } catch (error) {
    dispatch({
      type: DELETE_POST_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllReplyPostsByParentPostId = (postId) => async (dispatch) => {
  dispatch({ type: FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_REQUEST });
  try {
    const { data } = await axios.get(`/posts/reply/${postId}`);
    dispatch({
      type: FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllFollowingUserPosts = () => async (dispatch) => {
  dispatch({ type: FIND_ALL_FOLLOWING_USER_POSTS_REQUEST });
  try {
    const { data } = await axios.get("/posts/user");
    dispatch({ type: FIND_ALL_FOLLOWING_USER_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_FOLLOWING_USER_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllPosts = () => async (dispatch) => {
  dispatch({ type: FIND_ALL_POSTS_REQUEST });
  try {
    const { data } = await axios.get("/posts");
    dispatch({ type: FIND_ALL_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllUserPosts = (userId) => async (dispatch) => {
  dispatch({ type: FIND_ALL_USER_POSTS_REQUEST });
  try {
    const { data } = await axios.get(`/posts/user/${userId}`);
    dispatch({ type: FIND_ALL_USER_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_USER_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllUserReplyPosts = (userId) => async (dispatch) => {
  dispatch({ type: FIND_ALL_USER_REPLY_POSTS_REQUEST });
  try {
    const { data } = await axios.get(`/posts/user/replies/${userId}`);
    dispatch({ type: FIND_ALL_USER_REPLY_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_USER_REPLY_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllUserMediaPosts = (userId) => async (dispatch) => {
  dispatch({ type: FIND_ALL_USER_MEDIA_POSTS_REQUEST });
  try {
    const { data } = await axios.get(`/posts/user/media/${userId}`);
    dispatch({ type: FIND_ALL_USER_MEDIA_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_USER_MEDIA_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};

export const findAllUserLikedPosts = (userId) => async (dispatch) => {
  dispatch({ type: FIND_ALL_USER_LIKED_POSTS_REQUEST });
  try {
    const { data } = await axios.get(`/posts/user/${userId}/likes`);
    dispatch({ type: FIND_ALL_USER_LIKED_POSTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_ALL_USER_LIKED_POSTS_FAILURE,
      payload: error?.response?.data?.message,
    });
  }
};
