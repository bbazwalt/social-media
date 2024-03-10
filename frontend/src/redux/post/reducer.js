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
        replyPosts: state.replyPosts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
        posts: state.posts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
        followingPosts: state.followingPosts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
        userPosts: state.userPosts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
        userReplyPosts: state.userReplyPosts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
        userLikedPosts: state.userLikedPosts.map((post) =>
          post.id === payload.id
            ? { ...post, totalReplies: payload.totalReplies }
            : post,
        ),
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
        replyPosts: state.replyPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
        posts: state.posts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
        followingPosts: state.followingPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
        userPosts: state.userPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
        userReplyPosts: state.userReplyPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
        userLikedPosts: state.userLikedPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalLikes: payload.totalLikes,
                liked: payload.liked,
              }
            : post,
        ),
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
        replyPosts: state.replyPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
        posts: state.posts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
        followingPosts: state.followingPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
        userPosts: state.userPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
        userReplyPosts: state.userReplyPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
        userLikedPosts: state.userLikedPosts.map((post) =>
          post.id === payload.id
            ? {
                ...post,
                totalReposts: payload.totalReposts,
                reposted: payload.reposted,
              }
            : post,
        ),
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
        replyPosts: state.replyPosts.filter((post) => post.id !== payload),
        posts: state.posts.filter((post) => post.id !== payload),
        followingPosts: state.followingPosts.filter(
          (post) => post.id !== payload,
        ),
        userPosts: state.userPosts.filter((post) => post.id !== payload),
        userReplyPosts: state.userReplyPosts.filter(
          (post) => post.id !== payload,
        ),
        userMediaPosts: state.userMediaPosts.filter(
          (post) => post.id !== payload,
        ),
        userLikedPosts: state.userLikedPosts.filter(
          (post) => post.id !== payload,
        ),
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
