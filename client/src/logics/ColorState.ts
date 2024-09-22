import ColorState from "~/core/ColorState";

const toHex = (value: number): string => {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, "0");
};
const createEmptyColorState = (): ColorState => {
  const colorState = new ColorState();
  return colorState;
}

export default {
  getHex(colorState: ColorState): string {
    return `#${toHex(colorState.r)}${toHex(colorState.g)}${toHex(colorState.b)}`;
  },
  createEmptyColorState,
};
