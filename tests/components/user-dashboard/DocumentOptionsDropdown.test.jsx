import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import DocumentOptionsDropdown from "@/Components/user-dashboard/components/DocumentOptionsDropdown.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { it, vi } from "vitest";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for testing
    },
  },
});

const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mock the hook
const mockMutate = vi.fn();
vi.mock("@/hooks/useDeleteDocument", () => ({
  useDeleteDocument: () => ({
    mutate: mockMutate,
  }),
}));

describe("DocumentOptionsDropdown", () => {
  const mockUpdateStateFunction = vi.fn();
  const mockDocument = {
    doc_uuid: "12345",
    title: "Test Document",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it("shows dropdown options on hover", async () => {
    render(
      <DocumentOptionsDropdown
        document={mockDocument}
        updateStateFunction={mockUpdateStateFunction}
      />,
      { wrapper: Wrapper }
    );

    const trigger = screen.getByTestId("document-options-trigger");
    fireEvent.mouseEnter(trigger);
    await waitFor(() => {
      // Check if options are in the DOM
      const renameOption = screen.getByText("تغییر نام");
      const deleteOption = screen.getByText("حذف");
      const openInNewTab = screen.getByText("باز کردن در برگه جدید");

      expect(renameOption).toBeInTheDocument();
      expect(deleteOption).toBeInTheDocument();
      expect(openInNewTab.closest("a")).toHaveAttribute(
        "href",
        "/document/12345"
      );
    });
  });

  it("shows dropdown options on click", () => {
    render(
      <DocumentOptionsDropdown
        document={mockDocument}
        updateStateFunction={mockUpdateStateFunction}
      />,
      { wrapper: Wrapper }
    );

    // Open the dropdown via trigger click
    const trigger = screen.getByTestId("document-options-trigger");
    fireEvent.click(trigger);

    // Check if options are in the DOM
    const renameOption = screen.getByText("تغییر نام");
    const deleteOption = screen.getByText("حذف");
    const openInNewTab = screen.getByText("باز کردن در برگه جدید");

    expect(renameOption).toBeInTheDocument();
    expect(deleteOption).toBeInTheDocument();
    expect(openInNewTab.closest("a")).toHaveAttribute(
      "href",
      "/document/12345"
    );
  });

  it("clicking rename opens rename modal", async () => {
    render(
      <DocumentOptionsDropdown
        document={mockDocument}
        updateStateFunction={mockUpdateStateFunction}
      />,
      { wrapper: Wrapper }
    );

    // Open the dropdown via trigger click
    const trigger = screen.getByTestId("document-options-trigger");
    fireEvent.click(trigger);
    // Click rename
    fireEvent.click(screen.getByText("تغییر نام"));
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("clicking delete works", () => {
    render(
      <DocumentOptionsDropdown
        document={mockDocument}
        updateStateFunction={mockUpdateStateFunction}
      />,
      { wrapper: Wrapper }
    );

    // Open the dropdown via trigger click
    const trigger = screen.getByTestId("document-options-trigger");
    fireEvent.click(trigger);

    // Click delete
    fireEvent.click(screen.getByText("حذف"));
    expect(mockMutate).toHaveBeenCalled();
  });
});
