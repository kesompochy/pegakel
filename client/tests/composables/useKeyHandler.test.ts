vi.mock("vue", () => {
  return {
    onMounted: vi.fn((fn) => fn()),
    onUnmounted: vi.fn((fn) => fn()),
    reactive: vi.fn((obj) => obj),
  }
});

import { onMounted, onUnmounted } from 'vue';
import { useKeyHandler } from "~/composables/useKeyHandler";
import { Mock } from "vitest";

describe("useKeyHandler", () => {
  it("should add event listener when mounted", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    useKeyHandler({
      "moveLeft": () => {},
    });
    expect(onMounted).toHaveBeenCalled();
    expect(addEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
  it("should remove event listener when unmounted", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    useKeyHandler({
      "moveUp": () => {},
    });
    expect(onUnmounted).toHaveBeenCalled();
    const unmountedFn = (onUnmounted as Mock).mock.calls[0][0];
    unmountedFn();
    expect(removeEventListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });
});
