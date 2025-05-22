import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  getByTestId,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserDashboard from "@/Components/user-dashboard/components/UserDashboard.jsx";
import { createDocument } from "@/Managers/user-dashboard-manager.js";
import { useLoaderData, useNavigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries for testing
    },
  },
});

vi.mock("@/Components/user-dashboard/components/Icons.jsx", () => ({
  IconLogo: () => <div data-testid="icon-logo">IconLogo</div>,
  IconPlus: () => <div data-testid="icon-plus">IconPlus</div>,
  IconSearch: () => <div data-testid="icon-search">IconSearch</div>,
  IconPlusFill: () => <div data-testid="icon-plus-fill">IconPlusFill</div>,
}));

vi.mock(
  "@/Components/user-dashboard/components/DocumentOptionsDropdown.jsx",
  () => ({
    default: () => (
      <div data-testid="document-options">DocumentOptionsDropdown</div>
    ),
  })
);

vi.mock(
  "@/Components/user-dashboard/components/DocumentSortByDropdown.jsx",
  () => ({
    default: ({ updateStateFunction }) => (
      <button
        data-testid="sort-dropdown"
        onClick={() => updateStateFunction("updated_at")}
      >
        DocumentSortByDropdown
      </button>
    ),
  })
);

vi.mock(
  "@/Components/user-dashboard/components/UserProfileDropdown.jsx",
  () => ({
    default: () => <div data-testid="user-profile">UserProfileDropdown</div>,
  })
);

vi.mock("@/Scripts/persian-number-converter.js", () => ({
  toPersianDigit: (num) => `persian-${num}`,
}));

vi.mock("@/Scripts/persian-date-converter.js", () => ({
  toPersianDate: (date) => `persian-${date}`,
}));

vi.mock("@/Managers/user-dashboard-manager.js", () => ({
  createDocument: vi.fn().mockResolvedValue({ doc_uuid: "new-doc-uuid" }),
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children }) => <div>{children}</div>,
  useLoaderData: vi.fn(),
  useNavigate: vi.fn(),
}));

// Create a wrapper component to provide the QueryClient
const Wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("User Dashboard", () => {
  const mockDocuments = [
    {
      doc_uuid: "1",
      title: "Document 1",
      owner_name: "Me",
      updated_at: "2023-01-01T00:00:00Z",
      last_seen: "2023-01-02T00:00:00Z",
    },
    {
      doc_uuid: "2",
      title: "Document 2",
      owner_name: "Other",
      updated_at: "2023-01-03T00:00:00Z",
      last_seen: "2023-01-01T00:00:00Z",
    },
  ];

  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLoaderData.mockReturnValue(mockDocuments);
    useNavigate.mockReturnValue(mockNavigate);
    queryClient.clear();
  });

  it("renders the component with all main elements", () => {
    render(<UserDashboard />, { wrapper: Wrapper });

    expect(screen.getByTestId("icon-logo")).toBeInTheDocument();
    expect(screen.getByTestId("user-profile")).toBeInTheDocument();
    expect(screen.getByTestId("icon-search")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("جست و جو")).toBeInTheDocument();
    expect(screen.getByTestId("sort-dropdown")).toBeInTheDocument();
    expect(screen.getByText("ایجاد یک سند جدید")).toBeInTheDocument();
    expect(screen.getByTestId("icon-plus-fill")).toBeInTheDocument();
  });

  it("displays documents table when documents are available", () => {
    render(<UserDashboard />, { wrapper: Wrapper });

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(3); // header + 2 documents
    mockDocuments.forEach((doc) => {
      expect(screen.getByText(`persian-${doc.title}`)).toBeInTheDocument();
      expect(screen.getByText(`persian-${doc.last_seen}`)).toBeInTheDocument();
      expect(
        screen.getByText(doc.owner_name === "Me" ? "من" : "--")
      ).toBeInTheDocument();
    });
    expect(screen.getAllByTestId("document-options")).toHaveLength(
      mockDocuments.length
    );
  });

  it('shows "not found" message when no documents are available', () => {
    useLoaderData.mockReturnValue([]);
    render(<UserDashboard />, { wrapper: Wrapper });

    expect(screen.getByText("هیچ سندی برای شما یافت نشد")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("filters documents when searching", () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const searchInput = screen.getByPlaceholderText("جست و جو");
    const searchButton = screen.getByTestId("icon-search").parentElement;

    fireEvent.change(searchInput, { target: { value: "Document 1" } });
    fireEvent.click(searchButton);

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 document
    expect(screen.getByText("persian-Document 1")).toBeInTheDocument();
    expect(screen.queryByText("persian-Document 2")).not.toBeInTheDocument();
  });

  it("filters documents when pressing enter in search input", () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const searchInput = screen.getByPlaceholderText("جست و جو");

    fireEvent.change(searchInput, { target: { value: "Document 2" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(screen.getAllByRole("row")).toHaveLength(2); // header + 1 document
    expect(screen.getByText("persian-Document 2")).toBeInTheDocument();
    expect(screen.queryByText("persian-Document 1")).not.toBeInTheDocument();
  });

  it("shows appropriate not found message when search returns no results", () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const searchInput = screen.getByPlaceholderText("جست و جو");

    fireEvent.change(searchInput, { target: { value: "Non-existent" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(
      screen.getByText("هیچ سندی با این مشخصات برای شما یافت نشد")
    ).toBeInTheDocument();
  });

  it("changes sort field when sort dropdown is used", () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const sortButton = screen.getByTestId("sort-dropdown");

    fireEvent.click(sortButton);

    expect(screen.getByText("زمان آخرین تغییر")).toBeInTheDocument();
    mockDocuments.forEach((doc) => {
      expect(screen.getByText(`persian-${doc.title}`)).toBeInTheDocument();
      expect(screen.getByText(`persian-${doc.updated_at}`)).toBeInTheDocument();
      expect(
        screen.getByText(doc.owner_name === "Me" ? "من" : "--")
      ).toBeInTheDocument();
    });
  });

  it("creates a new document when create button is clicked", async () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const createButton = screen.getByText("ایجاد یک سند جدید").parentElement;

    fireEvent.click(createButton);

    await waitFor(() => {
      expect(createDocument).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/document/new-doc-uuid");
    });
  });

  it("navigates to document when row is clicked", () => {
    render(<UserDashboard />, { wrapper: Wrapper });
    const firstDocumentRow = screen.getAllByRole("row")[1];

    fireEvent.click(firstDocumentRow);

    expect(mockNavigate).toHaveBeenCalledWith(
      `/document/${mockDocuments[0].doc_uuid}`
    );
  });
});
