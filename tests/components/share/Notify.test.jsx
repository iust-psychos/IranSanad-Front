import { it, expect, describe, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { showErrorToast } from "@/utils/Toast";
import Notify from "../../../pages/Share/Notify";

vi.mock("axios");

vi.mock("@/utils/Toast", () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

vi.mock("./SelectBox", () => ({
  __esModule: true,
  default: ({ setUserAccessLevel, userAccessLevel }) => (
    <select
      data-testid="selectbox"
      value={userAccessLevel}
      onChange={(e) => setUserAccessLevel(e.target.value)}
    >
      <option value="ReadOnly">ReadOnly</option>
      <option value="Edit">Edit</option>
    </select>
  ),
}));

describe("Notify", () => {
  const doc = {
    id: 15,
    doc_uuid: "56a33d45-586b-4634-a7bc-1cf47b038700",
    title: "title",
    owner: 1,
    owner_name: "owner",
    created_at: "2025-08-07T15:55:04.658731+03:30",
    updated_at: "2025-08-08T14:56:22.403931+03:30",
    link: "link",
    is_public: false,
    last_seen: null,
  };
  const users = "user2, user3";
  const _users = users.replace(/\s+/g, "").split(",");
  const permissionList = [
    {
      user: {
        id: 1,
        username: "user1",
        email: "email1@gmail.com",
        profile_image: "/api/v1/media/profile_images/erfan.jpeg",
      },
      access_level: "Owner",
    },
    {
      user: {
        id: 4,
        username: "user4",
        email: "www.email4@gmail.com",
        profile_image: "/api/v1/media/profile_images/hamed.jpeg",
      },
      access_level: "Writer",
    },
    {
      user: {
        id: 5,
        username: "user5",
        email: "email5@yahoo.com",
        profile_image: "/api/v1/media/profile_images/hamed.jpeg",
      },
      access_level: "ReadOnly",
    },
  ];

  const defaultProps = {
    doc: doc,
    users: users,
    onClose: vi.fn(),
    permissionList: permissionList,
    setPermissionList: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display text content successfully", () => {
    render(<Notify {...defaultProps} />);

    expect(screen.getByText("هم‌رسانی سند")).toBeInTheDocument();
    expect(screen.getByText("به افراد اطلاع داده شود")).toBeInTheDocument();
    expect(
      screen.getByLabelText("به افراد اطلاع داده شود")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "تایید" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "لغو" })).toBeInTheDocument();

    for (const user of _users) {
      expect(screen.getByDisplayValue(user)).toBeInTheDocument();
    }
  });

  it("should toggle notify checkbox and shows textarea", async () => {
    render(<Notify {...defaultProps} />);

    const checkbox = screen.getByRole("checkbox", {
      name: "به افراد اطلاع داده شود",
    });
    expect(checkbox).not.toBeChecked();

    const user = userEvent.setup();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(
      screen.getByPlaceholderText("متن ایمیل ارسالی را مشخص کنید...")
    ).toBeInTheDocument();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(
      screen.queryByPlaceholderText("متن ایمیل ارسالی را مشخص کنید...")
    ).not.toBeInTheDocument();
  });

  it("should add new valid users successfully", async () => {
    axios.post
      .mockResolvedValueOnce({ data: { user_id: 2 } }) // checkValidUserAPI
      .mockResolvedValueOnce({}) // postPermissionsAPI
      .mockResolvedValueOnce({}); // second user
    axios.get.mockResolvedValueOnce({ data: ["updatedPermission"] });

    render(<Notify {...defaultProps} />);

    const user = userEvent.setup();
    user.click(screen.getByRole("button", { name: "تایید" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(defaultProps.setPermissionList).toHaveBeenCalledWith([
        "updatedPermission",
      ]);
    });
  });

  it("should show error on adding invalid users", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: { error: "Invalid user email" },
      },
    });

    render(<Notify {...defaultProps} />);

    const user = userEvent.setup();
    user.click(screen.getByRole("button", { name: "تایید" }));
    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith("خطا در اضافه کردن کاربران");
    });
  });

  it("should prevent adding already added users", async () => {
    const props = {
      ...defaultProps,
      users: "user1",
    };

    render(<Notify {...props} />);

    await waitFor(() => {
      expect(showErrorToast).toHaveBeenCalledWith(
        expect.stringContaining("قبلاً اضافه شده است")
      );
    });
  });
});
