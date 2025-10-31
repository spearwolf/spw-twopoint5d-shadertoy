import { IcosahedronGeometry, type Material, Mesh } from "three/webgpu";

export class FullscreenIcosahedron {
  geometry: IcosahedronGeometry;
  readonly mesh: Mesh;

  set material(value: Material) {
    this.mesh.material = value;
  }

  get material(): Material {
    return this.mesh.material as Material;
  }

  constructor(radius = 100, detail = 3) {
    this.geometry = new IcosahedronGeometry(radius, detail);
    this.mesh = new Mesh(this.geometry);
  }
}

