import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import PostView from "./PostView";
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

const loggedInStateUser2 = {
  id: 2,
  username: "user2",
  displayName: "display2",
  image: "profile2.png",
  password: "P4ssword",
  isLoggedIn: true,
};

const postWithoutAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
};

const postWithAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "image/png",
    name: "attached-image.png",
  },
};

const postWithPdfAttachment = {
  id: 10,
  content: "This is the first post",
  user: {
    id: 1,
    username: "user1",
    displayName: "display1",
    image: "profile1.png",
  },
  attachment: {
    fileType: "application/pdf",
    name: "attached.pdf",
  },
};

const setup = (post = postWithoutAttachment, state = loggedInStateUser1) => {
  const oneMinute = 60 * 1000;
  const date = new Date(new Date() - oneMinute);
  post.date = date;
  const store = legacy_createStore(authReducer, state);
  return render(
    <Provider store={store}>
      <MemoryRouter>
        <PostView post={post} />
      </MemoryRouter>
    </Provider>
  );
};

describe("PostView", () => {
  describe("Layout", () => {
    test("displays post content", () => {
      setup();
      expect(screen.getByText("This is the first post")).toBeInTheDocument();
    });
    test("displays users image", () => {
      setup();
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    test("displays displayName@user", () => {
      setup();
      expect(screen.getByText("display1@user1")).toBeInTheDocument();
    });
    test("displays relative time", () => {
      setup();
      expect(screen.getByText("1 minute ago")).toBeInTheDocument();
    });
    test("has link to user page", () => {
      setup();
      const anchor = screen.queryByLabelText("post-view");
      expect(anchor.getAttribute("href")).toBe("/user1");
    });
    test("displays file attachment image", () => {
      setup(postWithAttachment);
      const images = screen.queryAllByRole("img");
      expect(images.length).toBe(2);
    });
    test("does not displays file attachment when attachment type is not image", () => {
      setup(postWithPdfAttachment);
      const images = screen.queryAllByRole("img");
      expect(images.length).toBe(1);
    });
    test("sets the attachment path as source for file attachment image", () => {
      setup(postWithAttachment);
      const images = screen.queryAllByRole("img");
      const attachmentImage = images[1];
      expect(attachmentImage.src).toContain(
        "/images/attachments/" + postWithAttachment.attachment.name
      );
    });
    test("displays delete button when post owned by logged in user", () => {
      setup();
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
    test("does not display delete button when post is not owned by logged in user", () => {
      setup(postWithoutAttachment, loggedInStateUser2);
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
    test("does not show the dropdown menu when not clicked", () => {
      setup();
      const dropDownMenu = screen.queryByTestId("post-action-dropdown");
      expect(dropDownMenu).not.toHaveClass("show");
    });
    test("shows the dropdown menu after clicking the indicator", () => {
      setup();
      const indicator = screen.queryByTestId("post-actions");
      fireEvent.click(indicator);
      const dropDownMenu = screen.queryByTestId("post-action-dropdown");
      expect(dropDownMenu).toHaveClass("show");
    });
  });
});
