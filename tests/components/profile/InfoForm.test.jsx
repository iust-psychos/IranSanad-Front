import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import InfoForm from "../../../pages/UserProfile/InfoForm";
import userEvent from "@testing-library/user-event";

describe("Info Form", () => {
  const mockInfo = {
    first_name: "fname",
    last_name: "lname",
    email: "email",
    username: "username",
    phone_number: "+989012345678",
  };

  const mockOnChange = vitest.fn();

  it("should render all info fields when all provided correctly", () => {
    render(<InfoForm user={mockInfo} mockOnchange={mockOnChange} />);

    expect(screen.getByDisplayValue(mockInfo.first_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockInfo.last_name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockInfo.email)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockInfo.username)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockInfo.phone_number)).toBeInTheDocument();
  });

  const mockIncompleteInfo = {
    first_name: "",
    last_name: "lname",
    email: "email",
    username: "username",
    phone_number: "",
  };

  it("should render all info fields when some provided correctly", () => {
    render(<InfoForm user={mockIncompleteInfo} mockOnchange={mockOnChange} />);

    const labels = ["نام", "نشانی ایمیل", "شماره تماس", "نام کاربری"];

    expect(screen.getAllByRole("textbox")).toHaveLength(5);
    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      if (label === "نشانی ایمیل") {
        expect(screen.getByLabelText(label)).toBeDisabled();
      }
    });

    const inputs = screen.getAllByRole("textbox");
    const emptyInputs = inputs.filter((input) => input.value === "");
    expect(emptyInputs).toHaveLength(2);
  });

  it("should call onUpdate when editable fields change and not call on email field", () => {
    render(<InfoForm user={mockIncompleteInfo} mockOnchange={mockOnChange} />);

    const inputs = screen.getAllByRole("textbox");
    const editableInputs = inputs.filter((input) => input.name !== "email");
    expect(editableInputs).toHaveLength(4);

    const user = userEvent.setup();
    editableInputs.forEach(async (input) => {
      await user.type(input, "test value");
      expect(mockOnChange).toHaveBeenCalledWith(input.name, "test value");
    });

    const disabledInput = inputs.filter((input) => input.disabled === true);
    expect(disabledInput).toHaveLength(1);
    expect(mockOnChange).not.toHaveBeenCalledWith("email", expect.anything());
  });
});
