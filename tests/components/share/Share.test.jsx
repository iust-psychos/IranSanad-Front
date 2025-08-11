import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { showSuccessToast } from "@/utils/Toast";
import Share from "../../../pages/Share/index";
import axios from "axios";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

vi.mock("@/utils/Toast", () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock("../path/CookieManager", () => ({
  LoadToken: () => "fake-token",
}));

describe("Share", () => {
  vi.mock("axios");

  const mockDocument = {
    id: 123,
    title: "Test Doc",
    is_public: false,
    link: "https://example.com/doc-link",
  };

  const mockPermissions = [
    {
      user: {
        id: 1,
        username: "readuser",
        email: "read@example.com",
        profile_image: "sample",
      },
      access_level: "Owner",
    },
    {
      user: {
        id: 2,
        username: "edituser",
        email: "edit@example.com",
        profile_image: null,
      },
      access_level: "Writer",
    },
    {
      user: {
        id: 3,
        username: "edit2user",
        email: "edit2@example.com",
        profile_image: null,
      },
      access_level: "ReadOnly",
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockDocument });
    axios.get.mockResolvedValueOnce({ data: mockPermissions });
    axios.post.mockResolvedValueOnce({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading before fetched", () => {
    render(<Share onClose={() => {}} doc_uuid="test-uuid" />);

    expect(screen.getByText(/بارگذاری/)).toBeInTheDocument();
  });

  it("should display plain headers", () => {
    render(<Share onClose={() => {}} doc_uuid="test-uuid" />);

    expect(
      screen.getByRole("heading", {
        name: "افراد دارای دسترسی",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "دسترسی عمومی",
      })
    ).toBeInTheDocument();
  });

  it("should display the document and the permissions when fetched", async () => {
    render(<Share onClose={vi.fn()} doc_uuid="test-uuid" />);

    await waitFor(() => {
      expect(screen.getByText(/اشتراک گذاری "Test Doc"/)).toBeInTheDocument();

      mockPermissions.forEach((permission) => {
        expect(screen.getByText(permission.user.username)).toBeInTheDocument();

        const userCard = screen
          .getByText(permission.user.username)
          .closest(".share-access-list-item");

        expect(userCard).toHaveTextContent(permission.user.email);

        const expectedAccess =
          permission.access_level === "Owner"
            ? "مالک"
            : permission.access_level === "ReadOnly"
            ? "نظاره‌گر"
            : "ویراستار";
        expect(userCard).toHaveTextContent(expectedAccess);
      });
    });
  });

  it("should render permissions user image correctly", async () => {
    render(<Share onClose={vi.fn()} doc_uuid="test-uuid" />);

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(1);
      expect(screen.getAllByTestId("FaUser-icon").length).equal(2);
    });
  });

  it("should copy link to clipboard on copy link successfully", async () => {
    const mockDocument = {
      link: "https://example.com/doc-link",
      name: "Test Doc",
    };

    axios.get.mockResolvedValueOnce({ data: mockDocument });

    const mockWriteText = vi.fn().mockResolvedValue();
    navigator.clipboard = { writeText: mockWriteText };

    render(<Share onClose={vi.fn()} doc_uuid="test-uuid" />);

    await waitFor(() => {
      expect(screen.getByText(/اشتراک گذاری "Test Doc"/)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /رونویس پیوند/ }));

    expect(mockWriteText).toHaveBeenCalledWith(mockDocument.link);
  });

  const singleUserDoc = {
    id: 123,
    title: "Single User Doc",
    is_public: false,
    link: "https://example.com/single-doc",
  };

  const singleUserPermission = [
    {
      user: {
        id: 5,
        username: "singleuser",
        email: "single@example.com",
        profile_image: null,
      },
      access_level: "ReadOnly",
    },
  ];

  it("should modify permissions on select change and submit", async () => {
    axios.get.mockReset();
    axios.get
      .mockResolvedValueOnce({ data: singleUserDoc })
      .mockResolvedValueOnce({ data: singleUserPermission });
    axios.post.mockResolvedValueOnce({});

    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Share onClose={onClose} doc_uuid="test-uuid" />);

    await waitFor(() => {
      expect(screen.getByText("singleuser")).toBeInTheDocument();
    });

    const selectTrigger = screen.getByTestId("permission-select-5");
    await user.click(selectTrigger);

    await user.click(screen.getByText("ویراستار"));

    const confirmButton = screen.getByRole("button", { name: /تایید/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/docs/permission/set_permission/"),
        {
          document: 123,
          permissions: [
            {
              user: 5,
              permission: "Writer",
            },
          ],
        },
        expect.any(Object) // headers
      );
    });

    expect(onClose).toHaveBeenCalled();
  });
});
