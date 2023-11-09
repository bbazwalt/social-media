export const userReducer = (state, { type, payload }) => {
  if (type === "LOADING_USER") {
    return {
      ...state,
      isLoadingUser: true,
      userNotFound: false,
    };
  } else if (type === "LOAD_USER_SUCCESS") {
    return {
      ...state,
      isLoadingUser: false,
      user: payload,
    };
  } else if (type === "LOAD_USER_FAILURE") {
    return {
      ...state,
      isLoadingUser: false,
      userNotFound: true,
    };
  } else if (type === "CANCEL") {
    let displayName = state.user.displayName;
    if (state.originalDisplayName) {
      displayName = state.originalDisplayName;
    }
    return {
      ...state,
      inEditMode: false,
      image: undefined,
      errors: {},
      user: {
        ...state.user,
        displayName,
      },
      originalDisplayName: undefined,
    };
  } else if (type === "UPDATE_PROGRESS") {
    return {
      ...state,
      pendingUpdateCall: true,
    };
  } else if (type === "UPDATE_SUCCESS") {
    return {
      ...state,
      inEditMode: false,
      originalDisplayName: undefined,
      image: undefined,
      pendingUpdateCall: false,
      user: {
        ...state.user,
        image: payload,
      },
    };
  } else if (type === "UPDATE_FAILURE") {
    return {
      ...state,
      pendingUpdateCall: false,
      errors: payload,
    };
  } else if (type === "UPDATE_DISPLAYNAME") {
    let originalDisplayName = state.originalDisplayName;
    if (!originalDisplayName) {
      originalDisplayName = state.user.displayName;
    }
    const errors = state.errors;
    errors.displayName = undefined;
    return {
      ...state,
      errors,
      originalDisplayName,
      user: {
        ...state.user,
        displayName: payload,
      },
    };
  } else if (type === "SELECT_FILE") {
    const errors = state.errors;
    errors.image = undefined;
    return {
      ...state,
      errors,
      image: payload,
    };
  } else if (type === "EDIT_MODE") {
    return {
      ...state,
      inEditMode: true,
    };
  }
  return state;
};
