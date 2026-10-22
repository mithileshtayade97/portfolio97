import React, { useEffect, useRef } from 'react';

export const DEFAULT_PORTRAIT_SRC = '/images/mithilesh-signal.png';

interface SignalPortraitProps {
  className?: string;
  alt?: string;
}

export const SignalPortrait: React.FC<SignalPortraitProps> = ({
  className = '',
  alt = 'Mithilesh Tayade portrait',
}) => {
  return (
    <img
      src={DEFAULT_PORTRAIT_SRC}
      alt={alt}
      className={className}
      fetchPriority="high"
      decoding="async"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center top',
        display: 'block',
        filter: 'grayscale(1)',
      }}
    />
  );
};

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram | null {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

// Verbatim GLSL shaders from chunk-1ek.js (e6 & e8)
const HERO_VERTEX_SHADER = `
attribute vec3 position;
attribute vec3 aColor;
attribute float aSeed;
uniform float uTime;
uniform float uProgress;
uniform float uScale;
uniform float uDpr;
uniform float uAspect;
uniform float uPosY;
uniform float uRotY;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float p = smoothstep(0.02, 0.8, uProgress);
  vec3 target = vec3(
    (aSeed - 0.5) * 2.5,
    sin(aSeed * 25.1327) * 0.055 + (floor(position.x * 4.0 + 2.0) - 2.0) * 0.18,
    sin(aSeed * 18.0) * 0.1
  );
  vec3 pos = mix(position, target, p);
  float edge = smoothstep(0.18, 0.5, abs(position.x));
  pos.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.008 * (edge + p);
  pos.z += sin(aSeed * 64.0 + uTime * 0.2) * 0.015;

  vec3 scaled = pos * uScale;
  float c = cos(uRotY);
  float s = sin(uRotY);
  vec3 mv = vec3(
    scaled.x * c + scaled.z * s,
    scaled.y + uPosY,
    -scaled.x * s + scaled.z * c - 6.0
  );
  float f = 1.0 / tan(0.3665191429);
  gl_Position = vec4(
    (mv.x * f) / uAspect,
    mv.y * f,
    (mv.z * 1000.1 + 200.0) / -999.9,
    -mv.z
  );
  gl_PointSize = (1.15 + dot(aColor, vec3(0.299, 0.587, 0.114)) * 0.9) * uDpr;
  vColor = mix(aColor, vec3(0.88, 0.86, 0.82), p * 0.45);
  vAlpha = (1.0 - p * 0.35) * smoothstep(0.5, 0.36, abs(position.y));
}
`;

const HERO_FRAGMENT_SHADER = `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.27, d) * vAlpha;
  if (alpha < 0.025) discard;
  gl_FragColor = vec4(vColor * 1.25, alpha);
}
`;

interface HeroPortraitSceneProps {
  motionOn: boolean;
  onReadyChange?: (ready: boolean) => void;
}

/**
 * Exact implementation of the reference site's WebGL point-cloud scene (chunk-1ek.js).
 */
export const HeroPortraitScene: React.FC<HeroPortraitSceneProps> = ({
  motionOn,
  onReadyChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!motionOn) {
      onReadyChange?.(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null);

    if (!gl) {
      onReadyChange?.(false);
      return;
    }

    const program = createProgram(gl, HERO_VERTEX_SHADER, HERO_FRAGMENT_SHADER);
    if (!program) {
      onReadyChange?.(false);
      return;
    }

    let cancelled = false;
    let pointCount = 0;
    const posBuf = gl.createBuffer();
    const colBuf = gl.createBuffer();
    const seedBuf = gl.createBuffer();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const n = window.innerWidth < 700 ? 180 : 300;
        const l = Math.round(1.25 * n);
        const off = document.createElement('canvas');
        off.width = n;
        off.height = l;
        const ctx = off.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, n, l);
        const { data } = ctx.getImageData(0, 0, n, l);

        const u: number[] = [];
        const c: number[] = [];
        const f: number[] = [];

        for (let e = 0; e < l; e++) {
          for (let t = 0; t < n; t++) {
            const r = (e * n + t) * 4;
            const a = (0.299 * data[r] + 0.587 * data[r + 1] + 0.114 * data[r + 2]) / 255;
            if (a < 0.035) continue;
            u.push((t / n - 0.5) * 0.8, 0.5 - e / l, 0.025 * a);
            c.push(a, a, a);
            f.push(((127 * t + 311 * e) % 997) / 997);
          }
        }

        pointCount = u.length / 3;

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(u), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(c), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(f), gl.STATIC_DRAW);

        onReadyChange?.(true);
      } catch {
        onReadyChange?.(false);
      }
    };
    img.onerror = () => onReadyChange?.(false);
    img.src = DEFAULT_PORTRAIT_SRC;

    const posLoc = gl.getAttribLocation(program, 'position');
    const colLoc = gl.getAttribLocation(program, 'aColor');
    const seedLoc = gl.getAttribLocation(program, 'aSeed');

    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uProgressLoc = gl.getUniformLocation(program, 'uProgress');
    const uScaleLoc = gl.getUniformLocation(program, 'uScale');
    const uDprLoc = gl.getUniformLocation(program, 'uDpr');
    const uAspectLoc = gl.getUniformLocation(program, 'uAspect');
    const uPosYLoc = gl.getUniformLocation(program, 'uPosY');
    const uRotYLoc = gl.getUniformLocation(program, 'uRotY');

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const fallbackBounds = { height: 800, top: 60 };

    const measure = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      const el = document.querySelector('.artifact-fallback');
      if (el) {
        const rect = el.getBoundingClientRect();
        const backdropRect = el.closest('.scene-backdrop')?.getBoundingClientRect();
        fallbackBounds.height = rect.height;
        fallbackBounds.top = rect.top - (backdropRect?.top ?? 0);
      }
    };
    measure();
    window.addEventListener('resize', measure);

    let pointerX = 0;
    const onPointerMove = (e: PointerEvent) => {
      pointerX = e.clientX / Math.max(1, window.innerWidth) - 0.5;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let uProgress = 0;
    let rotY = 0;
    let rafId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;

    const isHeadless =
      typeof navigator !== 'undefined' &&
      (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

    const render = (now: number) => {
      if (cancelled) return;
      if (isHeadless && now - lastTime < 50) {
        rafId = requestAnimationFrame(render);
        return;
      }
      const dt = Math.min(0.1, Math.max(0.001, (now - lastTime) * 0.001));
      lastTime = now;

      if (pointCount > 0) {
        const heroEl = document.querySelector('.hero');
        let heroTarget = 0;
        if (heroEl) {
          const r = heroEl.getBoundingClientRect();
          heroTarget = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
        }

        uProgress = damp(uProgress, heroTarget, 3, dt);
        rotY = damp(rotY, 0.015 * pointerX, 3, dt);

        // Frustum height at camera z = 6 with fov = 42 deg
        const viewportH = 2 * Math.tan((42 * Math.PI) / 360) * 6;
        const uScale = (fallbackBounds.height * viewportH) / Math.max(1, height);
        const uPosY =
          viewportH / 2 -
          ((fallbackBounds.top + fallbackBounds.height / 2) * viewportH) / Math.max(1, height);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, colBuf);
        gl.enableVertexAttribArray(colLoc);
        gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, seedBuf);
        gl.enableVertexAttribArray(seedLoc);
        gl.vertexAttribPointer(seedLoc, 1, gl.FLOAT, false, 0, 0);

        gl.uniform1f(uTimeLoc, (now - startTime) * 0.001);
        gl.uniform1f(uProgressLoc, uProgress);
        gl.uniform1f(uScaleLoc, uScale);
        gl.uniform1f(uDprLoc, dpr);
        gl.uniform1f(uAspectLoc, width / Math.max(1, height));
        gl.uniform1f(uPosYLoc, uPosY);
        gl.uniform1f(uRotYLoc, rotY);

        gl.drawArrays(gl.POINTS, 0, pointCount);
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointerMove);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(colBuf);
      gl.deleteBuffer(seedBuf);
      gl.deleteProgram(program);
    };
  }, [motionOn]);

  if (!motionOn) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
};

