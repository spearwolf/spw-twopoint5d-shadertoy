import { Display } from "@spearwolf/twopoint5d";
import { color, fract, screenUV, vec2, vec4 } from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";
import { ShadertoyRuntime } from "./ShadertoyRuntime";

// https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
// https://webglfundamentals.org/webgl/lessons/webgl-shadertoy.html

export class CustomShader extends ShadertoyRuntime {
  readonly material: MeshBasicNodeMaterial = new MeshBasicNodeMaterial();

  constructor(display: Display) {
    super(display);

    // vec2 uv = (fragCoord * 2. - iResolution.xy) / iResolution.y;

    const fragCoord = vec2(screenUV.x, screenUV.y);

    const uv = fract(fragCoord.xy.div(0.2));

    this.material.colorNode = color(vec4(uv.xy, 0, 1));
  }
}
