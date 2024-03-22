import SpriteCanvas from "~/components/SpriteEditor/SpriteCanvas.vue";
import { shallowMount } from "@vue/test-utils";

describe("SpriteCanvas", () => {
	it("should have a canvas", () => {
		const wrapper = shallowMount(SpriteCanvas);
		expect(wrapper.find("canvas").exists()).toBe(true);
	});
});
