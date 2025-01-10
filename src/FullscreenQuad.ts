import { type Material, Mesh, PlaneGeometry } from "three/webgpu";

export class FullscreenQuad {
  #width: number;
  #height: number;

  geometry: PlaneGeometry;
  readonly mesh: Mesh;

  set material(value: Material) {
    this.mesh.material = value;
  }

  get material(): Material {
    return this.mesh.material as Material;
  }

  constructor(width = 100, height = 100) {
    this.#width = width;
    this.#height = height;

    this.geometry = new PlaneGeometry(width, height);
    this.mesh = new Mesh(this.geometry);
  }

  resize(width: number, height: number) {
    if (width === this.#width && height === this.#height) {
      return;
    }

    this.#width = width;
    this.#height = height;

    this.geometry.dispose();
    this.geometry = new PlaneGeometry(width, height);

    this.mesh.geometry = this.geometry;
  }
}
