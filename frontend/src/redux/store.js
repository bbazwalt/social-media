import { configureStore } from "@reduxjs/toolkit";
import { postReducer } from "./post/reducer";
import { userReducer } from "./user/reducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
  },
});

export { store };
