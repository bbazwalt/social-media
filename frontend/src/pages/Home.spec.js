import { render, screen } from "@testing-library/react";
import React from "react";
import Home from "./Home";
import * as apiCalls from "../api/apiCalls";
import { legacy_createStore } from "redux";
import { Provider } from "react-redux";
import authReducer from "../redux/authReducer";

const defaultState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

let store;

const setup = (state = defaultState) => {
  store = legacy_createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});
apiCalls.loadPosts = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

describe("HomePage", () => {
  describe("Layout", () => {
    test("has root page div", () => {
      setup();
      const homePageDiv = screen.queryByTestId("homepage");
      expect(homePageDiv).toBeInTheDocument();
    });
    test("displays post submit when user logged in", () => {
      setup();
      const textArea = screen.queryByLabelText("text-area");
      expect(textArea).toBeInTheDocument();
    });
    test("does not display psot submit when user not logged in", () => {
      const notLoggedInState = {
        id: 0,
        username: "",
        displayName: "",
        password: "",
        image: "",
        isLoggedIn: false,
      };
      setup(notLoggedInState);
      const textArea = screen.queryByLabelText("text-area");
      expect(textArea).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
