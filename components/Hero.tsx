
import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree, ThreeElement } from '@react-three/fiber';
import { shaderMaterial, useVideoTexture, Html, PerspectiveCamera, Environment } from '@react-three/drei';

// --- Material Definition ---
const ImageRevealMaterial = shaderMaterial(
    {
        uTime: 0,
        uTexture: new THREE.Texture(),
        uMouse: new THREE.Vector2(0, 0),
        uVelocity: new THREE.Vector2(0, 0),
        uAspect: 1.0,
        uInfluence: 1.0,
        uGlobalOpacity: 0.0,
        uIntroFlash: 0.0,
        uVideoSize: new THREE.Vector2(1, 1),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vScreenPos;
    varying vec3 vLocalPos;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vLocalPos = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      
      vec4 projected = projectionMatrix * mvPosition;
      vScreenPos = projected.xy / projected.w; 
      
      gl_Position = projected;
    }
  `,
    // Fragment Shader
    `
    precision highp float;
    uniform float uTime;
    uniform float uInfluence;
    uniform float uGlobalOpacity;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;
    uniform float uAspect;
    uniform sampler2D uTexture;
    uniform vec2 uVideoSize;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vScreenPos;

    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
    
    float noise(vec2 x) {
        vec2 i = floor(x);
        vec2 f = fract(x);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    float fbm(vec3 p) {
        float v = 0.0; float a = 0.5;
        vec2 p2 = p.xy;
        float shift = vec2(100.0).x;
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
        for (int i = 0; i < 2; i++) {
            v += a * noise(p2);
            p2 = rot * p2 * 2.0 + vec2(shift);
            a *= 0.5;
        }
        return v;
    }

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      vec2 aspectVec = vec2(uAspect, 1.0);
      float t = uTime * 0.3; 
      vec3 p1 = vec3(vUv.x * 1.0, vUv.y * 15.0, t); 
      float flow = fbm(p1);
      
      vec2 distortedScreenPos = vScreenPos + (vec2(flow, flow * 0.2) - vec2(0.5)) * 0.15;
      float dist = distance(distortedScreenPos * aspectVec, uMouse * aspectVec);
      float speed = length(uVelocity);
      
      float bulge = smoothstep(0.0, 1.0, dot(normalize((vScreenPos - uMouse) * aspectVec), speed > 0.001 ? normalize(uVelocity) : vec2(0.0))) * speed * 0.3;
      float dynamicRadius = (0.38 * uInfluence) * (1.0 + bulge); 
      float ripple = sin(distortedScreenPos.y * 30.0 - uTime * 5.0) * 0.005;
      float liquidEdge = dist + (flow * 0.12) + ripple;
      float mask = smoothstep(dynamicRadius - 0.04, dynamicRadius + 0.04, liquidEdge);
      
      float fresnel = 0.02 + 0.98 * pow(1.0 - max(0.0, dot(viewDir, normal)), 4.0);
      vec3 deepBlack = vec3(0.01, 0.01, 0.015);
      vec3 chromeHighlight = vec3(1.0, 1.0, 1.2);
      
      // Add a virtual light following the mouse for better definition
      float mouseLight = smoothstep(0.7, 0.0, dist);
      vec3 envColor = mix(deepBlack, chromeHighlight, fresnel * 1.2);
      envColor += chromeHighlight * mouseLight * 0.25;
      
      float streak = smoothstep(0.48, 0.52, sin(vUv.y * 20.0 + t * 2.0));
      envColor += vec3(0.15, 0.15, 0.2) * streak * (1.0 - mask);
      
      vec2 uv = vUv;
      float r = (uVideoSize.x / uVideoSize.y) < 1.0 ? 1.0 / (uVideoSize.x / uVideoSize.y) : (uVideoSize.x / uVideoSize.y);
      // Simplify UV mapping for the example, though previous logic was more robust
      // Keeping original video mapping logic
      float videoAspect = uVideoSize.x / uVideoSize.y;
      float faceAspect = 1.0; 
      float aspectR = faceAspect / videoAspect;
      if (aspectR < 1.0) { 
          uv.x = (uv.x - 0.5) * aspectR + 0.5;
      } else {
          uv.y = (uv.y - 0.5) * (1.0/aspectR) + 0.5;
      }
      
      vec3 img = texture2D(uTexture, uv).rgb * 1.1;
      vec3 finalColor = mix(img, envColor, mask);
      
      // Enhanced rim light for liquid
      float rim = (1.0 - mask) * smoothstep(0.0, 0.15, mask);
      finalColor += vec3(0.5, 0.5, 0.6) * rim * 0.5; 
      
      // Global silhouette rim for background separation
      float silhouetteRim = pow(1.0 - max(0.0, dot(viewDir, normal)), 3.0);
      finalColor += vec3(0.4, 0.4, 0.5) * silhouetteRim * 0.4;
      
      gl_FragColor = vec4(finalColor, uGlobalOpacity);
    }
  `
);

extend({ ImageRevealMaterial });

// Add types for the custom material
declare module '@react-three/fiber' {
    interface ThreeElements {
        imageRevealMaterial: ThreeElement<typeof ImageRevealMaterial> & {
            uTexture?: THREE.Texture;
            uVideoSize?: THREE.Vector2;
            uTime?: number;
            uMouse?: THREE.Vector2;
            uVelocity?: THREE.Vector2;
            uAspect?: number;
            uInfluence?: number;
            uGlobalOpacity?: number;
        };
    }
}

// --- Components ---
const VideoFace = React.forwardRef<any, { url: string; attach: string; startTime?: number }>(({ url, attach, startTime = 0 }, ref) => {
    const texture = useVideoTexture(url || '', { unsuspend: 'canplay', muted: true, loop: true, start: true, crossOrigin: 'Anonymous', playsInline: true });
    const [videoSize, setVideoSize] = useState(new THREE.Vector2(1, 1));

    useEffect(() => {
        const video = texture.image;
        if (video instanceof HTMLVideoElement) {
            const updateSize = () => {
                if (video.videoWidth && video.videoHeight) setVideoSize(new THREE.Vector2(video.videoWidth, video.videoHeight));
            };
            updateSize();
            video.addEventListener('loadedmetadata', updateSize);
            video.currentTime = startTime;
            const handleTimeUpdate = () => {
                if (video.currentTime >= startTime + 30) video.currentTime = startTime;
            };
            video.addEventListener('timeupdate', handleTimeUpdate);
            return () => {
                video.removeEventListener('timeupdate', handleTimeUpdate);
                video.removeEventListener('loadedmetadata', updateSize);
            };
        }
    }, [texture, startTime]);

    return <imageRevealMaterial ref={ref} attach={attach} uTexture={texture} uVideoSize={videoSize} transparent={true} depthWrite={true} />;
});

const ChevronGeometry = () => {
    const thickness = 0.035;
    const length = 0.45;
    const h = length / 2;
    return (
        <group>
            <mesh position={[-h, 0, 0]}><boxGeometry args={[length, thickness, thickness]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} /></mesh>
            <mesh position={[0, -h, 0]}><boxGeometry args={[thickness, length, thickness]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} /></mesh>
            <mesh position={[0, 0, -h]}><boxGeometry args={[thickness, thickness, length]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} /></mesh>
            <mesh position={[0, 0, 0]}><boxGeometry args={[thickness, thickness, thickness]} /><meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} toneMapped={false} /></mesh>
        </group>
    )
};

const TechChevron = React.forwardRef<THREE.Group, { position: [number, number, number], scaleSign: [number, number, number] }>(({ position, scaleSign }, ref) => {
    return (
        <group ref={ref} position={position} scale={scaleSign}>
            <ChevronGeometry />
        </group>
    )
});

const TacticalText: React.FC<{ text: string; visible: boolean; className?: string }> = ({ text, visible, className = "" }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <span className="opacity-0 whitespace-nowrap font-light tracking-wider text-2xl md:text-3xl font-tactical">{text}</span>
            <div className={`absolute top-0 left-0 h-full overflow-hidden whitespace-nowrap transition-[width] duration-500 ease-linear ${visible ? 'w-full' : 'w-0'}`}>
                <span className="font-light tracking-wider text-2xl md:text-3xl text-white font-tactical">{text}</span>
            </div>
        </div>
    );
};

const ShowcaseCube: React.FC<{ videos?: string[], scale?: number; sectionRef: React.RefObject<HTMLElement | null> }> = ({ videos = [], scale = 1, sectionRef }) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRefs = useRef<any[]>([]);
    const chevronRefs = useRef<THREE.Group[]>([]);
    const [isAssembled, setIsAssembled] = useState(false);
    const [currentPhase, setCurrentPhase] = useState(0);

    const { viewport } = useThree();

    const timer = useRef(0);
    const introPhase = useRef(0);
    const globalOpacity = useRef(0.0);
    const lastScrollTime = useRef(0);
    const globalMouse = useRef(new THREE.Vector2(0, 0));

    const stateRef = useRef({
        lerpPhase: 0,
        rotation: new THREE.Euler(0, 0, 0),
        springScale: 0,
        springVel: 0,
        mouseVel: new THREE.Vector2(0, 0),
        prevMouse: new THREE.Vector2(0, 0),
        lerpMouse: new THREE.Vector2(0, 0),
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            // Only trap if the section is at the top of the viewport (within a small margin)
            const isAtTop = Math.abs(rect.top) < 10;

            const now = Date.now();
            const direction = Math.sign(e.deltaY);

            // Trap conditions:
            // 1. We are at the top and scrolling down through phases (including phase 3)
            // 2. We are at the top and scrolling up to earlier phases
            const shouldTrap = isAtTop && (
                (direction > 0 && currentPhase < 4) ||
                (direction < 0 && currentPhase > 0)
            );

            if (shouldTrap) {
                if (e.cancelable) e.preventDefault();

                if (now - lastScrollTime.current > 800) {
                    setCurrentPhase(prev => Math.max(0, Math.min(4, prev + direction)));
                    lastScrollTime.current = now;
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        return () => window.removeEventListener('wheel', handleWheel);
    }, [currentPhase, sectionRef]);

    const cornerData = useMemo(() => {
        const s = 1.62;
        return [
            [s, s, s], [s, s, -s], [s, -s, s], [s, -s, -s],
            [-s, s, s], [-s, s, -s], [-s, -s, s], [-s, -s, -s]
        ].map((pos) => ({
            pos: pos as [number, number, number],
            sign: [Math.sign(pos[0]), Math.sign(pos[1]), Math.sign(pos[2])] as [number, number, number]
        }));
    }, []);

    const easeInOutQuart = (t: number) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    useFrame((state, delta) => {
        const dt = Math.min(delta, 0.1);
        const time = state.clock.elapsedTime;
        const s = stateRef.current;
        timer.current += dt;

        if (timer.current > 0.5 && introPhase.current < 1) {
            introPhase.current = Math.min(1, introPhase.current + dt * 1.5);
            if (introPhase.current >= 1 && !isAssembled) setIsAssembled(true);
        }

        const p = introPhase.current;
        const easedP = easeInOutQuart(p);
        globalOpacity.current = p;

        s.lerpPhase = THREE.MathUtils.lerp(s.lerpPhase, currentPhase, dt * 5.0);

        let activeMouse = globalMouse.current;
        let targetInfluence = 1.0;

        if (currentPhase === 1) {
            activeMouse = new THREE.Vector2(-0.1, 0);
            targetInfluence = 1.5;
        } else if (currentPhase === 2) {
            activeMouse = new THREE.Vector2(0.3, 0);
            targetInfluence = 1.5;
        }

        s.lerpMouse.lerp(activeMouse, dt * 5.0);
        const moveVel = new THREE.Vector2().subVectors(activeMouse, s.prevMouse).divideScalar(dt);
        s.mouseVel.lerp(moveVel, dt * 8.0);
        s.prevMouse.copy(activeMouse);

        let targetScale = isAssembled ? 1.0 : easedP;
        if (s.lerpPhase > 2.2) {
            const p3 = Math.min(1, (s.lerpPhase - 2.2) * 2);
            targetScale = 1.0 + p3 * 0.3;
        }

        const force = (targetScale - s.springScale) * 80.0;
        s.springVel += (force - s.springVel * 15.0) * dt;
        s.springScale += s.springVel * dt;

        if (groupRef.current && meshRef.current) {
            meshRef.current.scale.setScalar(s.springScale);

            let posX = 0;
            const offset = viewport.width * 0.15;
            const P = s.lerpPhase;

            if (P < 1) {
                posX = THREE.MathUtils.lerp(0, -offset, P);
            } else if (P < 2) {
                posX = THREE.MathUtils.lerp(-offset, offset, P - 1);
            } else {
                posX = THREE.MathUtils.lerp(offset, 0, Math.min(1, P - 2));
            }

            groupRef.current.position.x = posX + s.lerpMouse.x * 0.2;
            groupRef.current.position.y = s.lerpMouse.y * 0.2 + Math.sin(time * 0.4) * 0.05;

            let rotX = 0.15;
            let rotY = 0.4;

            if (s.lerpPhase > 0 && s.lerpPhase <= 1) {
                rotY = 0.4 + s.lerpPhase * 0.5;
                rotX = 0.15 + s.lerpPhase * 0.15;
            } else if (s.lerpPhase > 1 && s.lerpPhase <= 2) {
                rotY = 0.9 + (s.lerpPhase - 1) * 0.7;
                rotX = 0.3 - (s.lerpPhase - 1) * 0.1;
            } else if (s.lerpPhase > 2) {
                rotY = 1.6 + (s.lerpPhase - 2) * 1.0;
                rotX = 0.2 - (s.lerpPhase - 2) * 0.1;
            }

            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX + (-s.lerpMouse.y * 0.08), dt * 3.0);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY + (s.lerpMouse.x * 0.08), dt * 3.0);
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0.02, dt * 3.0);

            chevronRefs.current.forEach((ref, i) => {
                if (!ref) return;
                const data = cornerData[i];
                if (p <= 0) {
                    ref.position.set(data.pos[0] * 0.1, data.pos[1] * 0.1, 0);
                    ref.scale.set(0.05, 0.05, 0.01).multiply(new THREE.Vector3(...data.sign));
                } else if (!isAssembled) {
                    ref.position.set(
                        THREE.MathUtils.lerp(data.pos[0] * 0.1, data.pos[0], easedP),
                        THREE.MathUtils.lerp(data.pos[1] * 0.1, data.pos[1], easedP),
                        THREE.MathUtils.lerp(0, data.pos[2], easedP)
                    );
                    ref.scale.setScalar(THREE.MathUtils.lerp(0.05, 1.0, easedP)).multiply(new THREE.Vector3(...data.sign));
                } else {
                    const expand = 1.0 + (Math.sin(time * 1.5 + i) * 0.02);
                    ref.position.set(data.pos[0] * expand, data.pos[1] * expand, data.pos[2] * expand);
                }
            });
        }

        materialRefs.current.forEach(mat => {
            if (mat && mat.uniforms) {
                mat.uniforms.uTime.value = time;
                mat.uniforms.uMouse.value.copy(s.lerpMouse);
                mat.uniforms.uVelocity.value.copy(s.mouseVel);
                mat.uniforms.uAspect.value = viewport.width / viewport.height;
                mat.uniforms.uGlobalOpacity.value = globalOpacity.current;
                mat.uniforms.uInfluence.value = THREE.MathUtils.lerp(mat.uniforms.uInfluence.value, targetInfluence, dt * 2.0);
            }
        });
    });

    const isPhase1 = currentPhase === 1;
    const isPhase2 = currentPhase === 2;
    const isPhase3Plus = currentPhase >= 3;

    return (
        <group ref={groupRef} scale={scale}>
            <Html fullscreen portal={undefined} zIndexRange={[100, 200]}>
                <div className="w-full h-full relative pointer-events-none">
                    {/* Phase 1: Right */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-12 md:right-44 max-w-2xl text-right">
                        <TacticalText text="WE DON'T JUST BUILD BRANDS" visible={isPhase1} />
                    </div>

                    {/* Phase 2: Left */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-12 md:left-44 max-w-2xl text-left">
                        <TacticalText text="WE BUILD GROWTH ENGINES" visible={isPhase2} />
                    </div>

                    {/* Phase 3+: Center Button */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-32 flex flex-col items-center transition-opacity duration-1000 ${isPhase3Plus ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button className="px-14 py-6 text-white font-black font-tactical pointer-events-auto border-none cursor-pointer text-xl tracking-[0.2em] uppercase bg-orange-tactical">
                            LET'S BUILD SOMETHING REAL
                        </button>
                    </div>
                </div>
            </Html>

            <mesh ref={meshRef}>
                <boxGeometry args={[3, 3, 3]} />
                {videos.slice(0, 6).map((url, index) => (
                    <VideoFace key={index} url={url} attach={`material-${index}`} startTime={index * 40} ref={(el) => { materialRefs.current[index] = el; }} />
                ))}
            </mesh>

            <group>
                {cornerData.map((data, i) => (
                    <TechChevron key={i} position={[0, 0, 0]} scaleSign={data.sign} ref={(el) => { if (el) chevronRefs.current[i] = el; }} />
                ))}
            </group>
        </group>
    );
};

// --- Main Hero Component ---
const CUBE_VIDEO_URL = "https://vjs.zencdn.net/v/oceans.mp4";

export const Hero: React.FC = () => {
    const [videos, setVideos] = useState<string[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        setVideos([
            CUBE_VIDEO_URL,
            CUBE_VIDEO_URL,
            CUBE_VIDEO_URL,
            CUBE_VIDEO_URL,
            CUBE_VIDEO_URL,
            CUBE_VIDEO_URL
        ]);
    }, []);

    if (videos.length === 0) return (
        <div className="h-screen w-full bg-tech-black flex items-center justify-center text-white font-mono text-xs tracking-widest">
            INITIALIZING_NEURAL_LINK...
        </div>
    );

    return (
        <section id="home" ref={sectionRef} className="h-screen w-full relative bg-transparent overflow-hidden">
            <Canvas dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => {
                gl.setClearColor(0x000000, 0);
            }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10.5]} fov={45} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <pointLight position={[-10, 5, 10]} intensity={1} color="#FF3300" />
                <Environment preset="city" />
                <ShowcaseCube videos={videos} scale={1} sectionRef={sectionRef} />
            </Canvas>
        </section>
    );
};
