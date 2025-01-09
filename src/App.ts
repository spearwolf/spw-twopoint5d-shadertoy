import { on, Priority } from "@spearwolf/eventize";
import { Display } from "@spearwolf/twopoint5d";
import { Color, OrthographicCamera, Scene } from "three";

export class App extends Display {
    scene: Scene;
    camera: OrthographicCamera;

    constructor(...args: ConstructorParameters<typeof Display>) {
        super(...args);

        this.scene = new Scene();
        this.scene.name = "App";

        this.camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
        this.camera.position.z = 10;

        this.renderer!.setClearColor(new Color(0x000000), 0.0);

        on(this, "frame", Priority.Low, ({ renderer, scene, camera }) => {
            renderer.render(scene, camera);
        });
    }

    override getEventArgs() {
        return {
            ...super.getEventArgs(),
            scene: this.scene,
            camera: this.camera,
        };
    }
}
