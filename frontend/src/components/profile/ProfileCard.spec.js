import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileCard from "./ProfileCard";
const user = {
  id: 1,
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
};

describe("ProfileCard", () => {
  describe("Layout", () => {
    test("displays the displayName@username", () => {
      render(<ProfileCard user={user} />);
      const userInfo = screen.queryByText("display1@user1");
      expect(userInfo).toBeInTheDocument();
    });
    test("has image", () => {
      render(<ProfileCard user={user} />);
      const image = screen.queryByRole("img");
      expect(image).toBeInTheDocument();
    });
    test("displays default image when user does not have one", () => {
      const userWithoutImage = {
        ...user,
        image: undefined,
      };
      render(<ProfileCard user={userWithoutImage} />);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/profile.png");
    });
    test("displays user image when user has one", () => {
      render(<ProfileCard user={user} />);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/images/profile/" + user.image);
    });
    test("displays edit button when isEditable property set as true", () => {
      render(<ProfileCard user={user} isEditable={true} />);
      const editButton = screen.queryByText("Edit");
      expect(editButton).toBeInTheDocument();
    });
    test("does not display edit button when isEditable not provided", () => {
      render(<ProfileCard user={user} />);
      const editButton = screen.queryByText("Edit");
      expect(editButton).not.toBeInTheDocument();
    });
    test("displays displayName input when inEditMode property set as true", () => {
      render(<ProfileCard user={user} inEditMode={true} />);
      const displayInput = screen.queryByRole("textbox");
      expect(displayInput).toBeInTheDocument();
    });
    test("displays the current displayName in input in edit mode", () => {
      render(<ProfileCard user={user} inEditMode={true} />);
      const displayInput = screen.queryByRole("textbox");
      expect(displayInput.value).toBe(user.displayName);
    });
    test("hides the displayName@username in edit mode", () => {
      render(<ProfileCard user={user} inEditMode={true} />);
      const userInfo = screen.queryByText("display1@user1");
      expect(userInfo).not.toBeInTheDocument();
    });
    test("displays label for displayName in edit mode", () => {
      render(<ProfileCard user={user} inEditMode={true} />);
      const label = screen.getByLabelText("Change Display Name for user1");
      expect(label).toBeInTheDocument();
    });
    test("hides the edit button in edit mode and isEditable provided as true", () => {
      render(<ProfileCard user={user} inEditMode={true} isEditable={true} />);
      const editButton = screen.queryByText("Edit");
      expect(editButton).not.toBeInTheDocument();
    });
    test("displays Save button in edit mode", () => {
      render(<ProfileCard user={user} inEditMode={true} isEditable={true} />);
      const saveButton = screen.queryByText("Save");
      expect(saveButton).toBeInTheDocument();
    });
    test("displays Cancel button in edit mode", () => {
      render(<ProfileCard user={user} inEditMode={true} isEditable={true} />);
      const cancelButton = screen.queryByText("Cancel");
      expect(cancelButton).toBeInTheDocument();
    });
    test("displays file input when inEditMode property set as true", () => {
      render(<ProfileCard user={user} inEditMode={true} isEditable={true} />);
      const input = screen.queryByLabelText("file");
      expect(input.type).toBe("file");
    });
  });
});
