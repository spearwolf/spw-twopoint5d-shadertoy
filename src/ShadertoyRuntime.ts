import { on } from "@spearwolf/eventize";
import { Display } from "@spearwolf/twopoint5d";
import { ShaderNodeObject, uniform } from "three/tsl";
import { UniformNode, Vector3 } from "three/webgpu";

// shadertoy runtime variables
// ---------------------------
// uniform vec3      iResolution;           // viewport resolution (in pixels)
// uniform float     iTime;                 // shader playback time (in seconds)
// uniform float     iTimeDelta;            // render time (in seconds)
// uniform float     iFrameRate;            // shader frame rate
// uniform int       iFrame;                // shader playback frame
// uniform float     iChannelTime[4];       // channel playback time (in seconds)
// uniform vec3      iChannelResolution[4]; // channel resolution (in pixels)
// uniform vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
// uniform samplerXX iChannel0..3;          // input channel. XX = 2D/Cube
// uniform vec4      iDate;                 // (year, month, day, time in seconds)

export class ShadertoyRuntime {
  readonly iResolution: ShaderNodeObject<UniformNode<Vector3>>;
  readonly iTime: ShaderNodeObject<UniformNode<number>>;
  readonly iTimeDelta: ShaderNodeObject<UniformNode<number>>;

  constructor(public readonly display: Display) {
    // uniform vec3 iResolution --- viewport resolution (in pixels)

    this.iResolution = uniform(new Vector3(display.width, display.height, 1));

    on(display, "resize", ({ width, height }) => {
      this.iResolution.value.set(width, height, 1);
    });

    // uniform vec3 iTime --- shader playback time (in seconds)

    this.iTime = uniform(display.now);

    this.iTime.onFrameUpdate(() => {
      this.iTime.value = display.now;
    });

    // uniform vec3 iTimeDelta --- render time (in seconds)

    this.iTimeDelta = uniform(display.deltaTime);

    this.iTimeDelta.onFrameUpdate(() => {
      this.iTimeDelta.value = display.deltaTime;
    });
  }
}
