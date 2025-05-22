import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUp from "../Components/Sign_up";
import { BrowserRouter } from "react-router-dom";
import * as SignupManager from "../Managers/SignupManager";

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

vi.mock("../Utilities/Toast.js", () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock("../Managers/SignupManager");

describe("SignUp Component", () => {
  beforeEach(() => {
    console.log(SignupManager.default);
    SignupManager.default.sendValidationCode.mockResolvedValue({});
    SignupManager.default.resendCode.mockResolvedValue({});
    SignupManager.default.Signup.mockResolvedValue({ data: { tokens: { access: "token" } } });
  });

  it("renders the sign-up form", () => {
    renderWithRouter(<SignUp />);
    expect(screen.getByText("حساب جدید")).toBeInTheDocument();
    expect(screen.getByLabelText("نام کاربری")).toBeInTheDocument();
    expect(screen.getByLabelText("ایمیل")).toBeInTheDocument();
  });

  it("updates username field on input", () => {
    renderWithRouter(<SignUp />);
    const usernameInput = screen.getByLabelText("نام کاربری");
    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    expect(usernameInput.value).toBe("testuser");
  });

  it("shows validation errors when submitting empty form", async () => {
    renderWithRouter(<SignUp />);
    fireEvent.click(screen.getByText("ایجاد حساب"));
  
    await waitFor(() => {
      const usernameInput = screen.getByLabelText("نام کاربری");
      expect(usernameInput.className).toMatch(/inputFieldError/);
  
      const emailInput = screen.getByLabelText("ایمیل");
      expect(emailInput.className).toMatch(/inputFieldError/);
    });
  });
  

  // it("transitions to validation code form on valid submit", async () => {
  //   renderWithRouter(<SignUp />);
  //   fireEvent.change(screen.getByLabelText("نام کاربری"), {
  //     target: { value: "testuser" },
  //   });
  //   fireEvent.change(screen.getByLabelText("ایمیل"), {
  //     target: { value: "test@example.com" },
  //   });
  //   fireEvent.change(screen.getByLabelText("رمز عبور"), {
  //     target: { value: "Test@1234" },
  //   });
  //   fireEvent.change(screen.getByLabelText("تکرار رمز عبور"), {
  //     target: { value: "Test@1234" },
  //   });
  //   fireEvent.click(screen.getByText("ایجاد حساب"));

  //   await waitFor(() => {
  //     expect(SignupManager.default.sendValidationCode).toHaveBeenCalledWith("test@example.com");
  //   });
  // });
});
