import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import ServiceItem from "../../../pages/Landing/ServiceItem";

describe("Service Item", () => {
  it("should generate html elements successfully", () => {
    render(
      <ServiceItem
        scale={1}
        pic="img.jpg"
        title="عنوان"
        alt="جایگزین"
        desc="توضیحات"
      />
    );

    expect(screen.getByText("عنوان")).toHaveRole("heading").toBeInTheDocument();
    expect(screen.getByText("توضیحات"))
      .toHaveRole("paragraph")
      .toBeInTheDocument();
    const image = screen.getByAltText("جایگزین");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "img.jpg");
  });
});
