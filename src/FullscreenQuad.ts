import { FrontSide, Mesh, MeshBasicMaterial, PlaneGeometry } from "three";

export class FullscreenQuad {
    readonly geometry: PlaneGeometry;
    readonly material: MeshBasicMaterial;
    readonly mesh: Mesh;

    constructor() {
        this.geometry = new PlaneGeometry(2, 2);
        this.material = new MeshBasicMaterial({
            color: 0xff0066,
            side: FrontSide,
        });
        this.mesh = new Mesh(this.geometry, this.material);
    }
}
