import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserListItem from "./UserListItem";

const user = {
  username: "user1",
  displayName: "display1",
  image: "profile1.png",
};

const setup = (propUser = user) => {
  return render(
    <MemoryRouter>
      <UserListItem user={propUser} />
    </MemoryRouter>
  );
};

describe("UserListItem", () => {
  test("has image", () => {
    setup();
    const image = screen.queryByRole("img");
    expect(image).toBeInTheDocument();
  });
  test("displays default image when user does not have one", () => {
    const userWithoutImage = {
      ...user,
      image: undefined,
    };
    setup(userWithoutImage);
    const image = screen.queryByRole("img");
    expect(image.src).toContain("/profile.png");
  });
  test("displays users image when user have one", () => {
    setup();
    const image = screen.queryByRole("img");
    expect(image.src).toContain("/images/profile/" + user.image);
  });
});
