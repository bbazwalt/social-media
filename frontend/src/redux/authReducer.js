const initialState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  password: "",
  isLoggedIn: false,
};

const authReducer = (state = initialState, { type, payload }) => {
  if (type === "LOGOUT_SUCCESS") {
    return { ...initialState };
  } else if (type === "LOGIN_SUCCESS") {
    return {
      ...payload,
      isLoggedIn: true,
    };
  } else if (type === "UPDATE_SUCCESS") {
    return {
      ...state,
      displayName: payload.displayName,
      image: payload.image,
    };
  }
  return state;
};

export default authReducer;
