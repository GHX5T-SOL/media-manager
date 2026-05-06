import { describe, expect, it } from "vite-plus/test";

import { errorMessage } from "../error-message";

describe("errorMessage", () => {
  it("returns the .message of an Error instance", () => {
    expect(errorMessage(new Error("boom"), "fallback")).toBe("boom");
  });

  it("returns the .message of a non-Error object that has a string message", () => {
    expect(errorMessage({ message: "auth library error" }, "fallback")).toBe("auth library error");
  });

  it("returns the fallback when err is null", () => {
    expect(errorMessage(null, "fallback")).toBe("fallback");
  });

  it("returns the fallback when err is undefined", () => {
    expect(errorMessage(undefined, "fallback")).toBe("fallback");
  });

  it("returns the fallback for primitives", () => {
    expect(errorMessage("string error", "fallback")).toBe("fallback");
    expect(errorMessage(42, "fallback")).toBe("fallback");
  });

  it("returns the fallback when .message is not a string", () => {
    expect(errorMessage({ message: 42 }, "fallback")).toBe("fallback");
    expect(errorMessage({ message: null }, "fallback")).toBe("fallback");
  });

  it("returns the fallback when the object has no message property", () => {
    expect(errorMessage({ code: "ENOENT" }, "fallback")).toBe("fallback");
  });

  it("preserves a subclassed Error's message", () => {
    class CustomError extends Error {}
    expect(errorMessage(new CustomError("custom"), "fallback")).toBe("custom");
  });
});
