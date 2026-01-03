
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree, ThreeElement } from '@react-three/fiber';
import { shaderMaterial, useVideoTexture, Html, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';

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
        uIntroProgress: 0.0,
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
    uniform float uIntroProgress;
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
      
      // Premium dark tech look: anthracite base with bright liquid chrome
      vec3 baseColor = vec3(0.12, 0.12, 0.15); // Tactical Anthracite Base
      vec3 liquidColor = vec3(0.95, 0.95, 1.0); // Silver Chrome
      
      float mouseLight = smoothstep(0.7, 0.0, dist);
      vec3 envColor = mix(baseColor, liquidColor, fresnel * 0.7);
      
      vec2 uv = vUv;
      float videoAspect = uVideoSize.x / max(0.001, uVideoSize.y);
      float faceAspect = 1.0; 
      float aspectR = faceAspect / videoAspect;
      if (aspectR < 1.0) { 
          uv.x = (uv.x - 0.5) * aspectR + 0.5;
      } else {
          uv.y = (uv.y - 0.5) * (1.0/aspectR) + 0.5;
      }
      
      vec3 img = texture2D(uTexture, uv).rgb;
      // Show full color video on the faces - boost for clarity
      vec3 finalImg = img * 1.5;

      // Combine Video and Liquid Chrome: Default is primarily the video, with liquid chrome ripple
      // When mask is high (far from mouse), we show the chrome-glazed video
      // When mask is low (at mouse), we reveal the interior (transparency)
      vec3 surfaceColor = mix(finalImg, envColor, 0.4 + flow * 0.2);
      vec3 finalColor = surfaceColor;
      
      // Enhanced rim light for liquid
      float rim = (1.0 - mask) * smoothstep(0.0, 0.15, mask);
      finalColor += vec3(0.4, 0.4, 0.5) * rim * 0.6; 
      
      // Global silhouette rim for background separation
      float silhouetteRim = pow(1.0 - max(0.0, dot(viewDir, normal)), 3.0);
      finalColor += vec3(0.2, 0.2, 0.25) * silhouetteRim * 0.3;

      // BLACKOUT LOGIC
      finalColor *= uIntroProgress;
      
      // Alpha Logic: Front face gets a hole (where mouse is), Back face stays opaque (video visible inside)
      float alpha = uGlobalOpacity;
      if (gl_FrontFacing) {
          alpha *= mask; // Mouse area (where mask is 0) becomes transparent
      }
      gl_FragColor = vec4(finalColor, alpha);
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

// --- Global State for Intro ---
let introPlayed = false;

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

    return <imageRevealMaterial ref={ref} attach={attach} uTexture={texture} uVideoSize={videoSize} transparent={true} side={THREE.DoubleSide} depthWrite={true} />;
});

