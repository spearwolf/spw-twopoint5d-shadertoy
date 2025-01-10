import { on } from "@spearwolf/eventize";
import { Display } from "@spearwolf/twopoint5d";
import { ShaderNodeFn } from "three/src/nodes/TSL.js";
import {
  abs,
  color,
  cos,
  float,
  Fn,
  fract,
  length,
  ShaderNodeObject,
  sin,
  uniform,
  uv,
  vec2,
  vec3,
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
  readonly palette: ShaderNodeFn<[any]>;

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

    this.palette = Fn(([t = this.iTime]) => {
      // http://dev.thi.ng/gradients/

      const coefficients = [
        [0.658, 0.5, 0.5],
        [0.228, 0.5, 0.5],
        [1.0, 1.0, 1.0],
        [0.0, 0.333, 0.667],
      ];

      const x = 6.28318 / 2;

      const a = vec3(...coefficients[0]);
      const b = vec3(...coefficients[1]);
      const c = vec3(...coefficients[2]);
      const d = vec3(...coefficients[3]);

      return a.add(b.mul(cos(c.mul(t).add(d).mul(x))));
    });

    //

    const _uv = uv().mul(2).sub(1);
    const fragCoord = vec2(this.aspectRatio.mul(_uv.x), _uv.y);

    //  [-1,1]-------[1,1]
    //    |      |      |
    //    |----[0,0]----|
    //    |      |      |
    // [1,-1]-------[-1,-1]

    const coords = fract(fragCoord.mul(2)).sub(0.5);

    const d = length(coords);

    const col = this.palette(length(fragCoord).add(this.iTime.div(3)));

    const e = abs(sin(d.mul(8).add(this.iTime)).div(8));

    const x = float(0.007).div(e);

    this.material.colorNode = color(vec4(col.mul(x), 1));
  }
}
