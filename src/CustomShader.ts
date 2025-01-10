import { on } from "@spearwolf/eventize";
import { Display } from "@spearwolf/twopoint5d";
import {
  abs,
  color,
  fract,
  length,
  ShaderNodeObject,
  step,
  uniform,
  uv,
  vec2,
  vec4,
} from "three/tsl";
import {
  DoubleSide,
  MeshBasicNodeMaterial,
  UniformNode,
  Vector2,
} from "three/webgpu";
import { ShadertoyRuntime } from "./ShadertoyRuntime";

// https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
// https://webglfundamentals.org/webgl/lessons/webgl-shadertoy.html

export class CustomShader extends ShadertoyRuntime {
  readonly material: MeshBasicNodeMaterial = new MeshBasicNodeMaterial({
    side: DoubleSide,
  });

  readonly aspectRatio: ShaderNodeObject<UniformNode<number>>;
  readonly pixelSize: ShaderNodeObject<UniformNode<Vector2>>;

  constructor(display: Display) {
    super(display);

    // uniforms

    this.pixelSize = uniform(new Vector2(display.width, display.height));
    this.aspectRatio = uniform(display.width / display.height);

    on(display, "resize", ({ width, height }) => {
      this.aspectRatio.value = width / height;
      this.pixelSize.value.set(width, height);
    });

    //

    const _uv = uv().mul(2).sub(1);
    const fragCoord = vec2(this.aspectRatio.mul(_uv.x), _uv.y);

    //  [-1,1]-------[1,1]
    //    |      |      |
    //    |----[0,0]----|
    //    |      |      |
    // [1,-1]-------[-1,-1]

    const d = step(0.1, abs(length(fragCoord).sub(0.5)));

    this.material.colorNode = color(
      vec4(d.sub(fract(abs(fragCoord.x))), d.sub(fract(abs(fragCoord.y))), d, 1)
    );
  }
}