const ChevronGeometry = () => {
    const thickness = 0.08; // Thicker as requested
    const length = 0.45;
    const h = length / 2;
    return (
        <group>
            <mesh position={[-h, 0, 0]}><boxGeometry args={[length, thickness, thickness]} /><meshStandardMaterial color="white" /></mesh>
            <mesh position={[0, -h, 0]}><boxGeometry args={[thickness, length, thickness]} /><meshStandardMaterial color="white" /></mesh>
            <mesh position={[0, 0, -h]}><boxGeometry args={[thickness, thickness, length]} /><meshStandardMaterial color="white" /></mesh>
            <mesh position={[0, 0, 0]}><boxGeometry args={[thickness, thickness, thickness]} /><meshStandardMaterial color="white" /></mesh>
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

const INNER_CUBE_VIDEO = "/assets/cube_video.mp4";

const InnerVideoFace = ({ url, attach, offset }: { url: string; attach: string; offset: number }) => {
    // Unique URL per instance to force separate video textures for staggering
    const instanceUrl = useMemo(() => `${url}#t=${offset}`, [url, offset]);
    const texture = useVideoTexture(instanceUrl, {
        unsuspend: 'canplay',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: 'Anonymous',
        playsInline: true
    });

    useEffect(() => {
        const video = texture.image;
        if (video instanceof HTMLVideoElement) {
            video.currentTime = offset;

            const handleResize = () => {
                if (video.videoWidth && video.videoHeight) {
                    const videoAspect = video.videoWidth / video.videoHeight;
                    const targetAspect = 1.0; // Square face

                    if (videoAspect > targetAspect) {
                        // Landscape video - crop sides
                        texture.repeat.set(targetAspect / videoAspect, 1);
                        texture.offset.set((1 - (targetAspect / videoAspect)) / 2, 0);
                    } else {
                        // Portrait video - crop top/bottom
                        texture.repeat.set(1, videoAspect / targetAspect);
                        texture.offset.set(0, (1 - (videoAspect / targetAspect)) / 2);
                    }
                    texture.matrixAutoUpdate = false;
                    texture.updateMatrix();
                }
            };

            if (video.readyState >= 1) handleResize();
            video.addEventListener('loadedmetadata', handleResize);
            return () => video.removeEventListener('loadedmetadata', handleResize);
        }
    }, [texture, offset]);

    return <meshStandardMaterial attach={attach} map={texture} metalness={0.1} roughness={0.2} />;
};

const InnerCube = React.forwardRef<THREE.Mesh>((_, ref) => {
    return (
        <mesh ref={ref} scale={[0.99, 0.99, 0.99]}>
            <boxGeometry args={[3.0, 3.0, 3.0]} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <InnerVideoFace key={i} url={INNER_CUBE_VIDEO} attach={`material-${i}`} offset={i * 10} />
            ))}
        </mesh>
    );
});

const TacticalText: React.FC<{ children: React.ReactNode; visible: boolean; className?: string }> = ({ children, visible, className = "" }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`relative overflow-hidden transition-[width] duration-500 ease-[0.16,1,0.3,1] ${visible ? 'w-full' : 'w-0'}`}>
                <span className="font-bold tracking-tighter text-xl md:text-3xl text-white uppercase leading-none font-sans whitespace-nowrap drop-shadow-md">
                    {children}
                </span>
            </div>
        </div>
    );
};

