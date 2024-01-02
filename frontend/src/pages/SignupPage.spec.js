import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "../redux/configureStore";
import SignupPage from "./SignupPage";

const setup = () => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <SignupPage />
    </Provider>
  );
};

const mockedNavigator = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigator,
}));

describe("Signup", () => {
  describe("Layout", () => {
    test("has header of Signup", () => {
      setup();
      const header = screen.queryByRole("heading", { level: 1 });
      expect(header).toHaveTextContent("Sign Up");
    });
    test("has input for display name", () => {
      setup();
      const displayNameInput = screen.queryByPlaceholderText(
        "Enter your display name"
      );
      expect(displayNameInput).toBeInTheDocument();
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
    test("has input for password repeat", () => {
      setup();
      const passwordRepeat = screen.queryByPlaceholderText(
        "Enter your password again"
      );
      expect(passwordRepeat).toBeInTheDocument();
    });
    test("has password type for password repeat input", () => {
      setup();
      const passwordRepeat = screen.queryByPlaceholderText(
        "Enter your password again"
      );
      expect(passwordRepeat.type).toBe("password");
    });
    test("has submit button", () => {
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

    let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;

    const setupForSubmit = (props) => {
      const store = configureStore(false);
      const view = render(
        <Provider store={store}>
          <SignupPage {...props} />
        </Provider>
      );

      displayNameInput = screen.queryByPlaceholderText(
        "Enter your display name"
      );
      usernameInput = screen.queryByPlaceholderText("Enter your username");
      passwordInput = screen.queryByPlaceholderText("Enter your password");
      passwordRepeat = screen.queryByPlaceholderText(
        "Enter your password again"
      );
      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      fireEvent.change(usernameInput, changeEvent("my-username"));
      fireEvent.change(passwordInput, changeEvent("my-password"));
      fireEvent.change(passwordRepeat, changeEvent("my-password"));
      button = screen.getByRole("button");
      return view;
    };

    test("sets the displayName value into state", () => {
      setup();
      const displayNameInput = screen.queryByPlaceholderText(
        "Enter your display name"
      );
      fireEvent.change(displayNameInput, changeEvent("my-display-name"));
      expect(displayNameInput).toHaveValue("my-display-name");
    });

    test("sets the username value into state", () => {
      setup();
      const usernameInput = screen.queryByPlaceholderText(
        "Enter your username"
      );
      fireEvent.change(usernameInput, changeEvent("my-username"));
      expect(usernameInput).toHaveValue("my-username");
    });

    test("sets the password value into state", () => {
      setup();
      const passwordInput = screen.queryByPlaceholderText(
        "Enter your password"
      );
      fireEvent.change(passwordInput, changeEvent("my-password"));
      expect(passwordInput).toHaveValue("my-password");
    });

    test("sets the password repeat value into state", () => {
      setup();
      const passwordRepeat = screen.queryByPlaceholderText(
        "Enter your password again"
      );
      fireEvent.change(passwordRepeat, changeEvent("my-password"));
      expect(passwordRepeat).toHaveValue("my-password");
    });

    test("does not throw exception when clicking the button when actions not provided in props", () => {
      setupForSubmit();
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    test("displays spinner when there is an ongoing api call", () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };

      setupForSubmit({ actions });
      fireEvent.click(button);
      const spinner = screen.queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });

    test("hides spinner after api call finishes successfully", async () => {
      const actions = {
        postSignup: mockAsyncDelayed(),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      const spinner = screen.queryByText("Loading...");
      await waitForElementToBeRemoved(spinner);
      expect(spinner).not.toBeInTheDocument();
    });

    test("hides spinner after api call finishes with error", async () => {
      const actions = {
        postSignup: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} },
              });
            }, 300);
          });
        }),
      };
      setupForSubmit({ actions });
      fireEvent.click(button);
      const spinner = screen.queryByText("Loading...");
      await waitForElementToBeRemoved(spinner);
      expect(spinner).not.toBeInTheDocument();
    });

    test("enables the signup button when password and repeat password have same value", () => {
      setupForSubmit();
      expect(button).not.toBeDisabled();
    });

    test("disables the signup button when password repeat does not match to password", () => {
      setupForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    test("disables the signup button when password does not match to password repeat", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      expect(button).toBeDisabled();
    });

    test("displays error style for password repeat input when password repeat mismatch", () => {
      setupForSubmit();
      fireEvent.change(passwordRepeat, changeEvent("new-pass"));
      const mismatchWarning = screen.getByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });

    test("displays error style for password repeat input when password input mismatch", () => {
      setupForSubmit();
      fireEvent.change(passwordInput, changeEvent("new-pass"));
      const mismatchWarning = screen.getByText("Does not match to password");
      expect(mismatchWarning).toBeInTheDocument();
    });
  });
});

console.error = () => {};
