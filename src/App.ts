import { on, once, Priority } from "@spearwolf/eventize";
import { Display, ParallaxProjection, Stage2D } from "@spearwolf/twopoint5d";
import { Color, NeutralToneMapping, PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class App extends Display {
  projection: ParallaxProjection;
  stage: Stage2D;
  controls?: OrbitControls;

  get scene(): Scene {
    return this.stage.scene;
  }

  get camera(): PerspectiveCamera {
    return this.stage.camera as PerspectiveCamera;
  }

  constructor(...args: ConstructorParameters<typeof Display>) {
    super(args[0], { ...(args[1] ?? {}), webgpu: true });

    this.projection = new ParallaxProjection("xy|bottom-left", {
      width: 100,
      height: 100,
      fit: "contain",
      distanceToProjectionPlane: 100,
      near: 0.1,
      far: 1000,
    });

    this.stage = new Stage2D(this.projection);
    this.stage.name = "App";

    once(this, "init", () => {
      this.renderer!.toneMapping = NeutralToneMapping;
      this.renderer!.setClearColor(new Color(0x000000), 0.0);

      this.controls = new OrbitControls(this.camera, this.renderer!.domElement);
      this.controls.enableDamping = true;

      on(this, "resize", ({ stage, width, height }) => {
        stage.resize(width, height);
      });

      on(
        this,
        "frame",
        Priority.Low,
        ({ stage, renderer, now, deltaTime, frameNo }) => {
          this.controls?.update();
          stage.renderFrame(renderer, now, deltaTime, frameNo);
        }
      );
    });
  }

  override getEventArgs() {
    return {
      ...super.getEventArgs(),
      stage: this.stage,
      scene: this.scene,
      camera: this.camera,
    };
  }
}