// Verbatim GLSL shaders from chunk-379.js (module 69955 SignalExplorer)
const EXPLORER_VERTEX_SHADER = `
attribute vec3 position;
attribute vec3 aTeach;
attribute vec3 aConnect;
uniform vec3 uWeights;
uniform float uTime;
uniform float uPulse;
uniform vec2 uPointer;
uniform float uRotY;
uniform float uCamZ;
uniform float uAspect;
uniform float uDpr;
varying float vGlow;
void main(){
  vec3 p = position * uWeights.x + aTeach * uWeights.y + aConnect * uWeights.z;
  float d = distance(p.xy, uPointer);
  float wave = sin(length(p.xy) * 9.0 - uTime * 2.5);
  p.z += wave * (0.06 + 0.2 * uWeights.y);
  p.xy += normalize(p.xy + vec2(0.001)) * sin(d * 7.0 - uTime * 4.0) * exp(-d * 1.5) * 0.16;
  p *= 1.0 + uPulse * 0.08;
  vGlow = 0.45 + 0.4 * exp(-d * 2.0) + 0.15 * wave;

  float c = cos(uRotY);
  float s = sin(uRotY);
  vec3 mv = vec3(
    p.x * c + p.z * s,
    p.y,
    -p.x * s + p.z * c - uCamZ
  );
  float f = 1.0 / tan(0.34906585);
  gl_Position = vec4(
    (mv.x * f) / uAspect,
    mv.y * f,
    (mv.z * 50.1 + 10.0) / -49.9,
    -mv.z
  );
  gl_PointSize = clamp(13.0 / -mv.z, 1.0, 4.0) * uDpr;
}
`;

