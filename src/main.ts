import "./style.css";

import { App } from "./App";
import { FullscreenQuad } from "./FullscreenQuad";

const app = new App(document.getElementById("demo")!);

app.start(({ display }) => {
    const quad = new FullscreenQuad();

    app.scene.add(quad.mesh);

    Object.assign(window, { display, quad }); // just for debugging
});
