import { it, expect, describe, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import SelectBox from "../../../pages/Share/SelectBox";

describe("Select Box", () => {
  const permissionItems = [
    {
      user: {
        id: 0,
        username: "Mehran",
        email: "Mehran00@gmail.com",
        profile_image: "/api/v1/media/profile_images/mehran.jpeg",
      },
      access_level: "ReadOnly",
    },
    {
      user: {
        id: 1,
        username: "hamed",
        email: "www.hmdsdt@gmail.com",
        profile_image: "/api/v1/media/profile_images/hamed.jpeg",
      },
      access_level: "Writer",
    },
  ];

  const handlePermissionChange = vi.fn();

  it("should display writer user access level in mode 1 successfully", () => {
    render(
      <SelectBox
        mode="1"
        body=""
        permissionItem={permissionItems[1]}
        handlePermissionChange={handlePermissionChange}
      />
    );

    expect(screen.getByText("ویراستار")).toBeInTheDocument();
  });

  it("should display readonly user access level and allow changing in mode 1 successfully", async () => {
    render(
      <SelectBox
        mode="1"
        body=""
        permissionItem={permissionItems[0]}
        handlePermissionChange={handlePermissionChange}
      />,
      { container: document.body } // allow querying portal content
    );

    expect(screen.getByText("نظاره‌گر")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));

    const popup = within(document.body);
    const WriterOption = popup.getByText("ویراستار");

    await user.click(WriterOption);

    expect(handlePermissionChange).toHaveBeenCalledWith(
      permissionItems[0].user.id,
      "Writer"
    );
  });

  const setUserAccessLevel = vi.fn();

  it("should display document access level and allow changing  in mode 2 successfully", async () => {
    render(
      <SelectBox
        mode="2"
        userAccessLevel="view"
        setUserAccessLevel={setUserAccessLevel}
      />,
      { container: document.body }
    );

    expect(screen.getByText("مشاهده")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));
    const popup = within(document.body);
    await user.click(popup.getByText("ویرایش"));

    expect(setUserAccessLevel).toHaveBeenCalledWith("edit", expect.anything());
  });
});
