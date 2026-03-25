'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Sphere, Color } from 'ogl';

const vertex = `#version 300 es
precision highp float;
in vec3 position;
in vec3 normal;
in vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
out vec3 vNormal;
out vec3 vPosition;
out vec2 vUv;

// Simple 3D noise function
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 1.0/7.0;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))).x;
  p1 *= taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))).y;
  p2 *= taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))).z;
  p3 *= taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3))).w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float noise = snoise(pos * 1.5 + uTime * 0.5);
  pos += normal * noise * 0.15;
  vPosition = pos;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec3 uColor;
uniform float uTime;
in vec3 vNormal;
in vec3 vPosition;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(-vPosition);
  
  // Fresnel effect
  float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);
  
  // Highlighting
  float spec = pow(max(0.0, dot(normal, vec3(0.5, 0.5, 1.0))), 20.0);
  
  // Base color with some variations
  vec3 color = uColor * (0.5 + 0.5 * normal.y);
  color = mix(color, vec3(1.0), spec * 0.5);
  color += fresnel * uColor * 0.8;
  
  fragColor = vec4(color, 0.9);
}
`;

interface LiquidBlobProps {
  color?: string;
}

export const LiquidBlob = ({ color = '#0065FF' }: LiquidBlobProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const getOptimalDPR = () => {
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 4) return 1;
      if (/iPhone|iPad|Android/.test(navigator.userAgent)) return 1;
      return Math.min(dpr, 1.5);
    };

    const isLowEnd = 
      !(navigator as any).deviceMemory || (navigator as any).deviceMemory < 4 ||
      /iPhone|iPad|Android/.test(navigator.userAgent);

    const renderer = new Renderer({ 
      alpha: true, 
      antialias: false, 
      dpr: getOptimalDPR() 
    });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const geometry = new Sphere(gl, { 
      radius: 1, 
      widthSegments: isLowEnd ? 32 : 64, 
      heightSegments: isLowEnd ? 32 : 64 
    });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(color) },
        modelViewMatrix: { value: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) },
        projectionMatrix: { value: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]) },
        normalMatrix: { value: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]) },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', resize);
    resize();

    let raf: number;
    let isVisible = true;
    const update = (t: number) => {
      if (!isVisible) return;
      program.uniforms.uTime.value = t * 0.001;
      mesh.rotation.y += 0.01;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !raf) {
          raf = requestAnimationFrame(update);
        } else if (!isVisible) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(container);

    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
    };
  }, [color]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LiquidBlob;
