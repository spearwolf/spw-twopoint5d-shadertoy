import { color } from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";

export class CustomShader {
  readonly material: MeshBasicNodeMaterial;

  constructor() {
    this.material = new MeshBasicNodeMaterial();

    this.material.colorNode = color(0x204080);
  }
}