const ShowcaseCube: React.FC<{ videos?: string[], scale?: number; sectionRef: React.RefObject<HTMLElement | null>, onContactClick?: () => void }> = ({ videos = [], scale = 1, sectionRef, onContactClick }) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const materialRefs = useRef<any[]>([]);
    const chevronRefs = useRef<THREE.Group[]>([]);
    const isAssembled = useRef(false); // Start as false to see the expansion effect
    const [currentPhase, setCurrentPhase] = useState(0);
    const [loadProgress, setLoadProgress] = useState(0);
    const loadProgressRef = useRef(0);

    const { viewport } = useThree();

    const timer = useRef(0);
    const introPhase = useRef(0);

    // Skip intro if already played in this session (reset on refresh)
    useEffect(() => {
        if (introPlayed) {
            timer.current = 10.0;
            introPhase.current = 1.0;
            setLoadProgress(101);
            loadProgressRef.current = 101;
        } else {
            // Lock scroll for 3 seconds during the loading phase + expansion
            document.body.style.overflow = 'hidden';
            const unlockTimer = setTimeout(() => {
                document.body.style.overflow = '';
            }, 3000);
            return () => {
                clearTimeout(unlockTimer);
                document.body.style.overflow = '';
            };
        }
    }, []);

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
        phase1Mouse: new THREE.Vector2(-0.1, 0),
        phase2Mouse: new THREE.Vector2(0.3, 0),
        tempVec: new THREE.Vector2(0, 0),
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
            // Block interaction during loading phase (first 3 seconds) unless already played
            if (timer.current < 3.0 && !introPlayed) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const isAtTop = Math.abs(rect.top) < 10;

            const now = Date.now();
            const direction = Math.sign(e.deltaY);

            const shouldTrap = isAtTop && (
                (direction > 0 && currentPhase < 4) ||
                (direction < 0 && currentPhase > 0)
            );

            if (shouldTrap) {
                if (e.cancelable) e.preventDefault();

                if (now - lastScrollTime.current > 1200) {
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
        const dt = Math.max(0.0001, Math.min(delta, 0.05));
        const time = state.clock.elapsedTime;
        const s = stateRef.current;
        timer.current += dt;

        // Cinematic Start Sequencer
        // 0.0s - 2.0s: Total Silence (Invisible)
        // 2.0s - 4.0s: Small Cube + Tactical Loading
        // 4.0s+: Full Expansion

        const elapsed = timer.current;

        // Visibility Logic
        globalOpacity.current = 1.0;

        // Intro Expansion Logic (Starts at 2.0s)
        if (elapsed > 2.0 && introPhase.current < 1) {
            introPhase.current += dt * 1.5;
            if (introPhase.current >= 1) {
                introPhase.current = 1;
                introPlayed = true; // Mark as played only when finished
            }
        }

        // Tactical erratic loader logic (Starts at 0.0s, ends at 1.0s, holds until 2.0s)
        if (elapsed < 2.0) {
            let targetP = 0;
            if (elapsed < 0.2) targetP = Math.min(15, elapsed * 75);
            else if (elapsed < 0.5) targetP = 45;
            else if (elapsed < 0.6) targetP = 48;
            else if (elapsed < 0.9) targetP = 88;
            else if (elapsed < 1.1) targetP = 98;
            else targetP = 100;

            loadProgressRef.current = THREE.MathUtils.lerp(loadProgressRef.current, targetP, dt * 10.0);
            const displayP = Math.floor(loadProgressRef.current);
            if (displayP !== loadProgress) setLoadProgress(displayP);
        } else if (elapsed >= 2.0 && loadProgress !== 101) {
            setLoadProgress(101); // Hide at 2.0s
        }

        s.lerpPhase = THREE.MathUtils.lerp(s.lerpPhase, currentPhase, dt * 5.0);

        let activeMouse = globalMouse.current;
        let targetInfluence = 1.0;

        if (currentPhase === 1) {
            activeMouse = s.phase1Mouse;
            targetInfluence = 1.5;
        } else if (currentPhase === 2) {
            activeMouse = s.phase2Mouse;
            targetInfluence = 1.5;
        }

        s.lerpMouse.lerp(activeMouse, dt * 5.0);
        const moveVel = s.tempVec.subVectors(activeMouse, s.prevMouse).divideScalar(dt);
        s.mouseVel.lerp(moveVel, dt * 8.0);
        s.prevMouse.copy(activeMouse);

        // Calculate base scale: starts at 0.15 (small cube) during delay, then expands to 1.0
        const easedP = easeInOutQuart(introPhase.current);
        let targetScale = 0.15 + easedP * 0.85;

        // Phase 3+ additional expansion
        if (s.lerpPhase > 2.2) {
            const p3 = Math.min(1, (s.lerpPhase - 2.2) * 2);
            targetScale = 1.0 + p3 * 0.15;
        }

        const force = (targetScale - s.springScale) * 80.0;
        s.springVel += (force - s.springVel * 15.0) * dt;
        s.springScale += s.springVel * dt;

        if (groupRef.current && meshRef.current) {
            meshRef.current.scale.setScalar(s.springScale);
            if (innerMeshRef.current) innerMeshRef.current.scale.setScalar(s.springScale * 0.99);

            let posX = 0;
            const offset = viewport.width * 0.18;
            const P = s.lerpPhase;

            if (P < 1) {
                posX = THREE.MathUtils.lerp(0, -offset, P);
            } else if (P < 2) {
                posX = THREE.MathUtils.lerp(-offset, offset, P - 1);
            } else {
                posX = THREE.MathUtils.lerp(offset, 0, Math.min(1, P - 2));
            }

            let posY = s.lerpMouse.y * 0.2 + Math.sin(time * 0.4) * 0.05;
            if (P > 2) {
                posY -= Math.min(1, P - 2) * 0.3;
            }

            groupRef.current.position.x = posX + s.lerpMouse.x * 0.2;
            groupRef.current.position.y = posY;

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
                const expand = (1.0 + (Math.sin(time * 1.5 + i) * 0.02)) * s.springScale;
                ref.position.set(data.pos[0] * expand, data.pos[1] * expand, data.pos[2] * expand);

                // Dynamic thickness: start super thin (0.3) and expand to full thickness (1.0)
                const thicknessScale = 0.3 + introPhase.current * 0.7;
                ref.scale.set(thicknessScale, thicknessScale, thicknessScale).multiply(new THREE.Vector3(...data.sign));
            });
        }

        materialRefs.current.forEach(mat => {
            if (mat && mat.uniforms) {
                mat.uniforms.uTime.value = time;
                mat.uniforms.uMouse.value.copy(s.lerpMouse);
                mat.uniforms.uVelocity.value.copy(s.mouseVel);
                mat.uniforms.uAspect.value = viewport.width / viewport.height;
                mat.uniforms.uGlobalOpacity.value = globalOpacity.current;
                // Give it a tiny bit of visibility (0.05) even when black
                mat.uniforms.uIntroProgress.value = 0.05 + introPhase.current * 0.95;
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

                    {/* Minimalist Tactical Loader - Appears at 0s, Disappears at 2s */}
                    {loadProgress < 101 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-24 opacity-100">
                            <span className="font-mono text-[12px] text-white font-black tracking-widest">
                                {loadProgress < 101 && loadProgress > 100 ? 100 : loadProgress}%
                            </span>
                        </div>
                    )}

                    {/* Discrete Scroll Indicator - Visible only in Phase 0 after loading */}
                    <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-1000 ${currentPhase === 0 && loadProgress >= 101 ? 'opacity-40' : 'opacity-0'}`}>
                        <span className="font-mono text-[9px] text-white tracking-[0.5em] uppercase">Scroll Down</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-px h-8 bg-gradient-to-b from-white to-transparent"
                        />
                    </div>

                    {/* Phase 1: Right */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-12 md:right-44 max-w-4xl text-right">
                        <TacticalText visible={isPhase1}>
                            We Don't Just Build <span className="text-[#FF5000]">Brands</span>
                        </TacticalText>
                    </div>

                    {/* Phase 2: Left */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-12 md:left-44 max-w-4xl text-left">
                        <TacticalText visible={isPhase2}>
                            We Build <span className="text-[#FF5000]">Growth Engines</span>
                        </TacticalText>
                    </div>

                    {/* Phase 3+: Center Button */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-28 flex flex-col items-center transition-opacity duration-600 ${isPhase3Plus ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                        <button
                            onClick={onContactClick}
                            className="relative px-10 py-5 border border-white bg-white pointer-events-auto"
                        >
                            <span className="relative z-10 text-sm font-bold tracking-[0.3em] uppercase text-black">
                                LET'S BUILD SOMETHING REAL
                            </span>
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

            <InnerCube ref={innerMeshRef} />

            <group>
                {cornerData.map((data, i) => (
                    <TechChevron key={i} position={[0, 0, 0]} scaleSign={data.sign} ref={(el) => { if (el) chevronRefs.current[i] = el; }} />
                ))}
            </group>
        </group>
    );
};

// --- Main Hero Component ---
const CUBE_VIDEO_URL = "/assets/cube_video.mp4";

export const Hero: React.FC<{ onContactClick?: () => void }> = ({ onContactClick }) => {
    const videos = useMemo(() => [
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL
    ], []);
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section id="home" ref={sectionRef} className="h-screen w-full relative bg-[#050505] overflow-hidden">
            <Canvas dpr={[1, 1.5]} gl={{ alpha: false, antialias: true }} onCreated={({ gl }) => {
                gl.setClearColor(0x050505, 1);
            }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10.5]} fov={45} />
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={2.5} />
                <pointLight position={[-10, 5, 10]} intensity={1.5} color="#ffffff" />
                <Environment preset="city" />
                <Suspense fallback={null}>
                    <ShowcaseCube videos={videos} scale={1} sectionRef={sectionRef} onContactClick={onContactClick} />
                </Suspense>
            </Canvas>

            {/* Scroll Indicator Removed */}
        </section>
    );
};
