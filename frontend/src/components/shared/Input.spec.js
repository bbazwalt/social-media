import { fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Layout", () => {
  test("has input item", () => {
    render(<Input />);
    const input = screen.queryByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  test("displays the label provided in props", () => {
    render(<Input label="Test label" />);
    const label = screen.queryByText("Test label");
    expect(label).toBeInTheDocument();
  });

  test("does not displays the label when no label provided in props", () => {
    render(<Input />);
    const label = screen.queryByRole("label");
    expect(label).not.toBeInTheDocument();
  });

  test("has text type for input when type is not provided as prop", () => {
    render(<Input />);
    const input = screen.queryByRole("textbox");
    expect(input.type).toBe("text");
  });

  test("has password type for input password type is provided as prop", () => {
    render(<Input type="password" />);
    const input = screen.queryByLabelText("password");
    expect(input.type).toBe("password");
  });

  test("displays placeholder when it is provided as prop", () => {
    render(<Input placeholder="Test placeholder" />);
    const input = screen.queryByRole("textbox");
    expect(input.placeholder).toBe("Test placeholder");
  });

  test("has value for input when it is provided as prop", () => {
    render(<Input value="Test value" />);
    const input = screen.queryByRole("textbox");
    expect(input.value).toBe("Test value");
  });

  test("has onChange callback when it is provided as prop", () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    const input = screen.queryByRole("textbox");
    fireEvent.change(input, { target: { value: "new-input" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test("has default style when there is no validation error or success", () => {
    render(<Input />);
    const input = screen.queryByRole("textbox");
    expect(input.className).toBe("form-control");
  });

  test("has success style when hasError property is false", () => {
    render(<Input hasError={false} />);
    const input = screen.queryByRole("textbox");
    expect(input.className).toBe("form-control is-valid");
  });

  test("has style for error case when there is error", () => {
    render(<Input hasError={true} />);

    const input = screen.queryByRole("textbox");
    expect(input.className).toBe("form-control is-invalid");
  });

  test("displays the error text when it is provided", () => {
    render(<Input hasError={true} error="Cannot be null" />);
    expect(screen.getByText("Cannot be null")).toBeInTheDocument();
  });

  test("does not display the error text when hasError not provided", () => {
    render(<Input error="Cannot be null" />);
    expect(screen.queryByText("Cannot be null")).not.toBeInTheDocument();
  });
});
