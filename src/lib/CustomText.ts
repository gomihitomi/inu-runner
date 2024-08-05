import { Text, TextStyle, TextStyleOptions } from "pixi.js";

export default class CustomText extends Text {
  setText(text: string) {
    this.text = text;
    return this;
  }
  setCenter() {
    this.anchor.set(0.5);
    return this;
  }
  setAnchor(x?: number, y?: number) {
    this.anchor.set(x, y);
    return this;
  }
  styleLarge(style?: TextStyle | TextStyleOptions) {
    const defaultStyle: TextStyle | TextStyleOptions = {
      fill: "#fff",
      fontSize: 90,
      fontWeight: "900",
      stroke: { color: "#000", width: 9, join: "round" },
      dropShadow: {
        angle: Math.PI / 2,
        distance: 2,
      },
    };
    this.style = {
      ...defaultStyle,
      ...style,
    };
    return this;
  }
  styleSmall(style?: TextStyle | TextStyleOptions) {
    const defaultStyle: TextStyle | TextStyleOptions = {
      fill: "#fff",
      fontSize: 45,
      fontWeight: "900",
      stroke: { color: "#000", width: 7, join: "round" },
      dropShadow: {
        angle: Math.PI / 2,
        distance: 2,
      },
    };
    this.style = {
      ...defaultStyle,
      ...style,
    };
    return this;
  }
}
