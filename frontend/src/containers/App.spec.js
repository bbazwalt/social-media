import React from "react";
import App from "./App";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import axios from "axios";
import configureStore from "../redux/configureStore";
import * as apiCalls from "../api/apiCalls";

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

apiCalls.getUser = jest.fn().mockResolvedValue({
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
});

apiCalls.loadPosts = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

const mockSuccessGetUser1 = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};
const mockSuccessGetUser2 = {
  data: {
    id: 2,
    username: "user2",
    displayName: "display2",
    image: "profile2.png",
  },
};

const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});

const setup = (path) => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    </Provider>
  );
};

const changeEvent = (content) => {
  return {
    target: {
      value: content,
    },
  };
};

const setUserOneLoggedInStorage = () => {
  localStorage.setItem(
    "social-media-auth",
    JSON.stringify({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    })
  );
};

describe("App", () => {
  test("displays homepage when url is /", () => {
    setup("/");
    const homePageDiv = screen.queryByTestId("homepage");
    expect(homePageDiv).toBeInTheDocument();
  });
  test("displays LoginPage when url is /login", () => {
    setup("/login");
    const header = screen.queryByRole("heading", { level: 1 });
    expect(header).toHaveTextContent("Login");
  });
  test("displays only LoginPage when url is /login", () => {
    const homePageDiv = screen.queryByTestId("homepage");
    expect(homePageDiv).not.toBeInTheDocument();
  });
  test("displays SignupPage when url is /signup", () => {
    setup("/signup");
    const header = screen.queryByRole("heading", { level: 1 });
    expect(header).toHaveTextContent("Sign Up");
  });
  test("displays userpage when url is other than /, /login or /signup", () => {
    setup("/user1");
    const userPageDiv = screen.queryByTestId("userpage");
    expect(userPageDiv).toBeInTheDocument();
  });
  test("displays topBar when url is /", () => {
    setup("/");
    const navigation = screen.queryByLabelText("nav");
    expect(navigation).toBeInTheDocument();
  });
  test("displays topBar when url is /login", () => {
    setup("/login");
    const navigation = screen.queryByLabelText("nav");
    expect(navigation).toBeInTheDocument();
  });
  test("displays topBar when url is /signup", () => {
    setup("/signup");
    const navigation = screen.queryByLabelText("nav");
    expect(navigation).toBeInTheDocument();
  });
  test("displays topBar when url is /user1", () => {
    setup("/user1");
    const navigation = screen.getByLabelText("nav");
    expect(navigation).toBeInTheDocument();
  });

  test("shows the SignupPage when clicking signup", () => {
    setup("/");
    const signupLink = screen.queryByText("Sign Up");
    fireEvent.click(signupLink);
    const header = screen.queryByRole("heading", { level: 1 });
    expect(header).toHaveTextContent("Sign Up");
  });
  test("shows the LoginPage when clicking login", () => {
    setup("/");
    const loginLink = screen.queryByText("Login");
    fireEvent.click(loginLink);
    const header = screen.queryByRole("heading", { level: 1 });
    expect(header).toHaveTextContent("Login");
  });

  test("shows the HomePage when clicking the logo", () => {
    setup("/login");
    const logo = screen.queryByRole("img");
    fireEvent.click(logo);
    const homePageDiv = screen.queryByTestId("homepage");
    expect(homePageDiv).toBeInTheDocument();
  });
  test("displays My Profile on TopBar after login success", async () => {
    setup("/login");
    const usernameInput = screen.queryByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = screen.queryByPlaceholderText("Enter your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = screen.queryByRole("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);
    const myProfileLink = await screen.findByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });
  test("displays My Profile on TopBar after signup success", async () => {
    setup("/signup");
    const displayNameInput = screen.queryByPlaceholderText(
      "Enter your display name"
    );
    const usernameInput = screen.queryByPlaceholderText("Enter your username");
    const passwordInput = screen.queryByPlaceholderText("Enter your password");
    const passwordRepeat = screen.queryByPlaceholderText(
      "Enter your password again"
    );

    fireEvent.change(displayNameInput, changeEvent("display1"));
    fireEvent.change(usernameInput, changeEvent("user1"));
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    fireEvent.change(passwordRepeat, changeEvent("P4ssword"));

    const button = screen.queryByRole("button");
    axios.post = jest
      .fn()
      .mockResolvedValueOnce({
        data: {
          message: "User saved",
        },
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      });

    fireEvent.click(button);

    const myProfileLink = await screen.findByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });
  test("saves logged in user data to localStorage after login success", async () => {
    setup("/login");
    const usernameInput = screen.queryByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = screen.queryByPlaceholderText("Enter your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = screen.queryByRole("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);
    await screen.findByText("My Profile");
    const dataInStorage = JSON.parse(localStorage.getItem("social-media-auth"));
    expect(dataInStorage).toEqual({
      id: 1,
      username: "user1",
      displayName: "display1",
      image: "profile1.png",
      password: "P4ssword",
      isLoggedIn: true,
    });
  });
  test("displays logged in topBar when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    setup("/");
    const myProfileLink = screen.queryByText("My Profile");
    expect(myProfileLink).toBeInTheDocument();
  });
  test("sets axios authorization with base64 encoded user credentials after login success", async () => {
    setup("/login");
    const usernameInput = screen.queryByPlaceholderText("Enter your username");
    fireEvent.change(usernameInput, changeEvent("user1"));
    const passwordInput = screen.queryByPlaceholderText("Enter your password");
    fireEvent.change(passwordInput, changeEvent("P4ssword"));
    const button = screen.queryByRole("button");
    axios.post = jest.fn().mockResolvedValue({
      data: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    });
    fireEvent.click(button);

    await screen.findByText("My Profile");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];

    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });
  test("sets axios authorization with base64 encoded user credentials when storage has logged in user data", () => {
    setUserOneLoggedInStorage();
    setup("/");
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    const encoded = btoa("user1:P4ssword");
    const expectedAuthorization = `Basic ${encoded}`;
    expect(axiosAuthorization).toBe(expectedAuthorization);
  });
  test("removes axios authorization header when user logout", async () => {
    setUserOneLoggedInStorage();
    setup("/");
    const logout = screen.queryByText("Logout");
    fireEvent.click(logout);
    const axiosAuthorization = axios.defaults.headers.common["Authorization"];
    expect(axiosAuthorization).toBeFalsy();
  });
  test("updates user page after clicking my profile when another user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockResolvedValueOnce(mockSuccessGetUser2)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();
    setup("/user2");

    await screen.findByText("display2@user2");

    const myProfileLink = screen.queryByText("My Profile");
    fireEvent.click(myProfileLink);
    const user1Info = await screen.findByText("display1@user1");
    expect(user1Info).toBeInTheDocument();
  });
  test("updates user page after clicking my profile when another non existing user page was opened", async () => {
    apiCalls.getUser = jest
      .fn()
      .mockRejectedValueOnce(mockFailGetUser)
      .mockResolvedValueOnce(mockSuccessGetUser1);

    setUserOneLoggedInStorage();
    setup("/user50");
    await screen.findByText("User not found");
    const myProfileLink = screen.queryByText("My Profile");
    fireEvent.click(myProfileLink);
    const user1Info = await screen.findByText("display1@user1");
    expect(user1Info).toBeInTheDocument();
  });
});

console.error = () => {};
