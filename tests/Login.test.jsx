import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Login from "../Components/Login";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "react-tooltip/dist/react-tooltip.css"; // If styles are needed

const mockNavigate = vi.fn();
const { mockLogin } = vi.hoisted(() => {
  return {
    mockLogin: vi.fn(() =>
      Promise.resolve({
        data: {
          tokens: { access: "mock-token" },
        },
      })
    ),
  };
});

const { mockSaveToken } = vi.hoisted(() => {
  return { mockSaveToken: vi.fn() };
});
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../Managers/LoginManager", () => ({
  default: {
    Login: mockLogin,
  },
}));

vi.mock("../Managers/CookieManager", () => ({
  default: {
    SaveToken: mockSaveToken,
    LoadToken: () => "mock-token",
  },
}));
test("renders login form inputs and button", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/ایمیل/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /ورود/i })).toBeInTheDocument();
});
test("logs in with valid credentials and navigates", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/ایمیل/i), {
    target: { value: "Mehran0@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
    target: { value: "Mehran!00" },
  });

  fireEvent.click(screen.getByRole("button", { name: /ورود/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith("Mehran0@example.com", "Mehran!00");
    expect(mockSaveToken).toHaveBeenCalledWith(10, "mock-token");
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("navigates to dashboard on successful login", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByLabelText(/ایمیل/i), {
    target: { value: "Mehran0@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/رمز عبور/i), {
    target: { value: "Mehran!00" },
  });
  fireEvent.click(screen.getByRole("button", { name: /ورود/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("shows validation errors when submitting empty form", async () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText("ورود"));

  await waitFor(() => {

    const emailInput = screen.getByLabelText("ایمیل");
    expect(emailInput.className).toMatch(/inputFieldError/);
  });
});
