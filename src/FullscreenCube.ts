import { BoxGeometry, type Material, Mesh, PlaneGeometry } from "three/webgpu";

export class FullscreenCube {
  geometry: PlaneGeometry;
  readonly mesh: Mesh;

  set material(value: Material) {
    this.mesh.material = value;
  }

  get material(): Material {
    return this.mesh.material as Material;
  }

  constructor(size = 100) {
    this.geometry = new BoxGeometry(size, size, size);
    this.mesh = new Mesh(this.geometry);
  }
}
