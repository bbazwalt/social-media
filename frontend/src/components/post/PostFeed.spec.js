import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import PostFeed from "./PostFeed";
import * as apiCalls from "../../api/apiCalls";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { legacy_createStore } from "redux";
import authReducer from "../../redux/authReducer";

const loggedInStateUser1 = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const originalSetInterval = window.setInterval;
const originalClearInterval = window.clearInterval;

let timedFunction;

const useFakeIntervals = () => {
  window.setInterval = (callback, interval) => {
    if (!callback.toString().startsWith("function")) {
      timedFunction = callback;
      return 111111;
    }
  };
  window.clearInterval = (id) => {
    if (id === 111111) {
      timedFunction = undefined;
    }
  };
};

const useRealIntervals = () => {
  window.setInterval = originalSetInterval;
  window.clearInterval = originalClearInterval;
};

const runTimer = () => {
  timedFunction && timedFunction();
};

const setup = (props, state = loggedInStateUser1) => {
  const store = legacy_createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PostFeed {...props} />
      </MemoryRouter>
    </Provider>
  );
};

const mockEmptyResponse = {
  data: {
    content: [],
  },
};

const mockSuccessGetNewPostsList = {
  data: [
    {
      id: 21,
      content: "This is the newest post",
      date: 1561294668539,
      user: {
        id: 1,
        username: "user1",
        displayName: "display1",
        image: "profile1.png",
      },
    },
  ],
};