const EXPLORER_FRAGMENT_SHADER = `
precision mediump float;
varying float vGlow;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 col = mix(vec3(0.68, 0.65, 0.59), vec3(1.0, 0.48, 0.22), smoothstep(0.45, 0.9, vGlow));
  gl_FragColor = vec4(col, (1.0 - smoothstep(0.1, 0.5, d)) * 0.85);
}
`;

interface SignalExplorerCanvasProps {
  lens: 'build' | 'teach' | 'connect';
  motionOn: boolean;
  impact?: boolean;
}

/**
 * Exact implementation of the reference site's SignalExplorer WebGL scene (chunk-379.js module 69955).
 */
export const SignalExplorerCanvas: React.FC<SignalExplorerCanvasProps> = ({
  lens,
  motionOn,
  impact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lensRef = useRef(lens);
  const pulseRef = useRef(0);

  useEffect(() => {
    lensRef.current = lens;
    pulseRef.current = 1;
  }, [lens]);

  useEffect(() => {
    if (!motionOn) return;
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const gl =
      (canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null) ||
      (canvas.getContext('webgl', {
        alpha: true,
        antialias: false,
        powerPreference: 'low-power',
      }) as WebGLRenderingContext | null);

    if (!gl) return;

    const program = createProgram(gl, EXPLORER_VERTEX_SHADER, EXPLORER_FRAGMENT_SHADER);
    if (!program) return;

    const x = new Float32Array(7200);
    const v = new Float32Array(7200);
    const y = new Float32Array(7200);

    for (let e = 0; e < 2400; e++) {
      const t = (e % 60) / 59;
      const r = Math.floor(e / 60) / 39;
      x.set([(t - 0.5) * 3, (r - 0.5) * 2.8, 0.12 * Math.sin(18 * t)], 3 * e);

      const n = t * Math.PI * 2;
      const i = 0.2 + 1.5 * r;
      v.set([Math.cos(n) * i, Math.sin(n) * i, 0.2 * Math.sin(8 * i)], 3 * e);

      const a = 1 - (2 * e) / 2399;
      const s = 2.399963 * e;
      const o = Math.sqrt(Math.max(0, 1 - a * a));
      y.set([Math.cos(s) * o * 1.6, 1.6 * a, Math.sin(s) * o * 1.6], 3 * e);
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, x, gl.STATIC_DRAW);

    const teachBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teachBuf);
    gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);

    const connectBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, connectBuf);
    gl.bufferData(gl.ARRAY_BUFFER, y, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    const teachLoc = gl.getAttribLocation(program, 'aTeach');
    const connectLoc = gl.getAttribLocation(program, 'aConnect');

    const uWeightsLoc = gl.getUniformLocation(program, 'uWeights');
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uPulseLoc = gl.getUniformLocation(program, 'uPulse');
    const uPointerLoc = gl.getUniformLocation(program, 'uPointer');
    const uRotYLoc = gl.getUniformLocation(program, 'uRotY');
    const uCamZLoc = gl.getUniformLocation(program, 'uCamZ');
    const uAspectLoc = gl.getUniformLocation(program, 'uAspect');
    const uDprLoc = gl.getUniformLocation(program, 'uDpr');

    let w = container.clientWidth || 400;
    let h = container.clientHeight || 350;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    const resize = () => {
      w = container.clientWidth || 400;
      h = container.clientHeight || 350;
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const pointer = { x: 4, y: 4 };
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * 4 - 2;
      pointer.y = 2 - ((e.clientY - rect.top) / Math.max(1, rect.height)) * 4;
    };
    const onPointerLeave = () => {
      pointer.x = 4;
      pointer.y = 4;
    };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const weights = {
      x: lensRef.current === 'build' ? 1 : 0,
      y: lensRef.current === 'teach' ? 1 : 0,
      z: lensRef.current === 'connect' ? 1 : 0,
    };
    let uPulse = 0;
    let raf = 0;
    let lastRender = 0;

    const tick = (e: number) => {
      if (e - lastRender > 32) {
        lastRender = e;
        const tx = lensRef.current === 'build' ? 1 : 0;
        const ty = lensRef.current === 'teach' ? 1 : 0;
        const tz = lensRef.current === 'connect' ? 1 : 0;
        weights.x += (tx - weights.x) * 0.065;
        weights.y += (ty - weights.y) * 0.065;
        weights.z += (tz - weights.z) * 0.065;

        uPulse += (pulseRef.current - uPulse) * 0.13;
        pulseRef.current *= 0.93;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, teachBuf);
        gl.enableVertexAttribArray(teachLoc);
        gl.vertexAttribPointer(teachLoc, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, connectBuf);
        gl.enableVertexAttribArray(connectLoc);
        gl.vertexAttribPointer(connectLoc, 3, gl.FLOAT, false, 0, 0);

        gl.uniform3f(uWeightsLoc, weights.x, weights.y, weights.z);
        gl.uniform1f(uTimeLoc, 0.001 * e);
        gl.uniform1f(uPulseLoc, uPulse);
        gl.uniform2f(uPointerLoc, pointer.x, pointer.y);
        gl.uniform1f(uRotYLoc, 0.18 * Math.sin(0.00015 * e));
        gl.uniform1f(uCamZLoc, impact ? 6.0 : 5.1);
        gl.uniform1f(uAspectLoc, w / Math.max(1, h));
        gl.uniform1f(uDprLoc, dpr);

        gl.drawArrays(gl.POINTS, 0, 2400);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(teachBuf);
      gl.deleteBuffer(connectBuf);
      gl.deleteProgram(program);
    };
  }, [motionOn, impact]);

  if (!motionOn) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
};
