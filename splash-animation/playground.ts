import { TitleAnim } from "./titleAnim.ts";

const container = document.getElementById("app");

if (!container) {
  throw new Error("Missing #app container");
}

// start animation
new TitleAnim(container);