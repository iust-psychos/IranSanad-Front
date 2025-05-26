import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { jest } from "@testing-library/jest-dom";
import { BrowserRouter, useNavigate, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import UserProfileDropdown from "@/components/user-dashboard/components/UserProfileDropdown";
import CookieManager from "@/Managers/CookieManager";
import { userInfoLoader } from "@/Managers/user-dashboard-manager";

// Mocks
vi.mock("@/Managers/user-dashboard-manager", () => ({
  userInfoLoader: vi.fn(),
}));
vi.mock("@/Managers/CookieManager", () => ({
  default: {
    RemoveToken: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock("react-router-dom", () => ({
  Link: ({ children }) => <div>{children}</div>,
  useNavigate: vi.fn(),
}));

const mockNavigate = vi.fn();

describe("UserProfileDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    // vi.useFakeTimers();
  });

  // afterEach(() => {
  //   vi.useRealTimers(); // 👈 reset to real timers after test
  // });

  it("refetches data when dropdown is opened", async () => {
    const mockUserInfo = {
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      profile_image: null,
    };
    userInfoLoader.mockResolvedValueOnce(mockUserInfo);

    render(<UserProfileDropdown />, { wrapper: createWrapper() });

    const trigger = screen.getByRole("button", { name: /عکس پروفایل/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  it("shows loading spinner while fetching", async () => {
    userInfoLoader.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 1000))
    );

    render(<UserProfileDropdown />, { wrapper: createWrapper() });

    const trigger = screen.getByRole("button", { name: /عکس پروفایل/i });
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByTestId("spinner")).toBeInTheDocument(); // RingLoader
    });
  });

  // it("shows error message on error", async () => {
  //   userInfoLoader.mockRejectedValue(Promise.reject(new Error("API Error")));

  //   render(<UserProfileDropdown />, { wrapper: createWrapper() });

  //   const trigger = screen.getByRole("button", { name: /عکس پروفایل/i });
  //   fireEvent.click(trigger);

  //   // await waitFor(async () => {
  //   expect(
  //     await screen.findByText("خطا در دریافت اطلاعات")
  //   ).toBeInTheDocument();
  //   // });
  // });

  // it("signs out and navigates to /login", async () => {
  //   const mockUserInfo = {
  //     first_name: "Ali",
  //     last_name: "Rezaei",
  //     email: "ali@example.com",
  //   };
  //   userInfoLoader.mockResolvedValueOnce(mockUserInfo);

  //   render(<UserProfileDropdown />, { wrapper: createWrapper() });

  //   const trigger = screen.getByRole("button", { name: /عکس پروفایل/i });
  //   fireEvent.click(trigger);

  //   await screen.findByText("Ali Rezaei");

  //   fireEvent.click(screen.getByText("خروج از حساب"));

  //   await expect(CookieManager.RemoveToken).toHaveBeenCalled();
  //   // vi.advanceTimersByTime(1000); // ⏩ fast-forward 1 second
  //   vi.useFakeTimers();

  //   vi.advanceTimersByTime(1000);

  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith("/login");
  //   });

  //   vi.useRealTimers();
  // });
});
