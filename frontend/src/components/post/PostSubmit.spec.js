import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import PostSubmit from "./PostSubmit";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import authReducer from "../../redux/authReducer";
import * as apiCalls from "../../api/apiCalls";

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
      <PostSubmit />
    </Provider>
  );
};

describe("PostSubmit", () => {
  describe("Layout", () => {
    test("has textarea", () => {
      setup();
      const textArea = screen.queryByLabelText("text-area");
      expect(textArea).toBeInTheDocument();
    });
    test("has image", () => {
      setup();
      const image = screen.queryByRole("img");
      expect(image).toBeInTheDocument();
    });
    test("has textarea 1", () => {
      setup();
      const textArea = screen.queryByLabelText("text-area");
      expect(textArea.rows).toBe(1);
    });
    test("displays user image", () => {
      setup();
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/images/profile/" + defaultState.image);
    });
  });
  describe("Interactions", () => {
    let textArea;
    const setupFocused = () => {
      const view = setup();
      textArea = screen.queryByLabelText("text-area");
      fireEvent.focus(textArea);
      return view;
    };

    test("displays 3 rows when focused to textarea", () => {
      setupFocused();
      expect(textArea.rows).toBe(3);
    });
    test("displays post button when focused to textarea", () => {
      setupFocused();
      const postButton = screen.queryByText("Post");
      expect(postButton).toBeInTheDocument();
    });
    test("displays Cancel button when focused to textarea", () => {
      setupFocused();
      const cancelButton = screen.queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });
    test("does not display Post button when not focused to textarea", () => {
      setup();
      const postButton = screen.queryByText("Post");
      expect(postButton).not.toBeInTheDocument();
    });
    test("does not display Cancel button when not focused to textarea", () => {
      setup();
      const cancelButton = screen.queryByText("Cancel");
      expect(cancelButton).not.toBeInTheDocument();
    });
    test("returns back to unfocused state after clicking the cancel", () => {
      setupFocused();
      const cancelButton = screen.queryByText("Cancel");
      fireEvent.click(cancelButton);
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });
    test("calls postPost with post request object when clicking Post", () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      expect(apiCalls.postPost).toHaveBeenCalledWith({
        content: "Test post content",
      });
    });
    test("returns back to unfocused state after successful postPost action", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(screen.queryByText("Post")).not.toBeInTheDocument();
      });
    });
    test("clear content after successful postPost action", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(screen.queryByText("Test post content")).not.toBeInTheDocument();
      });
    });
    test("clears content after clicking cancel", () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      fireEvent.click(screen.queryByText("Cancel"));

      expect(screen.queryByText("Test post content")).not.toBeInTheDocument();
    });
    test("disables Post button when there is postPost api call", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      fireEvent.click(postButton);
      expect(mockFunction).toHaveBeenCalledTimes(1);
    });
    test("disables Cancel button when there is postPost api call", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      const cancelButton = screen.queryByText("Cancel");
      expect(cancelButton).toBeDisabled();
    });
    test("displays spinner when there is postPost api call", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    test("enables Post button when postPost api call fails", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(screen.queryByText("Post")).not.toBeDisabled();
      });
    });
    test("enables Cancel button when postPost api call fails", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(screen.queryByText("Cancel")).not.toBeDisabled();
      });
    });
    test("enables Post button after successful postPost action", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);
      await waitForElementToBeRemoved(postButton);
      fireEvent.focus(textArea);
      await waitFor(() => {
        expect(screen.queryByText("Post")).not.toBeDisabled();
      });
    });
    test("displays validation error for content", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      await waitFor(() => {
        expect(
          screen.getByText(
            "It must have minimum 10 and maximum 5000 characters"
          )
        ).toBeInTheDocument();
      });
    });
    test("clears validation error after clicking cancel", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);

      const error = await screen.findByText(
        "It must have minimum 10 and maximum 5000 characters"
      );

      fireEvent.click(screen.queryByText("Cancel"));

      expect(error).not.toBeInTheDocument();
    });
    test("clears validation error after content is changed", async () => {
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const postButton = screen.queryByText("Post");

      const mockFunction = jest.fn().mockRejectedValueOnce({
        response: {
          data: {
            validationErrors: {
              content: "It must have minimum 10 and maximum 5000 characters",
            },
          },
        },
      });

      apiCalls.postPost = mockFunction;
      fireEvent.click(postButton);
      const error = await screen.findByText(
        "It must have minimum 10 and maximum 5000 characters"
      );

      fireEvent.change(textArea, {
        target: { value: "Test post content updated" },
      });

      expect(error).not.toBeInTheDocument();
    });
    test("displays file attachment input when text area focused", () => {
      setup();
      const textArea = screen.queryByLabelText("text-area");
      fireEvent.focus(textArea);

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");
    });
    test("displays image component when file selected", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      setup();
      const textArea = screen.queryByLabelText("text-area");
      fireEvent.focus(textArea);

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        const attachmentImage = images[1];
        expect(attachmentImage.src).toContain("data:image/png;base64");
      });
    });
    test("removes selected image after clicking cancel", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      setupFocused();

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });

      fireEvent.click(screen.queryByText("Cancel"));
      fireEvent.focus(textArea);

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(1);
      });
    });
    test("calls postPostFile when file selected", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });

      setupFocused();

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });
      expect(apiCalls.postPostFile).toHaveBeenCalledTimes(1);
    });
    test("calls postPostFile with selected file", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });

      setupFocused();

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });

      const body = apiCalls.postPostFile.mock.calls[0][0];

      const readFile = () => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result);
          };
          reader.readAsText(body.get("file"));
        });
      };

      const result = await readFile();

      expect(result).toBe("dummy content");
    });
    test("calls postPost with post with file attachment object when clicking Post", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      expect(apiCalls.postPost).toHaveBeenCalledWith({
        content: "Test post content",
        attachment: {
          id: 1,
          name: "random-name.png",
        },
      });
    });
    test("clears image after postPost success", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.click(postButton);

      fireEvent.focus(textArea);
      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(1);
      });
    });
    test("calls postPost without file attachment after cancelling previous file selection", async () => {
      apiCalls.postPostFile = jest.fn().mockResolvedValue({
        data: {
          id: 1,
          name: "random-name.png",
        },
      });
      setupFocused();
      fireEvent.change(textArea, { target: { value: "Test post content" } });

      const uploadInput = screen.queryByLabelText("file");
      expect(uploadInput.type).toBe("file");

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });
      fireEvent.change(uploadInput, { target: { files: [file] } });

      await waitFor(() => {
        const images = screen.queryAllByRole("img");
        expect(images.length).toBe(2);
      });
      fireEvent.click(screen.queryByText("Cancel"));
      fireEvent.focus(textArea);

      const postButton = screen.queryByText("Post");

      apiCalls.postPost = jest.fn().mockResolvedValue({});
      fireEvent.change(textArea, { target: { value: "Test post content" } });
      fireEvent.click(postButton);

      expect(apiCalls.postPost).toHaveBeenCalledWith({
        content: "Test post content",
      });
    });
  });
});

console.error = () => {};
