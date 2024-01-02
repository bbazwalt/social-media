import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "../redux/configureStore";
import LoginPage from "./LoginPage";

const mockedNavigator = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

const setup = () => {
  const store = configureStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </Provider>
  );
};

describe("LoginPage", () => {
  describe("Layout", () => {
    test("has header of Login", () => {
      setup();
      const header = screen.queryByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Login");
    });

    test("has input for username", () => {
      setup();
      const usernameInput = screen.queryByPlaceholderText(
        "Enter your username"
      );
      expect(usernameInput).toBeInTheDocument();
    });

    test("has input for password", () => {
      setup();
      const passwordInput = screen.queryByPlaceholderText(
        "Enter your password"
      );
      expect(passwordInput).toBeInTheDocument();
    });

    test("has password type for password input", () => {
      setup();
      const passwordInput = screen.queryByPlaceholderText(
        "Enter your password"
      );
      expect(passwordInput.type).toBe("password");
    });
    test("has login button", () => {
      setup();
      const button = screen.queryByRole("button");
      expect(button).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    const changeEvent = (content) => {
      return {
        target: {
          value: content,
        },
      };
    };
    const mockAsyncDelayed = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
    };
    let usernameInput, passwordInput, button;

    const setupForSubmit = (props) => {
      const store = configureStore();
      const view = render(
        <Provider store={store}>
          <MemoryRouter>
            <LoginPage {...props} />
          </MemoryRouter>
        </Provider>
      );
      usernameInput = screen.queryByPlaceholderText("Enter your username");
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      passwordInput = screen.queryByPlaceholderText("Enter your password");
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      button = screen.queryByRole("button");
      return view;
    };

    test("sets the username value into state", () => {
      setup();
      const usernameInput = screen.queryByPlaceholderText(
        "Enter your username"
      );
      fireEvent.change(usernameInput, changeEvent("my-user-name"));
      expect(usernameInput).toHaveValue("my-user-name");
    });
    test("sets the password value into state", () => {
      setup();
      const passwordInput = screen.queryByPlaceholderText(
        "Enter your password"
      );
      fireEvent.change(passwordInput, changeEvent("P4ssword"));
      expect(passwordInput).toHaveValue("P4ssword");
    });
    test("does not throw exception when clicking the button when actions not provided in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    test("enables the button when username and password is not empty", () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });
    test("disables the button when username is empty", () => {
      setupForSubmit();
      fireEvent.change(usernameInput, changeEvent(""));
      expect(button).toBeDisabled();
    });
    test("disables the button when password is empty", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent(""));
      expect(button).toBeDisabled();
    });
    test("clears alert when user changes username", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      const alert = screen.queryByText("Login failed");
      fireEvent.change(usernameInput, changeEvent("updated-username"));
      expect(alert).not.toBeInTheDocument();
    });
    test("clears alert when user changes password", async () => {
      const actions = {
        postLogin: jest.fn().mockRejectedValue({
          response: {
            data: {
              message: "Login failed",
            },
          },
        }),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);

      const alert = screen.queryByText("Login failed");
      fireEvent.change(passwordInput, changeEvent("updated-P4ssword"));

      expect(alert).not.toBeInTheDocument();
    });

    test("displays spinner when there is an ongoing api call", () => {
      const actions = {
        postLogin: mockAsyncDelayed(),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = screen.queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
  });
});

console.error = () => {};
