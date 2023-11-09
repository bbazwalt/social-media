import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ProfileImageWithDefault from "./ProfileImageWithDefault";

describe("ProfileImageWithDefault", () => {
  describe("Layout", () => {
    test("has image", () => {
      render(<ProfileImageWithDefault />);
      const image = screen.queryByRole("img");
      expect(image).toBeInTheDocument();
    });
    test("displays default image when image property not provided", () => {
      render(<ProfileImageWithDefault />);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/profile.png");
    });
    test("displays user image when image property provided", () => {
      render(<ProfileImageWithDefault image="profile1.png" />);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/images/profile/profile1.png");
    });
    test("displays default image when provided image loading fails", () => {
      render(<ProfileImageWithDefault image="profile1.png" />);
      const image = screen.queryByRole("img");
      fireEvent.error(image);
      expect(image.src).toContain("/profile.png");
    });
    test("displays the image provided through src property", () => {
      render(<ProfileImageWithDefault src="image-from-src.png" />);
      const image = screen.queryByRole("img");
      expect(image.src).toContain("/image-from-src.png");
    });
  });
});
