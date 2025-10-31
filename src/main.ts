import "./style.css";

import { on } from "@spearwolf/eventize";
import { App } from "./App";
import { CustomShader } from "./CustomShader";
// import { FullscreenCube } from "./FullscreenCube.ts";
import { FullscreenQuad } from "./FullscreenQuad.ts";
// import { FullscreenIcosahedron } from "./FullscreenIcosahedron.ts";

const app = new App(document.getElementById("demo")!);

app.start(({ display }) => {
  // const thing = new FullscreenIcosahedron(10);
  const thing = new FullscreenQuad();
  // const thing = new FullscreenCube();

  on(display, "resize", ({ width, height }) => {
    const aspect = width / height;
    if (aspect < 1) {
      thing.mesh.scale.set(1, height / width, 1);
    } else {
      thing.mesh.scale.set(aspect, 1, 1);
    }
  });

  const shader = new CustomShader(display);

  thing.material = shader.material;
  app.scene.add(thing.mesh);

  Object.assign(window, { display, thing, shader }); // just for debugging
});
