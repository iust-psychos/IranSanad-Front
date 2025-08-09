import { it, expect, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import PasswordForm from "../../../pages/UserProfile/PasswordForm";
import userEvent from "@testing-library/user-event";

describe("Password Form", () => {
  const labels = ["رمزعبور فعلی", "رمزعبور جدید", "تایید رمزعبور جدید"];

  const mockOnUpdate = vi.fn();

  it("should render all password inputs and labels correctly", () => {
    render(<PasswordForm onUpdate={mockOnUpdate} />);
    labels.forEach((title) => {
      expect(screen.getByLabelText(title)).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  const valueChange = [
    "currentPasword1234",
    "newPasword1234",
    "confirmPasword1234",
  ];

  it("should call onUpdate when fields change", async () => {
    render(<PasswordForm onUpdate={mockOnUpdate} />);
    const user = userEvent.setup();

    for (let i = 0; i < labels.length; i++) {
      const title = labels[i];
      const input = screen.getByLabelText(title);
      expect(input).toBeInTheDocument();

      await user.type(input, valueChange[i]);

      const lastCall =
        mockOnUpdate.mock.calls[mockOnUpdate.mock.calls.length - 1];
      expect(lastCall).toEqual([input.name || input.id, valueChange[i]]);
    }
  });
});
