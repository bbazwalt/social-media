import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import * as apiCalls from "../../api/apiCalls";
import { listUsers } from "../../api/apiCalls";
import configureStore from "../../redux/configureStore";
import UserList from "./UserList";

apiCalls.listUsers = jest.fn().mockResolvedValue({
  data: {
    content: [],
    number: 0,
    size: 3,
  },
});

const setup = () => {
  const store = configureStore(false);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <UserList />
      </MemoryRouter>
    </Provider>
  );
};

const mockedEmptySuccessResponse = {
  data: {
    content: [],
    number: 0,
    size: 3,
  },
};

const mockSuccessGetSinglePage = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: true,
    size: 3,
    totalPages: 1,
  },
};

const mockSuccessGetMultiPageFirst = {
  data: {
    content: [
      {
        username: "user1",
        displayName: "display1",
        image: "",
      },
      {
        username: "user2",
        displayName: "display2",
        image: "",
      },
      {
        username: "user3",
        displayName: "display3",
        image: "",
      },
    ],
    number: 0,
    first: true,
    last: false,
    size: 3,
    totalPages: 2,
  },
};

const mockSuccessGetMultiPageLast = {
  data: {
    content: [
      {
        username: "user4",
        displayName: "display4",
        image: "",
      },
    ],
    number: 1,
    first: false,
    last: true,
    size: 3,
    totalPages: 2,
  },
};

const mockFailGet = {
  response: {
    data: {
      message: "Load error",
    },
  },
};

describe("UserList", () => {
  describe("Layout", () => {
    test("has header of Users", () => {
      setup();
      const header = screen.queryByRole("heading", { level: 3 });
      expect(header).toHaveTextContent("Users");
    });
    test("displays three items when listUser api returns three users", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetSinglePage);
      setup();
      await waitFor(() => {
        const userGroup = screen.queryByTestId("usergroup");
        // eslint-disable-next-line testing-library/no-node-access
        expect(userGroup.childElementCount).toBe(3);
      });
    });
    test("displays the displayName@username when listUser api returns users", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetSinglePage);
      setup();
      const firstUser = await screen.findByText("display1@user1");
      expect(firstUser).toBeInTheDocument();
    });
    test("displays the next button when response has last value as false", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageFirst);
      setup();
      const nextLink = await screen.findByText("next >");
      expect(nextLink).toBeInTheDocument();
    });
    test("hides the next button when response has last value as true", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageLast);
      setup();
      const nextLink = await screen.findByText("next >");
      expect(nextLink).not.toBeInTheDocument();
    });
    test("displays the previous button when response has first value as false", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageLast);
      setup();
      const previous = await screen.findByText("< previous");
      expect(previous).toBeInTheDocument();
    });
    test("hides the previous button when response has first value as true", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetMultiPageFirst);
      setup();
      const previous = await screen.findByText("< previous");
      expect(previous).not.toBeInTheDocument();
    });
    test("has link to UserPage", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockSuccessGetSinglePage);
      setup();
      await screen.findByText("display1@user1");
      const firstAnchor = screen.queryAllByRole("link")[0];
      expect(firstAnchor.getAttribute("href")).toBe("/user1");
    });
  });
  describe("Lifecycle", () => {
    test("calls listUsers api when it is rendered", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(listUsers).toHaveBeenCalledTimes(1);
    });
    test("calls listUsers method with page zero and size three", () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValue(mockedEmptySuccessResponse);
      setup();
      expect(listUsers).toHaveBeenCalledWith({ page: 0, size: 3 });
    });
  });
  describe("Interactions", () => {
    test("loads next page when clicked to next button", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst)
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast);
      setup();
      const nextLink = await screen.findByText("next >");
      fireEvent.click(nextLink);
      const secondPageUser = await screen.findByText("display4@user4");
      expect(secondPageUser).toBeInTheDocument();
    });
    test("loads previous page when clicked to previous button", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
      setup();
      const previousLink = await screen.findByText("< previous");
      fireEvent.click(previousLink);
      const firstPageUser = await screen.findByText("display1@user1");
      expect(firstPageUser).toBeInTheDocument();
    });
    test("displays error message when loading other page fails", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
        .mockRejectedValueOnce(mockFailGet);
      setup();
      const previousLink = await screen.findByText("< previous");
      fireEvent.click(previousLink);

      const errorMessage = await screen.findByText("User load failed");
      expect(errorMessage).toBeInTheDocument();
    });
    test("hides error message when successfully loading other page", async () => {
      apiCalls.listUsers = jest
        .fn()
        .mockResolvedValueOnce(mockSuccessGetMultiPageLast)
        .mockRejectedValueOnce(mockFailGet)
        .mockResolvedValueOnce(mockSuccessGetMultiPageFirst);
      setup();
      const previousLink = await screen.findByText("< previous");
      fireEvent.click(previousLink);
      await screen.findByText("User load failed");
      fireEvent.click(previousLink);
      const errorMessage = await screen.findByText("User load failed");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
});

console.error = () => {};
