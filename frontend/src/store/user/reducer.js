import {
  CLEAR_USER_ERROR,
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

const initialState = {
  user: null,
  findUser: null,
  searchUsers: [],
  isLoading: false,
  error: null,
};

export const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SIGN_UP_REQUEST:
    case SIGN_IN_REQUEST:
    case FIND_USER_REQUEST:
    case FIND_USER_BY_ID_REQUEST:
    case SEARCH_USER_REQUEST:
    case FOLLOW_USER_REQUEST:
    case UPDATE_USER_REQUEST:
      return { ...state, isLoading: true, error: null };
    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
      return { ...state, isLoading: false, error: null };
    case FIND_USER_SUCCESS:
      return { ...state, isLoading: false, error: null, user: payload };
    case FIND_USER_BY_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        findUser: payload,
      };
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        searchUsers: payload,
      };
    case FOLLOW_USER_SUCCESS:
      const isFollowed = !state.findUser.followed;
      let updatedFollowers;
      if (isFollowed) {
        updatedFollowers = [...state.findUser.followers, payload];
      } else {
        updatedFollowers = state.findUser.followers.filter(
          (follower) => follower.id !== payload.id,
        );
      }
      return {
        ...state,
        isLoading: false,
        error: null,
        user: payload,
        findUser: {
          ...state.findUser,
          followed: isFollowed,
          followers: updatedFollowers,
        },
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        user: payload,
      };
    case SIGN_UP_FAILURE:
    case SIGN_IN_FAILURE:
    case FIND_USER_FAILURE:
    case FIND_USER_BY_ID_FAILURE:
    case SEARCH_USER_FAILURE:
    case FOLLOW_USER_FAILURE:
    case UPDATE_USER_FAILURE:
      return { ...state, isLoading: false, error: payload };
    case CLEAR_USER_ERROR:
      return { ...state, error: null };
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        isLoading: false,
        error: null,
        findUser: null,
        searchUsers: null,
      };
    default:
      return state;
  }
};
