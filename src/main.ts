import "./style.css";

import { on } from "@spearwolf/eventize";
import { App } from "./App";
import { CustomShader } from "./CustomShader";
import { FullscreenCube } from "./FullscreenCube.ts";

const app = new App(document.getElementById("demo")!);

app.start(({ display }) => {
  // const quad = new FullscreenQuad();
  const cube = new FullscreenCube();

  on(display, "resize", ({ width, height }) => {
    const aspect = width / height;
    if (aspect < 1) {
      cube.mesh.scale.set(1, height / width, 1);
    } else {
      cube.mesh.scale.set(aspect, 1, 1);
    }
  });

  const shader = new CustomShader(display);

  cube.material = shader.material;
  app.scene.add(cube.mesh);

  Object.assign(window, { display, cube, shader }); // just for debugging
});
