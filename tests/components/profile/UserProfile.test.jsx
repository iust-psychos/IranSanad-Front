import "@testing-library/jest-dom/vitest";
import { it, expect, describe, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserProfile from "../../../pages/UserProfile/index";
import {
  changeUserInfo,
  changeUserPass,
  changeUserImage,
} from "@/managers/UserProfileManager";
import { convertToBase64 } from "@/utils/Base64ImageConverter";
import { showErrorToast, showSuccessToast } from "@/utils/Toast";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("@/utils/Base64ImageConverter", () => ({ convertToBase64: vi.fn() }));
vi.mock("@/utils/Toast", () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock("@/managers/UserProfileManager", () => ({
  changeUserInfo: vi.fn(),
  changeUserPass: vi.fn(),
  changeUserImage: vi.fn(),
  getUserInfoAPI: "/mock/userinfo",
  baseAPI: "http://localhost/",
}));

describe("User Profile", () => {
  const mockUser = {
    first_name: "fname",
    last_name: "lname",
    profile_image: "image",
    email: "email@example.com",
    phone_number: "+989000000000",
    username: "username",
    date_joined: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValueOnce({
      data: mockUser,
    });

    render(
      <MemoryRouter>
        <UserProfile />
      </MemoryRouter>
    );
  });

  it("should fetch and display user info properly", async () => {
    expect(await screen.findByText(/fname/i)).toBeInTheDocument();
    expect(await screen.findByText(/lname/i)).toBeInTheDocument();
    expect(await screen.findByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(/عضویت/i)).toBeInTheDocument();

    const images = await screen.findAllByRole("img");
    const profile = images.filter((x) => x.alt === mockUser.first_name);
    expect(profile).toHaveLength(1);

    const buttons = await screen.findAllByRole("button");
    expect(buttons).toHaveLength(6);
  });

  it("should switch between InfoForm and PasswordForm", async () => {
    const userInfo = screen.getByRole("button", { name: "اطلاعات شخصی" });
    expect(userInfo).toHaveTextContent("اطلاعات شخصی");
    const passInfo = screen.getByRole("button", { name: "تغییر رمزعبور" });
    expect(passInfo).toHaveTextContent("تغییر رمزعبور");

    const user = userEvent.setup();
    await user.click(passInfo);
    expect(screen.getByLabelText("رمزعبور فعلی")).toBeInTheDocument();
    expect(screen.getByLabelText("رمزعبور جدید")).toBeInTheDocument();
    expect(screen.getByLabelText("تایید رمزعبور جدید")).toBeInTheDocument();
  });

  it("should upload image successfully", async () => {
    convertToBase64.mockResolvedValueOnce("base64string");
    const fileInput =
      screen.getByText("تغییر تصویر").parentElement.previousSibling;
    console.log(fileInput);
    const file = new File(["data"], "profile.png", { type: "image/png" });

    const user = userEvent.setup();
    user.upload(fileInput, file);
    await waitFor(() => expect(convertToBase64).toHaveBeenCalled());
  });

  it("should fail uploading image", async () => {
    convertToBase64.mockRejectedValueOnce(new Error("خطا"));
    const fileInput =
      screen.getByText("تغییر تصویر").parentElement.previousSibling;
    console.log(fileInput);
    const file = new File(["data"], "profile.png", { type: "image/png" });

    const user = userEvent.setup();
    user.upload(fileInput, file);
    await waitFor(() =>
      expect(showErrorToast).toHaveBeenCalled("خطا در انتخاب تصویر")
    );
  });

  it("should save updated user info", async () => {
    changeUserInfo.mockResolvedValueOnce({ success: true });

    const nameInput = screen.getByLabelText("نام");

    await userEvent.click(nameInput);
    await userEvent.keyboard("{Control>}{a}{/Control}");
    await userEvent.keyboard("{Backspace}");

    await userEvent.type(nameInput, "یک اسم جدید");

    expect(nameInput).toHaveValue("یک اسم جدید");

    await userEvent.click(screen.getByRole("button", { name: "ذخیره" }));

    expect(changeUserInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: "یک اسم جدید",
      })
    );
    expect(showSuccessToast).toHaveBeenCalled();
  });

  it("should fail to save updated user info when phone number is invalid", async () => {
    const errorResponse = {
      response: {
        data: {
          detail: "شماره تلفن همراه معتبر نیست",
        },
      },
    };
    changeUserInfo.mockRejectedValueOnce(errorResponse);

    const numberInput = screen.getByLabelText("شماره تماس");

    await userEvent.click(numberInput);
    await userEvent.keyboard("{Control>}{a}{/Control}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(numberInput, "09010000000");

    await userEvent.click(screen.getByRole("button", { name: "ذخیره" }));

    expect(showErrorToast).toHaveBeenCalled();
  });

  it("should save updated user password", async () => {
    changeUserPass.mockResolvedValueOnce({ success: true });

    expect(screen.queryByLabelText("رمزعبور فعلی")).not.toBeInTheDocument();

    const toggleButton = screen.getByRole("button", { name: "تغییر رمزعبور" });
    await userEvent.click(toggleButton);

    const currentPasswordInput = screen.getByLabelText("رمزعبور فعلی");
    const newPasswordInput = screen.getByLabelText("رمزعبور جدید");
    const confirmPasswordInput = screen.getByLabelText("تایید رمزعبور جدید");

    await userEvent.type(currentPasswordInput, "currentPassword");
    await userEvent.type(newPasswordInput, "newPassword");
    await userEvent.type(confirmPasswordInput, "newPassword");

    expect(currentPasswordInput).toHaveValue("currentPassword");
    expect(newPasswordInput).toHaveValue("newPassword");
    expect(confirmPasswordInput).toHaveValue("newPassword");

    await userEvent.click(screen.getByRole("button", { name: "ذخیره" }));

    expect(changeUserPass).toHaveBeenCalledWith(
      expect.objectContaining({
        current: "currentPassword",
        new: "newPassword",
        confirm: "newPassword",
      })
    );
    expect(showSuccessToast).toHaveBeenCalled();
  });

  it("should fail to save updated user password when new password and confirm mismatch", async () => {
    const errorResponse = {
      response: {
        data: {
          detail: "رمزعبور جدید و تایید رمزعبور جدید مطابقت ندارند",
        },
      },
    };
    changeUserPass.mockRejectedValueOnce(errorResponse);

    const toggleButton = screen.getByRole("button", { name: "تغییر رمزعبور" });
    await userEvent.click(toggleButton);

    const currentPasswordInput = screen.getByLabelText("رمزعبور فعلی");
    const newPasswordInput = screen.getByLabelText("رمزعبور جدید");
    const confirmPasswordInput = screen.getByLabelText("تایید رمزعبور جدید");

    await userEvent.type(currentPasswordInput, "currentPassword");
    await userEvent.type(newPasswordInput, "newPassword");
    await userEvent.type(confirmPasswordInput, "newpassword");

    await userEvent.click(screen.getByRole("button", { name: "ذخیره" }));

    expect(showErrorToast).toHaveBeenCalled();
  });

  it("should reset user info on cancel", async () => {
    const usernameInput = screen.getByLabelText("نام کاربری");

    await userEvent.click(usernameInput);
    await userEvent.keyboard("{Control>}{a}{/Control}");
    await userEvent.keyboard("{Backspace}");
    await userEvent.type(usernameInput, "NEWUSERNAME");

    await userEvent.click(screen.getByRole("button", { name: "لغو" }));
    expect(usernameInput).toHaveValue("username");
    expect(changeUserInfo).not.toHaveBeenCalled();
  });

  it("should remove user image on delete", async () => {
    const deleteButton = screen.getByRole("button", { name: "حذف تصویر" });
    await userEvent.click(deleteButton);
    const image = screen.queryByRole("img", {
      name: mockUser.first_name,
    });
    expect(image).toBe(null);
  });
});
