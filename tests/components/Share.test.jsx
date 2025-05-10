import { it, expect, describe, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import Share from "../../Components/Share";
import axios from "axios";

describe("Share General Tests", () => {
  vi.mock("axios");

  vi.mock("../path/to/CookieManager", () => ({
    LoadToken: () => "fake-token",
  }));

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
        profile_image: null,
      },
      access_level: "ReadOnly",
    },
    {
      user: {
        id: 2,
        username: "edituser",
        email: "edit@example.com",
        profile_image: null,
      },
      access_level: "Write",
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
          permission.access_level === "ReadOnly" ? "نظاره‌گر" : "ویراستار";
        expect(userCard).toHaveTextContent(expectedAccess);
      });
    });
  });
});

///////////////////////////////////////////////////

describe("Share User Interaction Tests", () => {
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

  beforeEach(() => {
    axios.get.mockReset();
    axios.get
      .mockResolvedValueOnce({ data: singleUserDoc })
      .mockResolvedValueOnce({ data: singleUserPermission });
    axios.post.mockResolvedValueOnce({});
  });

  it("should modify permissions on select change and submit", async () => {
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
              permission: "Write",
            },
          ],
        },
        expect.any(Object) // headers
      );
    });

    // Optionally assert that the modal was closed
    expect(onClose).toHaveBeenCalled();
  });

  it("allows searching and adding a new user", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const newUser = {
      user_id: 42,
      username: "searchuser",
      email: "search@example.com",
      profile_image: null,
    };

    const updatedPermissions = [
      ...singleUserPermission,
      {
        user: {
          id: 42,
          username: "searchuser",
          email: "search@example.com",
          profile_image: null,
        },
        access_level: "ReadOnly",
      },
    ];

    axios.get.mockReset();
    axios.get
      .mockResolvedValueOnce({ data: singleUserDoc })
      .mockResolvedValueOnce({ data: singleUserPermission })
      .mockResolvedValueOnce({ data: updatedPermissions });

    axios.post.mockReset();
    axios.post
      .mockResolvedValueOnce({ data: newUser })
      .mockResolvedValueOnce({});

    render(<Share onClose={onClose} doc_uuid="test-uuid" />);

    await waitFor(() => {
      expect(screen.getByText("singleuser")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/نام کاربری یا ایمیل/i);
    await user.type(searchInput, "search@example.com");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("searchuser")).toBeInTheDocument();
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/user_lookup/"),
      { email: "search@example.com" },
      expect.any(Object)
    );

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/set_permission/"),
      {
        document: 123,
        permissions: [
          {
            user: 42,
            permission: "ReadOnly",
          },
        ],
      },
      expect.any(Object)
    );
  });
});
