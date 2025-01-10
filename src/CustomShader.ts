import { on } from "@spearwolf/eventize";
import { Display } from "@spearwolf/twopoint5d";
import { ShaderNodeFn } from "three/src/nodes/TSL.js";
import {
  abs,
  color,
  cos,
  exp,
  float,
  Fn,
  fract,
  uv as geometryUV,
  length,
  pow,
  ShaderNodeObject,
  sin,
  uniform,
  vec2,
  vec3,
  vec4,
} from "three/tsl";
import { DoubleSide, MeshBasicNodeMaterial, UniformNode } from "three/webgpu";
import { ShadertoyRuntime } from "./ShadertoyRuntime";

// https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language
// https://webglfundamentals.org/webgl/lessons/webgl-shadertoy.html

export class CustomShader extends ShadertoyRuntime {
  readonly material: MeshBasicNodeMaterial = new MeshBasicNodeMaterial({
    side: DoubleSide,
  });

  readonly aspectRatio: ShaderNodeObject<UniformNode<number>>;
  // readonly pixelSize: ShaderNodeObject<UniformNode<Vector2>>;
  readonly palette: ShaderNodeFn<[any]>;

  constructor(display: Display) {
    super(display);

    // uniforms

    // this.pixelSize = uniform(new Vector2(display.width, display.height));
    this.aspectRatio = uniform(display.width / display.height);

    on(display, "resize", ({ width, height }) => {
      this.aspectRatio.value = width / height;
      // this.pixelSize.value.set(width, height);
    });

    // http://dev.thi.ng/gradients/

    this.palette = Fn(([t = this.iTime]) => {
      const coefficients = [
        [0.658, 0.5, 0.5],
        [0.228, 0.5, 0.5],
        [1.0, 1.0, 1.0],
        [0.0, 0.333, 0.667],
      ];

      const a = vec3(...coefficients[0]);
      const b = vec3(...coefficients[1]);
      const c = vec3(...coefficients[2]);
      const d = vec3(...coefficients[3]);

      const x = 6.28318 * 0.5;

      return a.add(b.mul(cos(c.mul(t).add(d).mul(x))));
    });

    // https://www.youtube.com/watch?v=f4s1h2YETNY

    let finalColor = vec3(0, 0, 0);

    const frag = geometryUV().mul(3).sub(1.5);
    let uv = vec2(this.aspectRatio.mul(frag.x), frag.y);
    const uv0 = vec2(uv);

    //  [-1,1]-------[1,1]
    //    |      |      |
    //    |----[0,0]----|
    //    |      |      |
    // [1,-1]-------[-1,-1]

    const LOOP = 3;

    for (let i = 0; i < LOOP; i++) {
      uv = fract(uv.mul(1.5)).sub(0.5);

      const d = length(uv).mul(exp(length(uv0).mul(-1)));

      const col = this.palette(
        length(uv0).add(this.iTime.mul(0.05)).add(float(i).mul(0.3))
      );

      const d1 = abs(sin(d.mul(9).add(this.iTime.mul(0.575))).div(8));
      const d2 = pow(float(0.015).div(d1), 2.0);

      finalColor = finalColor.add(col.mul(d2).div(LOOP));
    }

    this.material.colorNode = color(vec4(finalColor, 1));
  }
}