const mockSuccessGetPostsMiddleOfMultiPage = {
  data: {
    content: [
      {
        id: 5,
        content: "This post is in middle page",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: false,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetPostsSinglePage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 1,
  },
};

const mockSuccessGetPostsFirstOfMultiPage = {
  data: {
    content: [
      {
        id: 10,
        content: "This is the latest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
      {
        id: 9,
        content: "This is post 9",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 5,
    totalPages: 2,
  },
};

const mockSuccessGetPostsLastOfMultiPage = {
  data: {
    content: [
      {
        id: 1,
        content: "This is the oldest post",
        date: 1561294668539,
        user: {
          id: 1,
          username: "user1",
          displayName: "display1",
          image: "profile1.png",
        },
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 5,
    totalPages: 2,
  },
};
describe("PostFeed", () => {
  describe("Lifecycle", () => {
    test("calls loadPosts when it is rendered", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      expect(apiCalls.loadPosts).toHaveBeenCalled();
    });
    test("calls loadPosts with user parameter when it is rendered with user property", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup({ user: "user1" });
      expect(apiCalls.loadPosts).toHaveBeenCalledWith("user1");
    });
    test("calls loadPosts without user parameter when it is rendered without user property", () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const parameter = apiCalls.loadPosts.mock.calls[0][0];
      expect(parameter).toBeUndefined();
    });
    test("calls loadNewPostCount with topPost id", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup();
      await screen.findByText("This is the latest post");
      runTimer();
      await screen.findByText("There is 1 new post");
      const firstParam = apiCalls.loadNewPostCount.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    test("calls loadNewPostCount with topPost id and username when rendered with user property", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      await screen.findByText("There is 1 new post");
      expect(apiCalls.loadNewPostCount).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    test("displays new post count as 1 after loadNewPostCount success", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      expect(newPostCount).toBeInTheDocument();
      useRealIntervals();
    });
    test("displays new post count constantly", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      await screen.findByText("There is 1 new post");
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 2 } });
      runTimer();
      const newPostCount = await screen.findByText("There are 2 new posts");
      expect(newPostCount).toBeInTheDocument();
      useRealIntervals();
    });
    test("does not call loadNewPostCount after component is unmounted", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      const { unmount } = setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      await screen.findByText("There is 1 new post");
      unmount();
      expect(apiCalls.loadNewPostCount).toHaveBeenCalledTimes(1);
      useRealIntervals();
    });
    test("displays new post count as 1 after loadNewPostCount success when user does not have posts initially", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup({ user: "user1" });
      await screen.findByText("There are no posts");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      expect(newPostCount).toBeInTheDocument();
      useRealIntervals();
    });
  });
  describe("Layout", () => {
    test("displays no post message when the response has empty page", async () => {
      apiCalls.loadPosts = jest.fn().mockResolvedValue(mockEmptyResponse);
      setup();
      const message = await screen.findByText("There are no posts");
      expect(message).toBeInTheDocument();
    });
    test("does not display no post message when the response has page of post", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsSinglePage);
      setup();
      const message = screen.queryByText("There are no posts");
      await waitFor(() => {
        expect(message).not.toBeInTheDocument();
      });
    });
    test("displays spinner when loading the posts", async () => {
      apiCalls.loadPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetPostsSinglePage);
          }, 300);
        });
      });
      setup();
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
    test("displays post content", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsSinglePage);
      setup();
      const postContent = await screen.findByText("This is the latest post");
      expect(postContent).toBeInTheDocument();
    });
    test("displays Load More when there are next pages", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      setup();
      const loadMore = await screen.findByText("Load More");
      expect(loadMore).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    test("calls loadOldPosts with post id when clicking Load More", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      const firstParam = apiCalls.loadOldPosts.mock.calls[0][0];
      expect(firstParam).toBe(9);
    });
    test("calls loadOldPosts with post id and username when clicking Load More when rendered with user property", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      setup({ user: "user1" });
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      expect(apiCalls.loadOldPosts).toHaveBeenCalledWith(9, "user1");
    });
    test("displays loaded old post when loadOldPosts api call success", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      const oldPost = await screen.findByText("This is the oldest post");
      expect(oldPost).toBeInTheDocument();
    });
    test("hides Load More when loadOldPosts api call returns last page", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      await waitFor(() => {
        expect(loadMore).not.toBeInTheDocument();
      });
    });
    test("calls loadNewPosts with post id when clicking New Post Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup();
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      const firstParam = apiCalls.loadNewPosts.mock.calls[0][0];
      expect(firstParam).toBe(10);
      useRealIntervals();
    });
    test("calls loadNewPosts with post id and username when clicking New Post Count Card", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      expect(apiCalls.loadNewPosts).toHaveBeenCalledWith(10, "user1");
      useRealIntervals();
    });
    test("displays loaded new post when loadNewPosts api call success", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      const newPost = await screen.findByText("This is the newest post");

      expect(newPost).toBeInTheDocument();
      useRealIntervals();
    });
    test("hides new post count when loadNewPosts api call success", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      await screen.findByText("This is the newest post");
      expect(screen.queryByText("There is 1 new post")).not.toBeInTheDocument();
      useRealIntervals();
    });
    test("does not allow loadOldPosts to be called when there is an active api call about it", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsLastOfMultiPage);
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      fireEvent.click(loadMore);

      expect(apiCalls.loadOldPosts).toHaveBeenCalledTimes(1);
    });
    test("replaces Load More with spinner when there is an active api call about it", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetPostsLastOfMultiPage);
          }, 300);
        });
      });
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      const spinner = await screen.findByText("Loading...");
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText("Load More")).not.toBeInTheDocument();
    });
    test("replaces Spinner with Load More after active api call for loadOldPosts finishes with middle page response", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadOldPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetPostsMiddleOfMultiPage);
          }, 300);
        });
      });
      setup();
      const loadMore = await screen.findByText("Load More");
      fireEvent.click(loadMore);
      await screen.findByText("This post is in middle page");
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.getByText("Load More")).toBeInTheDocument();
    });
    test("does not allow loadNewPosts to be called when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest 
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");

      fireEvent.click(newPostCount);
      fireEvent.click(newPostCount);

      expect(apiCalls.loadNewPosts).toHaveBeenCalledTimes(1);
      useRealIntervals();
    });
    test("replaces There is 1 new post with spinner when there is an active api call about it", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(mockSuccessGetNewPostsList);
          }, 300);
        });
      });
      setup();
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      const spinner = await screen.findByText("Loading...");
      expect(spinner).toBeInTheDocument();
      expect(screen.queryByText("There is 1 new post")).not.toBeInTheDocument();
      useRealIntervals();
    });
    test("removes Spinner and There is 1 new post after active api call for loadNewPosts finishes with success", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetNewPostsList);
      setup({ user: "user1" });
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      await screen.findByText("This is the newest post");
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      expect(screen.queryByText("There is 1 new post")).not.toBeInTheDocument();
      useRealIntervals();
    });
    test("replaces Spinner with There is 1 new post after active api call for loadNewPosts fails", async () => {
      useFakeIntervals();
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      apiCalls.loadNewPosts = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject({ response: { data: {} } });
          }, 300);
        });
      });
      setup();
      await screen.findByText("This is the latest post");
      runTimer();
      const newPostCount = await screen.findByText("There is 1 new post");
      fireEvent.click(newPostCount);
      await screen.findByText("Loading...");
      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
        expect(screen.getByText("There is 1 new post")).toBeInTheDocument();
      });
      useRealIntervals();
    });
    test("displays modal when clicking delete on post", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);

      const modalRootDiv = screen.queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
    });
    test("hides modal when clicking cancel", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);

      fireEvent.click(screen.queryByText("Cancel"));

      const modalRootDiv = screen.queryByTestId("modal-root");
      expect(modalRootDiv).not.toHaveClass("d-block show");
    });
    test("displays modal with information about the action", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);

      const message = screen.queryByText(
        `Are you sure to delete the post 'This is the latest post'?`
      );
      expect(message).toBeInTheDocument();
    });
    test("calls deletePost api with post id when delete button is clicked on modal", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockResolvedValue({});
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);
      expect(apiCalls.deletePost).toHaveBeenCalledWith(10);
    });
    test("hides modal after successful deletePost api call", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockResolvedValue({});
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);
      await waitFor(() => {
        const modalRootDiv = screen.queryByTestId("modal-root");
        expect(modalRootDiv).not.toHaveClass("d-block show");
      });
    });
    test("removes the deleted post from document after successful deletePost api call", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockResolvedValue({});
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);
      await waitFor(() => {
        const deletedPostContent = screen.queryByText(
          "This is the latest post"
        );
        expect(deletedPostContent).not.toBeInTheDocument();
      });
    });
    test("disables Modal Buttons when api call in progress", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);

      expect(deletePostButton).toBeDisabled();
      expect(screen.queryByText("Cancel")).toBeDisabled();
    });
    test("displays spinner when api call in progress", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);
      const spinner = screen.queryByText("Loading...");
      expect(spinner).toBeInTheDocument();
    });
    test("hides spinner when api call finishes", async () => {
      apiCalls.loadPosts = jest
        .fn()
        .mockResolvedValue(mockSuccessGetPostsFirstOfMultiPage);
      apiCalls.loadNewPostCount = jest
        .fn()
        .mockResolvedValue({ data: { count: 1 } });

      apiCalls.deletePost = jest.fn().mockImplementation(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({});
          }, 300);
        });
      });
      setup();
      await screen.findByText("This is the latest post");
      const deleteButton = screen.queryAllByRole("button")[0];
      fireEvent.click(deleteButton);
      const deletePostButton = screen.queryByText("Delete Post");
      fireEvent.click(deletePostButton);
      await waitFor(() => {
        const spinner = screen.queryByText("Loading...");
        expect(spinner).not.toBeInTheDocument();
      });
    });
  });
});

console.error = () => {};
