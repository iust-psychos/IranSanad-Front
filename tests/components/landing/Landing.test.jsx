import { it, expect, describe, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Landing from "../../../pages/Landing";
import { MemoryRouter } from "react-router-dom";

class IntersectionObserverMock {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.targets = new Set();
  }
  observe(target) {
    this.targets.add(target);
    this.callback([
      {
        isIntersecting: true,
        intersectionRatio: 1,
        target,
      },
    ]);
  }
  unobserve(target) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
  }
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
});

const resizeWindow = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event("resize"));
};

describe("Landing", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Landing />
      </MemoryRouter>
    );
  });

  it("should display headings texts successfully", () => {
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
    expect(headings.some((h) => /خدمات/.test(h.textContent))).toBe(true);
    expect(headings.some((h) => /ثبت نام/.test(h.textContent))).toBe(true);
    expect(headings.some((h) => /ارتباط/.test(h.textContent))).toBe(true);
    expect(headings.some((h) => /لینک/.test(h.textContent))).toBe(true);
  });

  it("changes isMobile state when window is resized", () => {
    resizeWindow(500);
    resizeWindow(1024);
  });
});
