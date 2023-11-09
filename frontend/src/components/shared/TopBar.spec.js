import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TopBar from "./TopBar";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../../redux/authReducer";
import { legacy_createStore } from "redux";
import * as authActions from "../../redux/authActions";
import { Provider } from "react-redux";

const loggedInState = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const defaultState = {
  id: 0,
  username: "",
  displayName: "",
  image: "",
  password: "",
  isLoggedIn: false,
};

let store;

const setup = (state = defaultState) => {
  store = legacy_createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <TopBar />
      </MemoryRouter>
    </Provider>
  );
};

describe("TopBar", () => {
  describe("Layout", () => {
    test("has application logo", () => {
      setup();
      const image = screen.queryByRole("img");
      expect(image.src).toContain("social-media-logo.png");
    });

    test("has link to home from logo", () => {
      setup();
      const image = screen.queryByRole("img");
      // eslint-disable-next-line testing-library/no-node-access
      expect(image.parentElement.getAttribute("href")).toBe("/");
    });

    test("has link to signup", () => {
      setup();
      const signupLink = screen.queryByText("Sign Up");
      expect(signupLink.getAttribute("href")).toBe("/signup");
    });
    test("has link to login", () => {
      setup();
      const loginLink = screen.queryByText("Login");
      expect(loginLink.getAttribute("href")).toBe("/login");
    });
    test("has link to logout when user logged in", () => {
      setup(loggedInState);
      const logoutLink = screen.queryByText("Logout");
      expect(logoutLink).toBeInTheDocument();
    });
    test("has link to user profile when user logged in", () => {
      setup(loggedInState);
      const profileLink = screen.queryByText("My Profile");
      expect(profileLink.getAttribute("href")).toBe("/user1");
    });
    test("displays the displayName when user logged in", () => {
      setup(loggedInState);
      const displayName = screen.queryByText("display1");
      expect(displayName).toBeInTheDocument();
    });
    test("displays users image when user logged in", () => {
      setup(loggedInState);
      const images = screen.queryAllByRole("img");
      const userImage = images[1];
      expect(userImage.src).toContain("/images/profile/" + loggedInState.image);
    });
  });
  describe("Interactions", () => {
    test("displays the login and signup links when user clicks logout", () => {
      setup(loggedInState);
      const logoutLink = screen.queryByText("Logout");
      fireEvent.click(logoutLink);
      const loginLink = screen.queryByText("Login");
      expect(loginLink).toBeInTheDocument();
    });
    test("adds show class to drop down menu when clicking username", () => {
      setup(loggedInState);
      const displayName = screen.queryByText("display1");
      fireEvent.click(displayName);
      const dropDownMenu = screen.queryByTestId("drop-down-menu");
      expect(dropDownMenu).toHaveClass("show");
    });
    test("removes show class to drop down menu when clicking on app logo", () => {
      setup(loggedInState);
      const displayName = screen.queryByText("display1");
      fireEvent.click(displayName);

      const logo = screen.queryByLabelText("social-media");
      fireEvent.click(logo);

      const dropDownMenu = screen.queryByTestId("drop-down-menu");
      expect(dropDownMenu).not.toHaveClass("show");
    });
    test("removes show class to drop down menu when clicking logout", () => {
      setup(loggedInState);
      const displayName = screen.queryByText("display1");
      fireEvent.click(displayName);
      fireEvent.click(screen.queryByText("Logout"));
      store.dispatch(authActions.loginSuccess(loggedInState));
      const dropDownMenu = screen.queryByTestId("drop-down-menu");
      expect(dropDownMenu).not.toBeInTheDocument();
    });
    test("removes show class to drop down menu when clicking My Profile", () => {
      setup(loggedInState);
      const displayName = screen.queryByText("display1");
      fireEvent.click(displayName);
      fireEvent.click(screen.queryByText("My Profile"));
      const dropDownMenu = screen.queryByTestId("drop-down-menu");
      expect(dropDownMenu).not.toHaveClass("show");
    });
  });
});
