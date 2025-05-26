import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import UserProfile from "../../Components/UserProfile";
import userEvent from "@testing-library/user-event";
import axios from "axios";
// import { LoadToken } from "../../Managers/CookieManager";

describe("User Profile", () => {
  vi.mock("axios");

  vi.mock("../../Managers/CookieManager", () => ({
    default: {
      LoadToken: () => "fake-token",
    },
  }));

  const user = {
    username: "testuser",
    first_name: "نام",
    last_name: "فامیلی",
    email: "testuser@example.com",
    phone_number: "",
    profile_image: "/media/test.jpg",
  };

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: user });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should display welcoming message", () => {
    render(<UserProfile />);
    expect(screen.getByText(/خوش آمدی/i)).toBeInTheDocument();
  });

  it("should fetch user data and display properly", async () => {
    render(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText("نام فامیلی")).toBeInTheDocument();
      expect(screen.getByText("testuser@example.com")).toBeInTheDocument();

      expect(screen.getByDisplayValue("نام")).toBeInTheDocument();
      expect(screen.getByDisplayValue("فامیلی")).toBeInTheDocument();
      expect(screen.getByDisplayValue("testuser")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("شماره تلفن همراه را وارد کنید")
      ).toBeInTheDocument();
    });
  });

  it("should tooggle edit/save button value", async () => {
    render(<UserProfile />);

    const button = screen.getByRole("button", { name: /ویرایش/i });
    const user = userEvent.setup();

    await user.click(button);

    expect(screen.getByRole("button", { name: /ذخیره/i })).toBeInTheDocument();
  });

  it("should hide/unhide password when clicked on eye icon", async () => {
    render(<UserProfile />);

    const button = screen.getByRole("button", { name: /ویرایش/i });
    const user = userEvent.setup();
    await user.click(button);

    const togglePassword = screen.getByTestId("old_password");
    const oldPasswordInput = screen.getByLabelText("رمز عبور کنونی");
    const newPasswordInput = screen.getByLabelText("رمز عبور جدید");

    expect(oldPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordInput).toHaveAttribute("type", "password");
    await user.click(togglePassword);
    expect(oldPasswordInput).toHaveAttribute("type", "text");
    expect(newPasswordInput).not.toHaveAttribute("type", "text");
  });

  it("should send updated user data when save button clicked", async () => {
    const userE = userEvent.setup();

    const updated_user = {
      first_name: "اسم",
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      profile_image: user.profile_image,
    };

    axios.put.mockResolvedValueOnce({ data: updated_user });

    render(<UserProfile />);

    const button = screen.getByRole("button", { name: /ویرایش/i });
    await userE.click(button);

    const nameInput = screen.getByLabelText("نام");
    await userE.clear(nameInput);
    await userE.type(nameInput, "اسم");

    const toggledButton = screen.getByRole("button", { name: /ذخیره/i });
    await userE.click(toggledButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("auth/info"),
        expect.objectContaining({
          first_name: "اسم",
        }),
        expect.objectContaining({
          headers: {
            Authorization: expect.stringContaining("JWT"),
            "Content-Type": "application/json",
          },
        })
      );
    });
  });

  it("should send updated user password data when save button clicked", async () => {
    const userE = userEvent.setup();

    const updated_password = {
      old_password: "Test@gmail1",
      new_password: "Test@gmail2",
      new_password2: "Test@gmail2",
    };

    axios.post.mockResolvedValueOnce({ data: updated_password });

    render(<UserProfile />);

    const button = screen.getByRole("button", { name: /ویرایش/i });
    await userE.click(button);

    const oldPasswordInput = screen.getByLabelText("رمز عبور کنونی");
    await userE.clear(oldPasswordInput);
    await userE.type(oldPasswordInput, "Test@gmail1");

    const newPasswordInput = screen.getByLabelText("رمز عبور جدید");
    await userE.clear(newPasswordInput);
    await userE.type(newPasswordInput, "Test@gmail2");

    const newPasswordInput2 = screen.getByLabelText("تایید رمز عبور جدید");
    await userE.clear(newPasswordInput2);
    await userE.type(newPasswordInput2, "Test@gmail2");

    const toggledButton = screen.getByRole("button", { name: /ذخیره/i });
    await userE.click(toggledButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("auth/change_password"),
        expect.objectContaining({
          old_password: "Test@gmail1",
          new_password: "Test@gmail2",
          new_password2: "Test@gmail2",
        }),
        expect.objectContaining({
          headers: {
            Authorization: "JWT fake-token",
            "Content-Type": "application/json",
          },
        })
      );
    });
  });
});
