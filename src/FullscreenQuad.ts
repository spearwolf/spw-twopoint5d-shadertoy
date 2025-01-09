import { type Material, Mesh, PlaneGeometry } from "three/webgpu";

export class FullscreenQuad {
  readonly geometry: PlaneGeometry;
  readonly mesh: Mesh;

  set material(value: Material) {
    this.mesh.material = value;
  }

  get material(): Material {
    return this.mesh.material as Material;
  }

  constructor() {
    this.geometry = new PlaneGeometry(2, 2);
    this.mesh = new Mesh(this.geometry);
  }
}
