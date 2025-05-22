import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import DocumentSortByDropdown from "@/Components/user-dashboard/components/DocumentSortByDropdown.jsx";
import userEvent from "@testing-library/user-event";

describe("DocumentSortByDropdown", () => {
  const updateStateFunction = vi.fn();

  it("shows dropdown options on hover", async () => {
    render(
      <DocumentSortByDropdown updateStateFunction={updateStateFunction} />
    );

    const trigger = screen.getByText("مرتب سازی بر اساس");
    fireEvent.mouseEnter(trigger);
    await waitFor(() => {
      expect(screen.getByText("زمان آخرین بازدید")).toBeInTheDocument();
      expect(screen.getByText("زمان آخرین تغییر")).toBeInTheDocument();
    });
  });

  it("shows dropdown options on click", () => {
    render(
      <DocumentSortByDropdown updateStateFunction={updateStateFunction} />
    );

    const trigger = screen.getByText("مرتب سازی بر اساس");
    fireEvent.click(trigger);

    expect(screen.getByText("زمان آخرین بازدید")).toBeInTheDocument();
    expect(screen.getByText("زمان آخرین تغییر")).toBeInTheDocument();
  });

  it("shows dropdown options on click and calls updateStateFunction correctly", () => {
    render(
      <DocumentSortByDropdown updateStateFunction={updateStateFunction} />
    );

    const trigger = screen.getByText("مرتب سازی بر اساس");
    fireEvent.click(trigger);

    const option1 = screen.getByText("زمان آخرین بازدید");
    // const option2 = screen.getByText("زمان آخرین تغییر");

    expect(option1).toBeInTheDocument();
    // expect(option2).toBeInTheDocument();

    fireEvent.click(option1);
    expect(updateStateFunction).toHaveBeenCalledWith("last_seen");

    // fireEvent.click(option2);
    // expect(updateStateFunction).toHaveBeenCalledWith("updated_at");
  });
});
