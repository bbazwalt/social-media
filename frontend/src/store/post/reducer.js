import {
  updateDeletedPosts,
  updateLikedPosts,
  updateRepliedPosts,
  updateRepostedPosts,
} from "../../utils/otherUtils";
import { SIGN_OUT } from "../user/actionType";
import {
  CLEAR_POST_ERROR,
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

const initialState = {
  post: null,
  replyPosts: [],
  followingPosts: [],
  posts: [],
  userPosts: [],
  userReplyPosts: [],
  userMediaPosts: [],
  userLikedPosts: [],
  isLoading: false,
  error: null,
};

export const postReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CREATE_POST_REQUEST:
    case CREATE_REPLY_POST_REQUEST:
    case FIND_POST_BY_ID_REQUEST:
    case LIKE_POST_REQUEST:
    case REPOST_REQUEST:
    case DELETE_POST_REQUEST:
    case FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_REQUEST:
    case FIND_ALL_FOLLOWING_USER_POSTS_REQUEST:
    case FIND_ALL_POSTS_REQUEST:
    case FIND_ALL_USER_POSTS_REQUEST:
    case FIND_ALL_USER_REPLY_POSTS_REQUEST:
    case FIND_ALL_USER_MEDIA_POSTS_REQUEST:
    case FIND_ALL_USER_LIKED_POSTS_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case CREATE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        posts: [payload, ...state.posts],
      };
    case CREATE_REPLY_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        replyPosts: updateRepliedPosts(state.replyPosts, payload),
        posts: updateRepliedPosts(state.posts, payload),
        followingPosts: updateRepliedPosts(state.followingPosts, payload),
        userPosts: updateRepliedPosts(state.userPosts, payload),
        userReplyPosts: updateRepliedPosts(state.userReplyPosts, payload),
        userLikedPosts: updateRepliedPosts(state.userLikedPosts, payload),
      };
    case FIND_POST_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        post: payload,
      };
    case LIKE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        post:
          state.post && state.post.id === payload.id
            ? {
                ...state.post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : state.post,
        replyPosts: updateLikedPosts(state.replyPosts, payload),
        posts: updateLikedPosts(state.posts, payload),
        followingPosts: updateLikedPosts(state.followingPosts, payload),
        userPosts: updateLikedPosts(state.userPosts, payload),
        userReplyPosts: updateLikedPosts(state.userReplyPosts, payload),
        userLikedPosts: updateLikedPosts(state.userLikedPosts, payload),
      };
    case REPOST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        post:
          state.post && state.post.id === payload.id
            ? {
                ...state.post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : state.post,
        replyPosts: updateRepostedPosts(state.replyPosts, payload),
        posts: updateRepostedPosts(state.posts, payload),
        followingPosts: updateRepostedPosts(state.followingPosts, payload),
        userPosts: updateRepostedPosts(state.userPosts, payload),
        userReplyPosts: updateRepostedPosts(state.userReplyPosts, payload),
        userLikedPosts: updateRepostedPosts(state.userLikedPosts, payload),
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        post: {
          ...state.post,
          totalReplies: state.post.totalReplies - 1,
        },
        replyPosts: updateDeletedPosts(state.replyPosts, payload),
        posts: updateDeletedPosts(state.posts, payload),
        followingPosts: updateDeletedPosts(state.followingPosts, payload),
        userPosts: updateDeletedPosts(state.userPosts, payload),
        userReplyPosts: updateDeletedPosts(state.userReplyPosts, payload),
        userMediaPosts: updateDeletedPosts(state.userMediaPosts, payload),
        userLikedPosts: updateDeletedPosts(state.userLikedPosts, payload),
      };
    case FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        replyPosts: payload,
      };
    case FIND_ALL_FOLLOWING_USER_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        followingPosts: payload,
      };
    case FIND_ALL_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        posts: payload,
      };
    case FIND_ALL_USER_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        userPosts: payload,
      };
    case FIND_ALL_USER_REPLY_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        userReplyPosts: payload,
      };
    case FIND_ALL_USER_MEDIA_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        userMediaPosts: payload,
      };
    case FIND_ALL_USER_LIKED_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        userLikedPosts: payload,
      };
    case CREATE_POST_FAILURE:
    case CREATE_REPLY_POST_FAILURE:
    case FIND_POST_BY_ID_FAILURE:
    case LIKE_POST_FAILURE:
    case REPOST_FAILURE:
    case DELETE_POST_FAILURE:
    case FIND_ALL_REPLY_POSTS_BY_PARENT_POST_ID_FAILURE:
    case FIND_ALL_FOLLOWING_USER_POSTS_FAILURE:
    case FIND_ALL_POSTS_FAILURE:
    case FIND_ALL_USER_POSTS_FAILURE:
    case FIND_ALL_USER_REPLY_POSTS_FAILURE:
    case FIND_ALL_USER_MEDIA_POSTS_FAILURE:
    case FIND_ALL_USER_LIKED_POSTS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
    case CLEAR_POST_ERROR:
      return {
        ...state,
        error: null,
      };
    case SIGN_OUT:
      return {
        ...state,
        isLoading: false,
        data: null,
        error: null,
        posts: [],
        post: null,
        replyPosts: [],
        userPosts: [],
        userReplyPosts: [],
        userMediaPosts: [],
        userLikedPosts: [],
      };
    default:
      return state;
  }
};
