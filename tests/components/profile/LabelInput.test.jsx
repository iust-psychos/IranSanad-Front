import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import LabelInput from "../../../pages/UserProfile/LabelInput";
import userEvent from "@testing-library/user-event";

describe("LabelInput", () => {
  const mockInfo = {
    first_name: "fname",
    last_name: "lname",
    email: "email",
    username: "username",
    phone_number: "+989012345678",
  };
  const mockOnChange = vi.fn();

  it("should display name fields properly", () => {
    render(
      <LabelInput
        name="name"
        type="text"
        label="نام"
        value1={mockInfo.first_name}
        value2={mockInfo.last_name}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("نام")).toBeInTheDocument();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(2);
    expect(
      inputs.forEach((input, index) => {
        expect(input)
          .toHaveValue(index === 0 ? mockInfo.first_name : mockInfo.last_name)
          .not.toBeDisabled();
      })
    );
  });

  it("should display email field properly", () => {
    render(
      <LabelInput
        name="email"
        type="text"
        label="نشانی ایمیل"
        value1={mockInfo.email}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("نشانی ایمیل")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(mockInfo.email).toBeDisabled();
  });

  it("should display phone number field properly", () => {
    render(
      <LabelInput
        name="number"
        type="text"
        label="شماره تماس"
        value1={mockInfo.phone_number}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("شماره تماس")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(mockInfo.phone_number).not.toBeDisabled();
  });

  it("should display username field properly", () => {
    render(
      <LabelInput
        name="username"
        type="text"
        label="نام کاربری"
        value1={mockInfo.username}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText("نام کاربری")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(mockInfo.username).not.toBeDisabled();
  });

  it("should display old pasword field and toggles visibility on click properly", async () => {
    render(
      <LabelInput
        name="current"
        type="password"
        label="رمزعبور فعلی"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText("رمزعبور فعلی");
    const toggleButton = screen.getByRole("button");

    expect(screen.getByLabelText("رمزعبور فعلی")).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    const user = userEvent.setup();
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should display new pasword field and toggles visibility on click properly", async () => {
    render(
      <LabelInput
        name="new"
        type="password"
        label="رمزعبور جدید"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText("رمزعبور جدید");
    const toggleButton = screen.getByRole("button");

    expect(screen.getByLabelText("رمزعبور جدید")).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    const user = userEvent.setup();
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should display confirm new pasword field and toggles visibility on click properly", async () => {
    render(
      <LabelInput
        name="confirm"
        type="password"
        label="تایید رمزعبور جدید"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByLabelText("تایید رمزعبور جدید");
    const toggleButton = screen.getByRole("button");

    expect(screen.getByLabelText("تایید رمزعبور جدید")).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");

    const user = userEvent.setup();
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });
});
