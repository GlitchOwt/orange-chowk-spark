import React, { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Program, Mesh, Vec2 } from 'ogl';

interface AuroraProps {
  colorStops?: string[];
  blend?: number;
  amplitude?: number;
  speed?: number;
}

const Aurora: React.FC<AuroraProps> = ({
  colorStops = ["#3A29FF", "#FF94B4", "#FF3232"],
  blend = 0.5,
  amplitude = 1.0,
  speed = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize OGL renderer
    const renderer = new Renderer({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
    });
    rendererRef.current = renderer;

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Create camera
    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 5);

    // Create scene
    const scene = new Transform();

    // Convert hex colors to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : { r: 1, g: 1, b: 1 };
    };

    const color1 = hexToRgb(colorStops[0]);
    const color2 = hexToRgb(colorStops[1]);
    const color3 = hexToRgb(colorStops[2]);

    // Aurora shader
    const vertex = `
      attribute vec2 uv;
      attribute vec2 position;
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uBlend;
      uniform float uAmplitude;
      uniform float uSpeed;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      varying vec2 vUv;

      float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float smoothNoise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * smoothNoise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = vUv;
        vec2 pos = st * 2.0 - 1.0;
        
        float time = uTime * uSpeed;
        
        // Create flowing aurora patterns
        float wave1 = fbm(st * 3.0 + vec2(time * 0.1, time * 0.05)) * uAmplitude;
        float wave2 = fbm(st * 2.0 + vec2(-time * 0.08, time * 0.12)) * uAmplitude;
        float wave3 = fbm(st * 4.0 + vec2(time * 0.15, -time * 0.07)) * uAmplitude;
        
        // Create gradient zones
        float zone1 = smoothstep(0.0, 0.8, wave1) * smoothstep(0.8, 0.0, length(pos - vec2(-0.3, 0.2)));
        float zone2 = smoothstep(0.0, 0.7, wave2) * smoothstep(0.9, 0.0, length(pos - vec2(0.4, -0.1)));
        float zone3 = smoothstep(0.0, 0.6, wave3) * smoothstep(0.7, 0.0, length(pos - vec2(0.0, 0.3)));
        
        // Mix colors
        vec3 color = vec3(0.0);
        color += uColor1 * zone1 * uBlend;
        color += uColor2 * zone2 * uBlend;
        color += uColor3 * zone3 * uBlend;
        
        // Add some overall glow
        float glow = 1.0 - length(pos) * 0.5;
        color += mix(uColor1, uColor2, 0.5) * glow * 0.1 * uBlend;
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    // Create program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2(window.innerWidth, window.innerHeight) },
        uBlend: { value: blend },
        uAmplitude: { value: amplitude },
        uSpeed: { value: speed },
        uColor1: { value: [color1.r, color1.g, color1.b] },
        uColor2: { value: [color2.r, color2.g, color2.b] },
        uColor3: { value: [color3.r, color3.g, color3.b] },
      },
    });

    // Create geometry
    const geometry = new Plane(gl, {
      width: 2,
      height: 2,
    });

    // Create mesh
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // Animation loop
    const animate = (time: number) => {
      program.uniforms.uTime.value = time * 0.001;
      renderer.render({ scene, camera });
      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: width / height });
      program.uniforms.uResolution.value = new Vec2(width, height);
    };

    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [colorStops, blend, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="aurora-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default Aurora;