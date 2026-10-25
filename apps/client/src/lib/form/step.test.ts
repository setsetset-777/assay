import { describe, it, expect } from "vitest";
import { deriveFromStepId, resolveStepIndex } from "./step";

describe("resolveStepIndex", () => {
  it("returns steps length if is success", () => {
    const index = resolveStepIndex({
      steps: [{ id: "a" }, { id: "b" }],
      stepId: "z",
      isSuccess: true,
    });
    expect(index).toBe(2);
  });

  it("returns -1 if stepId is undefined", () => {
    const index = resolveStepIndex({
      steps: [{ id: "a" }, { id: "b" }],
      stepId: undefined,
      isSuccess: false,
    });
    expect(index).toBe(-1);
  });

  it("returns index by id", () => {
    const index = resolveStepIndex({
      steps: [{ id: "a" }, { id: "b" }],
      stepId: "b",
      isSuccess: false,
    });
    expect(index).toBe(1);
  });

  describe("by postion", () => {
    it("returns index", () => {
      const index = resolveStepIndex({
        steps: [{}, {}, {}],
        stepId: "3",
        isSuccess: false,
      });
      expect(index).toBe(2);
    });

    it("returns -1 if position is not a number", () => {
      const index = resolveStepIndex({
        steps: [{}, {}, {}],
        stepId: "foo",
        isSuccess: false,
      });
      expect(index).toBe(-1);
    });

    it("returns -1 if position is inferior to 0", () => {
      const index = resolveStepIndex({
        steps: [{}, {}, {}],
        stepId: "-3",
        isSuccess: false,
      });
      expect(index).toBe(-1);
    });

    it("returns -1 if position is superior to steps length", () => {
      const index = resolveStepIndex({
        steps: [{}, {}, {}],
        stepId: "5",
        isSuccess: false,
      });
      expect(index).toBe(-1);
    });
  });
});

describe("deriveFromStepIndex", () => {
  it("returns step", () => {
    const { step } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
      stepId: "b",
      isSuccess: false,
    });
    expect(step).toEqual({ id: "b" });
  });

  it("returns totalSteps", () => {
    const { totalSteps } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
      stepId: "a",
      isSuccess: false,
    });
    expect(totalSteps).toBe(3);
  });

  describe("isFirst", () => {
    it("returns true if first", () => {
      const { isFirst } = deriveFromStepId({
        steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
        stepId: "a",
        isSuccess: false,
      });
      expect(isFirst).toBeTruthy();
    });

    it("returns false if not first", () => {
      const { isFirst } = deriveFromStepId({
        steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
        stepId: "b",
        isSuccess: false,
      });
      expect(isFirst).toBeFalsy();
    });
  });

  describe("isLast", () => {
    it("returns true if last", () => {
      const { isLast } = deriveFromStepId({
        steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
        stepId: "c",
        isSuccess: false,
      });
      expect(isLast).toBeTruthy();
    });

    it("returns false if not last", () => {
      const { isLast } = deriveFromStepId({
        steps: [{ id: "a" }, { id: "b" }, { id: "c" }],
        stepId: "b",
        isSuccess: false,
      });
      expect(isLast).toBeFalsy();
    });
  });

  it("returns nextStep", () => {
    const { nextStep } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      stepId: "b",
      isSuccess: false,
    });
    expect(nextStep).toEqual({ id: "c" });
  });

  it("returns nextStepId", () => {
    const { nextStepId } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      stepId: "b",
      isSuccess: false,
    });
    expect(nextStepId).toBe("c");
  });

  it("returns previousStep", () => {
    const { previousStep } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      stepId: "c",
      isSuccess: false,
    });
    expect(previousStep).toEqual({ id: "b" });
  });

  it("returns previousStepId", () => {
    const { previousStepId } = deriveFromStepId({
      steps: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
      stepId: "c",
      isSuccess: false,
    });
    expect(previousStepId).toBe("b");
  });
});
