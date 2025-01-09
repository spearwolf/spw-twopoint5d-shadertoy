import "./style.css";

import { App } from "./App";
import { CustomShader } from "./CustomShader";
import { FullscreenQuad } from "./FullscreenQuad";

const app = new App(document.getElementById("demo")!);

app.start(({ display }) => {
  const quad = new FullscreenQuad();
  const shader = new CustomShader();

  quad.material = shader.material;
  app.scene.add(quad.mesh);

  Object.assign(window, { display, quad, shader }); // just for debugging
});
