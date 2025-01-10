import "./style.css";

import { on } from "@spearwolf/eventize";
import { App } from "./App";
import { CustomShader } from "./CustomShader";
import { FullscreenQuad } from "./FullscreenQuad";

const app = new App(document.getElementById("demo")!);

app.start(({ display }) => {
  const quad = new FullscreenQuad();

  on(display, "resize", ({ width, height }) => {
    const aspect = width / height;
    if (aspect < 1) {
      quad.mesh.scale.set(1, height / width, 1);
    } else {
      quad.mesh.scale.set(aspect, 1, 1);
    }
  });

  const shader = new CustomShader(display);

  quad.material = shader.material;
  app.scene.add(quad.mesh);

  Object.assign(window, { display, quad, shader }); // just for debugging
});
