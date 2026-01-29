import { ShaderExample } from '@/types/webgpu';

// Base shader template with uniforms
const uniformsHeader = `
struct Uniforms {
  time: f32,
  resolution_x: f32,
  resolution_y: f32,
  speed: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(-1.0, 1.0),
    vec2<f32>(1.0, -1.0),
    vec2<f32>(1.0, 1.0)
  );
  
  var output: VertexOutput;
  output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
  output.uv = positions[vertexIndex] * 0.5 + 0.5;
  return output;
}
`;

export const shaderExamples: ShaderExample[] = [
  // Visual Shaders
  {
    id: 'gradient-flow',
    title: 'Gradient Flow',
    description: 'Smooth flowing gradients with animated colors',
    category: 'shader',
    code: `${uniformsHeader}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv;
  
  let r = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
  let g = sin(uv.y * 3.0 + t * 1.3) * 0.5 + 0.5;
  let b = sin((uv.x + uv.y) * 2.0 + t * 0.7) * 0.5 + 0.5;
  
  return vec4<f32>(r, g, b, 1.0);
}`,
  },
  {
    id: 'plasma',
    title: 'Plasma Effect',
    description: 'Classic plasma pattern with vibrant colors',
    category: 'shader',
    code: `${uniformsHeader}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv * 10.0;
  
  var v = sin(uv.x + t);
  v += sin(uv.y + t);
  v += sin(uv.x + uv.y + t);
  v += sin(sqrt(uv.x * uv.x + uv.y * uv.y) + t);
  
  let r = sin(v * 0.5) * 0.5 + 0.5;
  let g = sin(v * 0.5 + 2.094) * 0.5 + 0.5;
  let b = sin(v * 0.5 + 4.188) * 0.5 + 0.5;
  
  return vec4<f32>(r, g, b, 1.0);
}`,
  },
  {
    id: 'noise-waves',
    title: 'Noise Waves',
    description: 'Animated noise pattern creating wave-like motion',
    category: 'shader',
    code: `${uniformsHeader}

fn hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(hash(i + vec2<f32>(0.0, 0.0)), hash(i + vec2<f32>(1.0, 0.0)), u.x),
    mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x),
    u.y
  );
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv * 5.0;
  
  var n = 0.0;
  n += noise(uv + t * 0.5) * 0.5;
  n += noise(uv * 2.0 + t * 0.3) * 0.25;
  n += noise(uv * 4.0 + t * 0.2) * 0.125;
  
  let color = vec3<f32>(
    n + 0.1,
    n * 0.8 + 0.2,
    n * 0.6 + 0.4
  );
  
  return vec4<f32>(color, 1.0);
}`,
  },
  {
    id: 'psychedelic',
    title: 'Psychedelic Spirals',
    description: 'Hypnotic spiral patterns with color cycling',
    category: 'shader',
    code: `${uniformsHeader}

const PI: f32 = 3.14159265359;

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv - 0.5;
  
  let dist = length(uv);
  let angle = atan2(uv.y, uv.x);
  
  let spiral = sin(angle * 8.0 + dist * 20.0 - t * 3.0);
  let rings = sin(dist * 30.0 - t * 2.0);
  
  let v = spiral * 0.5 + rings * 0.5;
  
  let r = sin(v * PI + t) * 0.5 + 0.5;
  let g = sin(v * PI + t + 2.094) * 0.5 + 0.5;
  let b = sin(v * PI + t + 4.188) * 0.5 + 0.5;
  
  return vec4<f32>(r, g, b, 1.0);
}`,
  },
  
  // 3D Graphics
  {
    id: 'rotating-cube',
    title: 'Rotating Cube',
    description: 'A 3D cube rendered with raymarching',
    category: '3d',
    code: `${uniformsHeader}

const PI: f32 = 3.14159265359;

fn rotateY(p: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

fn rotateX(p: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

fn sdBox(p: vec3<f32>, b: vec3<f32>) -> f32 {
  let q = abs(p) - b;
  return length(max(q, vec3<f32>(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0);
}

fn scene(p: vec3<f32>) -> f32 {
  let t = uniforms.time;
  var rp = rotateY(p, t);
  rp = rotateX(rp, t * 0.7);
  return sdBox(rp, vec3<f32>(0.5));
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv * 2.0 - 1.0;
  let aspect = uniforms.resolution_x / uniforms.resolution_y;
  
  let ro = vec3<f32>(0.0, 0.0, 3.0);
  let rd = normalize(vec3<f32>(uv.x * aspect, uv.y, -2.0));
  
  var t = 0.0;
  var hit = false;
  for (var i = 0; i < 64; i++) {
    let p = ro + rd * t;
    let d = scene(p);
    if (d < 0.001) {
      hit = true;
      break;
    }
    t += d;
    if (t > 10.0) { break; }
  }
  
  if (hit) {
    let p = ro + rd * t;
    let eps = 0.001;
    let n = normalize(vec3<f32>(
      scene(p + vec3<f32>(eps, 0.0, 0.0)) - scene(p - vec3<f32>(eps, 0.0, 0.0)),
      scene(p + vec3<f32>(0.0, eps, 0.0)) - scene(p - vec3<f32>(0.0, eps, 0.0)),
      scene(p + vec3<f32>(0.0, 0.0, eps)) - scene(p - vec3<f32>(0.0, 0.0, eps))
    ));
    
    let light = normalize(vec3<f32>(1.0, 1.0, 1.0));
    let diff = max(dot(n, light), 0.0);
    let amb = 0.2;
    
    let color = vec3<f32>(0.2, 0.6, 1.0) * (diff + amb);
    return vec4<f32>(color, 1.0);
  }
  
  return vec4<f32>(0.05, 0.05, 0.1, 1.0);
}`,
  },
  {
    id: 'sphere-lighting',
    title: 'Lit Sphere',
    description: 'A sphere with dynamic lighting and shadows',
    category: '3d',
    code: `${uniformsHeader}

fn sdSphere(p: vec3<f32>, r: f32) -> f32 {
  return length(p) - r;
}

fn sdPlane(p: vec3<f32>) -> f32 {
  return p.y + 1.0;
}

fn scene(p: vec3<f32>) -> f32 {
  let sphere = sdSphere(p, 0.8);
  let plane = sdPlane(p);
  return min(sphere, plane);
}

fn calcNormal(p: vec3<f32>) -> vec3<f32> {
  let eps = 0.001;
  return normalize(vec3<f32>(
    scene(p + vec3<f32>(eps, 0.0, 0.0)) - scene(p - vec3<f32>(eps, 0.0, 0.0)),
    scene(p + vec3<f32>(0.0, eps, 0.0)) - scene(p - vec3<f32>(0.0, eps, 0.0)),
    scene(p + vec3<f32>(0.0, 0.0, eps)) - scene(p - vec3<f32>(0.0, 0.0, eps))
  ));
}

fn softShadow(ro: vec3<f32>, rd: vec3<f32>) -> f32 {
  var res = 1.0;
  var t = 0.02;
  for (var i = 0; i < 32; i++) {
    let h = scene(ro + rd * t);
    res = min(res, 8.0 * h / t);
    t += clamp(h, 0.02, 0.2);
    if (h < 0.001 || t > 5.0) { break; }
  }
  return clamp(res, 0.0, 1.0);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv * 2.0 - 1.0;
  let aspect = uniforms.resolution_x / uniforms.resolution_y;
  
  let ro = vec3<f32>(0.0, 0.5, 3.0);
  let rd = normalize(vec3<f32>(uv.x * aspect, uv.y, -2.0));
  
  var dist = 0.0;
  var hit = false;
  for (var i = 0; i < 64; i++) {
    let p = ro + rd * dist;
    let d = scene(p);
    if (d < 0.001) {
      hit = true;
      break;
    }
    dist += d;
    if (dist > 10.0) { break; }
  }
  
  if (hit) {
    let p = ro + rd * dist;
    let n = calcNormal(p);
    
    let lightPos = vec3<f32>(cos(t) * 3.0, 2.0, sin(t) * 3.0);
    let lightDir = normalize(lightPos - p);
    
    let diff = max(dot(n, lightDir), 0.0);
    let shadow = softShadow(p + n * 0.01, lightDir);
    
    var color: vec3<f32>;
    if (p.y < -0.99) {
      let checker = floor(p.x * 2.0) + floor(p.z * 2.0);
      color = select(vec3<f32>(0.3), vec3<f32>(0.7), checker % 2.0 == 0.0);
    } else {
      color = vec3<f32>(0.9, 0.3, 0.2);
    }
    
    color *= diff * shadow + 0.15;
    return vec4<f32>(color, 1.0);
  }
  
  let sky = mix(vec3<f32>(0.1, 0.1, 0.2), vec3<f32>(0.3, 0.4, 0.6), uv.y * 0.5 + 0.5);
  return vec4<f32>(sky, 1.0);
}`,
  },
  {
    id: 'wireframe-torus',
    title: 'Wireframe Torus',
    description: 'A rotating torus with wireframe effect',
    category: '3d',
    code: `${uniformsHeader}

const PI: f32 = 3.14159265359;

fn rotateY(p: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

fn rotateX(p: vec3<f32>, angle: f32) -> vec3<f32> {
  let c = cos(angle);
  let s = sin(angle);
  return vec3<f32>(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

fn sdTorus(p: vec3<f32>, t: vec2<f32>) -> f32 {
  let q = vec2<f32>(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

fn scene(p: vec3<f32>) -> f32 {
  let t = uniforms.time;
  var rp = rotateY(p, t * 0.5);
  rp = rotateX(rp, t * 0.3);
  return sdTorus(rp, vec2<f32>(0.7, 0.2));
}

fn calcNormal(p: vec3<f32>) -> vec3<f32> {
  let eps = 0.001;
  return normalize(vec3<f32>(
    scene(p + vec3<f32>(eps, 0.0, 0.0)) - scene(p - vec3<f32>(eps, 0.0, 0.0)),
    scene(p + vec3<f32>(0.0, eps, 0.0)) - scene(p - vec3<f32>(0.0, eps, 0.0)),
    scene(p + vec3<f32>(0.0, 0.0, eps)) - scene(p - vec3<f32>(0.0, 0.0, eps))
  ));
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv * 2.0 - 1.0;
  let aspect = uniforms.resolution_x / uniforms.resolution_y;
  
  let ro = vec3<f32>(0.0, 0.0, 3.0);
  let rd = normalize(vec3<f32>(uv.x * aspect, uv.y, -2.0));
  
  var t_val = 0.0;
  var minDist = 1000.0;
  for (var i = 0; i < 64; i++) {
    let p = ro + rd * t_val;
    let d = scene(p);
    minDist = min(minDist, d);
    if (d < 0.001) { break; }
    t_val += d;
    if (t_val > 10.0) { break; }
  }
  
  let glow = 0.02 / (minDist + 0.02);
  var color = vec3<f32>(0.2, 1.0, 0.5) * glow * 0.5;
  
  if (minDist < 0.001) {
    let p = ro + rd * t_val;
    let n = calcNormal(p);
    
    let edge = 1.0 - abs(dot(rd, n));
    let wireframe = pow(edge, 3.0);
    
    color = mix(
      vec3<f32>(0.02, 0.05, 0.03),
      vec3<f32>(0.2, 1.0, 0.5),
      wireframe
    );
  }
  
  return vec4<f32>(color, 1.0);
}`,
  },
  
  // Particle Systems
  {
    id: 'starfield',
    title: 'Starfield',
    description: 'Flying through an infinite starfield',
    category: 'particles',
    code: `${uniformsHeader}

fn hash(p: vec3<f32>) -> f32 {
  var p3 = fract(p * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv * 2.0 - 1.0;
  let aspect = uniforms.resolution_x / uniforms.resolution_y;
  
  var color = vec3<f32>(0.0);
  
  for (var layer = 0; layer < 4; layer++) {
    let depth = f32(layer) * 0.5 + 1.0;
    let speed = 1.0 / depth;
    
    for (var i = 0; i < 50; i++) {
      let fi = f32(i);
      let seed = vec3<f32>(fi, f32(layer), 42.0);
      
      var starPos = vec2<f32>(
        hash(seed) * 2.0 - 1.0,
        hash(seed + 1.0) * 2.0 - 1.0
      );
      
      starPos.y = fract(starPos.y - t * speed * 0.1) * 2.0 - 1.0;
      
      let dist = length((uv - starPos) * vec2<f32>(aspect, 1.0));
      let size = 0.003 / depth;
      let brightness = smoothstep(size, 0.0, dist) * (1.0 / depth);
      
      let twinkle = sin(t * (hash(seed + 2.0) * 5.0 + 2.0) + fi) * 0.3 + 0.7;
      color += vec3<f32>(brightness * twinkle);
    }
  }
  
  color = pow(color, vec3<f32>(0.8));
  return vec4<f32>(color, 1.0);
}`,
  },
  {
    id: 'fire-particles',
    title: 'Fire Effect',
    description: 'Procedural fire with rising particles',
    category: 'particles',
    code: `${uniformsHeader}

fn hash(p: vec2<f32>) -> f32 {
  return fract(sin(dot(p, vec2<f32>(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(hash(i), hash(i + vec2<f32>(1.0, 0.0)), u.x),
    mix(hash(i + vec2<f32>(0.0, 1.0)), hash(i + vec2<f32>(1.0, 1.0)), u.x),
    u.y
  );
}

fn fbm(p: vec2<f32>) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var pos = p;
  for (var i = 0; i < 5; i++) {
    value += amplitude * noise(pos);
    pos *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  var uv = input.uv;
  uv.x = uv.x * 2.0 - 1.0;
  uv.y = 1.0 - uv.y;
  
  let distort = fbm(vec2<f32>(uv.x * 3.0, uv.y * 2.0 - t * 2.0)) * 0.3;
  uv.x += distort * (1.0 - uv.y);
  
  let fireShape = 1.0 - length(vec2<f32>(uv.x * 1.5, uv.y - 0.3));
  let n = fbm(vec2<f32>(uv.x * 4.0, uv.y * 3.0 - t * 3.0));
  
  var fire = fireShape + n * 0.5;
  fire = smoothstep(0.2, 0.8, fire);
  fire *= 1.0 - uv.y;
  
  let r = fire;
  let g = fire * fire * 0.7;
  let b = fire * fire * fire * 0.3;
  
  var color = vec3<f32>(r, g, b) * 1.5;
  color = pow(color, vec3<f32>(0.9));
  
  return vec4<f32>(color, 1.0);
}`,
  },
  {
    id: 'bouncing-particles',
    title: 'Bouncing Particles',
    description: 'Colorful particles bouncing with physics',
    category: 'particles',
    code: `${uniformsHeader}

fn hash(p: f32) -> f32 {
  return fract(sin(p * 127.1) * 43758.5453);
}

fn hash2(p: f32) -> vec2<f32> {
  return vec2<f32>(hash(p), hash(p + 17.0));
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv * 2.0 - 1.0;
  let aspect = uniforms.resolution_x / uniforms.resolution_y;
  
  var color = vec3<f32>(0.02, 0.02, 0.05);
  
  for (var i = 0; i < 30; i++) {
    let fi = f32(i);
    let initial = hash2(fi) * 2.0 - 1.0;
    let velocity = hash2(fi + 100.0) * 0.5;
    
    let phase = t * (0.5 + hash(fi + 50.0) * 0.5) + fi * 0.5;
    
    var pos = initial;
    pos.x += sin(phase * velocity.x * 3.0) * 0.8;
    pos.y = abs(sin(phase + initial.y * 3.14159)) * 0.8 - 0.4;
    
    let dist = length((uv - pos) * vec2<f32>(aspect, 1.0));
    let size = 0.03 + hash(fi + 200.0) * 0.02;
    let particle = smoothstep(size, size * 0.3, dist);
    
    let hue = hash(fi + 300.0);
    let particleColor = vec3<f32>(
      sin(hue * 6.28) * 0.5 + 0.5,
      sin(hue * 6.28 + 2.09) * 0.5 + 0.5,
      sin(hue * 6.28 + 4.18) * 0.5 + 0.5
    );
    
    color += particleColor * particle * 0.8;
    
    let glow = 0.01 / (dist + 0.01);
    color += particleColor * glow * 0.05;
  }
  
  return vec4<f32>(color, 1.0);
}`,
  },
];

export const getExamplesByCategory = (category: ShaderExample['category']) => {
  return shaderExamples.filter(e => e.category === category);
};

export const getExampleById = (id: string) => {
  return shaderExamples.find(e => e.id === id);
};

export const defaultShaderCode = `${uniformsHeader}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let t = uniforms.time;
  let uv = input.uv;
  
  // Create your shader here!
  let r = uv.x;
  let g = uv.y;
  let b = sin(t) * 0.5 + 0.5;
  
  return vec4<f32>(r, g, b, 1.0);
}`;
