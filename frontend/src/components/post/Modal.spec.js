import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Modal from "./Modal";

describe("Modal", () => {
  describe("Layout", () => {
    test("will be visible when visible property set to true", () => {
      render(<Modal visible={true} />);
      const modalRootDiv = screen.queryByTestId("modal-root");
      expect(modalRootDiv).toHaveClass("modal fade d-block show");
      expect(modalRootDiv).toHaveStyle(`background-color: #000000b0`);
    });
    test("displays the title provided as prop", () => {
      render(<Modal title="Test Title" />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
    test("displays the body provided as prop", () => {
      render(<Modal body="Test Body" />);
      expect(screen.getByText("Test Body")).toBeInTheDocument();
    });
    test("displays OK button text provided as prop", () => {
      render(<Modal okButton="OK" />);
      expect(screen.getByText("OK")).toBeInTheDocument();
    });
    test("displays Cancel button text provided as prop", () => {
      render(<Modal cancelButton="Cancel" />);
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
    test("displays defaults for buttons when corresponding props not provided", () => {
      render(<Modal />);
      expect(screen.getByText("Ok")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });
    test("calls callback function provided as prop when clicking ok button", () => {
      const mockFn = jest.fn();
      render(<Modal onClickOk={mockFn} />);
      fireEvent.click(screen.queryByText("Ok"));
      expect(mockFn).toHaveBeenCalled();
    });
    test("calls callback function provided as prop when clicking cancel button", () => {
      const mockFn = jest.fn();
      render(<Modal onClickCancel={mockFn} />);
      fireEvent.click(screen.queryByText("Cancel"));
      expect(mockFn).toHaveBeenCalled();
    });
  });
});
