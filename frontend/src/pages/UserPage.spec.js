import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import UserPage from "./UserPage";
import * as apiCalls from "../api/apiCalls";
import axios from "axios";
import { Provider } from "react-redux";
import configureStore from "../redux/configureStore";

apiCalls.loadPosts = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

const mockSuccessGetUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const mockSuccessUpdateUser = {
  data: {
    id: 1,
    username: "user1",
    displayName: "display1-update",
    image: "profile1-update.png",
  },
};
const mockFailGetUser = {
  response: {
    data: {
      message: "User not found",
    },
  },
};

const mockFailUpdateUser = {
  response: {
    data: {
      validationErrors: {
        displayName: "It must have minimum 4 and maximum 255 characters",
        image: "Only PNG and JPG files are allowed",
      },
    },
  },
};

const match = {
  params: {
    username: "user1",
  },
};

let store;
const setup = (props) => {
  store = configureStore(false);
  return render(
    <Provider store={store}>
      <UserPage {...props} />
    </Provider>
  );
};
beforeEach(() => {
  localStorage.clear();
  delete axios.defaults.headers.common["Authorization"];
});
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

describe("UserPage", () => {
  describe("Layout", () => {
    test("has root page div", () => {
      setup();
      const userPageDiv = screen.queryByTestId("userpage");
      expect(userPageDiv).toBeInTheDocument();
    });
    test("displays the displayName@username when user data loaded", async () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      const text = await screen.findByText("display1@user1");
      expect(text).toBeInTheDocument();
    });
    test("displays not found alert when user not found", async () => {
      apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
      setup({ match });
      const alert = await screen.findByText("User not found");
      expect(alert).toBeInTheDocument();
    });
    test("displays spinner while loading user data", () => {
      const mockDelayedResponse = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetUser);
          }, 300);
        });
      });
      apiCalls.getUser = mockDelayedResponse;
      setup({ match });
      const spinners = screen.queryAllByText("Loading...");
      expect(spinners.length).not.toBe(0);
    });
    test("displays the edit button when loggedInUser matches to user in url", async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      await screen.findByText("display1@user1");
      const editButton = screen.queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
  });
  describe("Lifecycle", () => {
    test("calls getUser when it is rendered", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
    });
    test("calls getUser for user1 when it is rendered with user1 in match", () => {
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      setup({ match });
      expect(apiCalls.getUser).toHaveBeenCalledWith("user1");
    });
  });
  describe("ProfileCard Interactions", () => {
    const setupForEdit = async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const view = setup({ match });
      // eslint-disable-next-line testing-library/prefer-screen-queries
      const editButton = await view.findByText("Edit");
      fireEvent.click(editButton);
      return view;
    };

    const mockDelayedUpdateSuccess = () => {
      return jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessUpdateUser);
          }, 300);
        });
      });
    };
    test("displays edit layout when clicking edit button", async () => {
      await setupForEdit();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
    test("returns back to none edit mode after clicking cancel", async () => {
      await setupForEdit();
      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(screen.getByText("Edit")).toBeInTheDocument();
    });
    test("calls updateUser api when clicking save", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
    });
    test("calls updateUser api with user id", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const userId = apiCalls.updateUser.mock.calls[0][0];

      expect(userId).toBe(1);
    });
    test("calls updateUser api with request body having changed displayName", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
      const displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const requestBody = apiCalls.updateUser.mock.calls[0][1];
      expect(requestBody.displayName).toBe("display1-update");
    });
    test("returns to non edit mode after successful updateUser api call", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const editButtonAfterClickingSave = await screen.findByText("Edit");

      expect(editButtonAfterClickingSave).toBeInTheDocument();
    });
    test("returns to original displayName after its changed in edit mode but cancelled", async () => {
      await setupForEdit();
      const displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });

      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);

      const originalDisplayText = screen.queryByText("display1@user1");
      expect(originalDisplayText).toBeInTheDocument();
    });
    test("returns to last updated displayName when display name is changed for another time but cancelled", async () => {
      await setupForEdit();
      let displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await screen.findByText("Edit");
      fireEvent.click(editButtonAfterClickingSave);

      displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, {
        target: { value: "display1-update-second-time" },
      });
      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);

      const lastSavedData = screen.queryByRole("heading", { level: 4 });

      expect(lastSavedData).toHaveTextContent("display1-update@user1");
    });
    test("displays spinner when there is updateUser api call", async () => {
      await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();
      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const spinner = screen.queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    test("disables save button when there is updateUser api call", async () => {
      await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
    });

    test("disables cancel button when there is updateUser api call", async () => {
      await setupForEdit();
      apiCalls.updateUser = mockDelayedUpdateSuccess();

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const cancelButton = screen.queryByText("Cancel");

      expect(cancelButton).toBeDisabled();
    });
    test("enables save button after updateUser api call success", async () => {
      await setupForEdit();
      let displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await screen.findByText("Edit");

      fireEvent.click(editButtonAfterClickingSave);

      const saveButtonAfterSecondEdit = screen.queryByText("Save");

      expect(saveButtonAfterSecondEdit).not.toBeDisabled();
    });
    test("enables save button after updateUser api call fails", async () => {
      await setupForEdit();
      let displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });
    });
    test("displays the selected image in edit mode", async () => {
      await setupForEdit();

      const uploadInput = screen.queryByLabelText("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const image = screen.queryByRole("img");
        expect(image.src).toContain("data:image/png;base64");
      });
    });
    test("returns back to the original image even the new image is added to upload box but cancelled", async () => {
      await setupForEdit();

      const input = screen.queryByLabelText("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(input, { target: { files: [file] } });

      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);

      await waitFor(() => {
        const image = screen.queryByRole("img");
        expect(image.src).toContain("/images/profile/profile1.png");
      });
    });

    test("does not throw error after file not selected", async () => {
      await setupForEdit();
      const input = screen.queryByLabelText("file");
      expect(() =>
        fireEvent.change(input, { target: { files: [] } })
      ).not.toThrow();
    });

    test("calls updateUser api with request body having new image without data:image/png;base64", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const input = screen.queryByLabelText("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const image = screen.queryByRole("img");
        expect(image.src).toContain("data:image/png;base64");
      });
      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const requestBody = apiCalls.updateUser.mock.calls[0][1];

      expect(requestBody.image).not.toContain("data:image/png;base64");
    });

    test("returns to last updated image when image is change for another time but cancelled", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const input = screen.queryByLabelText("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      fireEvent.change(input, { target: { files: [file] } });

      await waitFor(() => {
        const image = screen.queryByRole("img");
        expect(image.src).toContain("data:image/png;base64");
      });
      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const editButtonAfterClickingSave = await screen.findByText("Edit");
      fireEvent.click(editButtonAfterClickingSave);

      const newFile = new File(["another content"], "example2.png", {
        type: "image/png",
      });

      fireEvent.change(input, { target: { files: [newFile] } });

      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/images/profile/profile1-update.png");
    });
    test("displays validation error for displayName when update api fails", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const errorMessage = await screen.findByText(
        "It must have minimum 4 and maximum 255 characters"
      );
      expect(errorMessage).toBeInTheDocument();
    });
    test("shows validation error for file when update api fails", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);

      const errorMessage = await screen.findByText(
        "Only PNG and JPG files are allowed"
      );
      expect(errorMessage).toBeInTheDocument();
    });
    test("removes validation error for displayName when user changes the displayName", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const errorMessage = await screen.findByText(
        "It must have minimum 4 and maximum 255 characters"
      );

      const displayInput = screen.queryAllByRole("textbox")[0];
      fireEvent.change(displayInput, { target: { value: "new-display-name" } });

      expect(errorMessage).not.toBeInTheDocument();
    });

    test("removes validation error for file when user changes the file", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      const errorMessage = await screen.findByText(
        "Only PNG and JPG files are allowed"
      );

      const fileInput = screen.queryByLabelText("file");

      const newFile = new File(["another content"], "example2.png", {
        type: "image/png",
      });

      fireEvent.change(fileInput, { target: { files: [newFile] } });

      await waitFor(() => {
        expect(errorMessage).not.toBeInTheDocument();
      });
    });
    test("removes validation error if user cancels", async () => {
      await setupForEdit();
      apiCalls.updateUser = jest.fn().mockRejectedValue(mockFailUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
      fireEvent.click(screen.queryByText("Cancel"));

      fireEvent.click(screen.queryByText("Edit"));
      const errorMessage = screen.queryByText(
        "It must have minimum 4 and maximum 255 characters"
      );
      expect(errorMessage).not.toBeInTheDocument();
    });
    test("updates redux state after updateUser api call success", async () => {
      await setupForEdit();
      let displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      await waitForElementToBeRemoved(saveButton);
      const storedUserData = store.getState();
      expect(storedUserData.displayName).toBe(
        mockSuccessUpdateUser.data.displayName
      );
      expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image);
    });
    test("updates localStorage after updateUser api call success", async () => {
      await setupForEdit();
      let displayInput = screen.queryByRole("textbox");
      fireEvent.change(displayInput, { target: { value: "display1-update" } });
      apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
      const saveButton = screen.queryByRole("button", { name: "Save" });
      fireEvent.click(saveButton);
      await waitForElementToBeRemoved(saveButton);
      const storedUserData = JSON.parse(
        localStorage.getItem("social-media-auth")
      );
      expect(storedUserData.displayName).toBe(
        mockSuccessUpdateUser.data.displayName
      );
      expect(storedUserData.image).toBe(mockSuccessUpdateUser.data.image);
    });
  });
});
