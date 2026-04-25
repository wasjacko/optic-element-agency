import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useInView } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree, ThreeElement } from '@react-three/fiber';
import { shaderMaterial, useVideoTexture, Html, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import homeContent from '../src/data/homeContent.json';

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
        uWhiteOut: 1.0,
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
    precision mediump float;
    uniform float uTime;
    uniform float uInfluence;
    uniform float uGlobalOpacity;
    uniform float uIntroProgress;
    uniform vec2 uMouse;
    uniform vec2 uVelocity;
    uniform float uAspect;
    uniform sampler2D uTexture;
    uniform vec2 uVideoSize;
    uniform float uIntroFlash;
    uniform float uWhiteOut;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vScreenPos;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      vec3 normal = normalize(vNormal);
      
      // OPTIMIZATION: Simplified distortion
      vec2 distortedScreenPos = vScreenPos + vec2(sin(vUv.y * 5.0 + uTime * 0.5), cos(vUv.x * 5.0)) * 0.005;
      
      // OPTIMIZATION: Cheaper distance/mask
      float dist = distance(distortedScreenPos * vec2(uAspect, 1.0), uMouse * vec2(uAspect, 1.0));
      // Simplified bulge/radius calc
      float speed = length(uVelocity);
      float dynamicRadius = (0.25 * uInfluence) * (1.0 + speed * 0.1); 
      float mask = smoothstep(dynamicRadius - 0.04, dynamicRadius + 0.04, dist);
      
      // OPTIMIZATION: Cheaper Fresnel
      float NdV = max(0.0, dot(viewDir, normal));
      float fresnel = 0.02 + 0.98 * (1.0 - NdV); 
      
      // OPTIMIZATION: Single pass reflection gradient
      vec3 refDir = reflect(-viewDir, normal);
      float refY = refDir.y * 0.5 + 0.5;
      vec3 envColor = mix(vec3(0.01), vec3(0.8), smoothstep(0.4, 0.6, refY));
          
      // OPTIMIZATION: Single light specular
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float spec = pow(max(dot(normal, normalize(lightDir + viewDir)), 0.0), 30.0);
      
      vec3 finalBase = vec3(0.005) + envColor * fresnel + spec;
      
      // Video mapping
      vec2 uv = vUv;
      float videoAspect = uVideoSize.x / max(0.001, uVideoSize.y);
      if (videoAspect > 1.0) {
          uv.x = (uv.x - 0.5) * (1.0/videoAspect) + 0.5;
      } else {
          uv.y = (uv.y - 0.5) * videoAspect + 0.5;
      }
      
      vec3 finalColor = finalBase;
      
      // Rim
      float rim = (1.0 - mask) * smoothstep(0.0, 0.15, mask);
      finalColor += vec3(0.3) * rim; 
      
      finalColor = mix(finalColor, vec3(1.0), uWhiteOut);
      finalColor *= uIntroProgress;
      finalColor += vec3(uIntroFlash);
      
      float alpha = uGlobalOpacity;
      if (gl_FrontFacing) {
          alpha *= mask;
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
            uIntroProgress?: number;
            uIntroFlash?: number;
        };
    }
}

// --- Global State for Intro ---
// --- Global State for Intro (Module level to survive React lifecycle but reset on page refresh) ---
let hasIntroPlayed = false;

// Reset on Vite HMR so the intro replays during development
if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
        hasIntroPlayed = false;
    });
}


// --- Components ---
const VideoFace = React.forwardRef<any, { texture: THREE.VideoTexture; attach: string; videoSize: THREE.Vector2 }>(({ texture, attach, videoSize }, ref) => {
    return <imageRevealMaterial ref={ref} attach={attach} uTexture={texture} uVideoSize={videoSize} transparent={true} side={THREE.DoubleSide} depthWrite={true} />;
});

const ChevronGeometry = () => {
    const thickness = 0.06; // Slightly thicker for sharper edges on mobile
    const length = 0.45;
    const h = length / 2;
    return (
        <group>
            <mesh position={[-h, 0, 0]}><boxGeometry args={[length, thickness, thickness]} /><meshBasicMaterial color="white" toneMapped={false} /></mesh>
            <mesh position={[0, -h, 0]}><boxGeometry args={[thickness, length, thickness]} /><meshBasicMaterial color="white" toneMapped={false} /></mesh>
            <mesh position={[0, 0, -h]}><boxGeometry args={[thickness, thickness, length]} /><meshBasicMaterial color="white" toneMapped={false} /></mesh>
            <mesh position={[0, 0, 0]}><boxGeometry args={[thickness, thickness, thickness]} /><meshBasicMaterial color="white" toneMapped={false} /></mesh>
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

const INNER_CUBE_VIDEO = "/assets/oe-showreel-2026.mp4";

const InnerCube = React.forwardRef<THREE.Mesh, { texture: THREE.VideoTexture }>(({ texture }, ref) => {
    const localTexture = useMemo(() => texture.clone(), [texture]);

    useEffect(() => {
        const video = localTexture.image;
        if (video instanceof HTMLVideoElement) {
            const handleResize = () => {
                if (video.videoWidth && video.videoHeight) {
                    const videoAspect = video.videoWidth / video.videoHeight;
                    const targetAspect = 1.0;
                    if (videoAspect > targetAspect) {
                        localTexture.repeat.set(targetAspect / videoAspect, 1);
                        localTexture.offset.set((1 - (targetAspect / videoAspect)) / 2, 0);
                    } else {
                        localTexture.repeat.set(1, videoAspect / targetAspect);
                        localTexture.offset.set(0, (1 - (videoAspect / targetAspect)) / 2);
                    }
                    localTexture.matrixAutoUpdate = false;
                    localTexture.updateMatrix();
                }
            };
            if (video.readyState >= 1) handleResize();
            video.addEventListener('loadedmetadata', handleResize);
            return () => video.removeEventListener('loadedmetadata', handleResize);
        }
    }, [localTexture]);

    return (
        <mesh ref={ref} scale={[0.99, 0.99, 0.99]}>
            <boxGeometry args={[3.0, 3.0, 3.0]} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <meshBasicMaterial key={i} attach={`material-${i}`} map={localTexture} toneMapped={false} />
            ))}
        </mesh>
    );
});

const TacticalText: React.FC<{ children: React.ReactNode, visible: boolean, className?: string, color?: string, weight?: string, size?: string, tracking?: string, noAnimation?: boolean, shadow?: string }> = ({ children, visible, className = "", color, weight = "font-black", size = "text-xl md:text-4xl", tracking = "tracking-tighter", noAnimation = false, shadow = "drop-shadow-md" }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`relative overflow-hidden ${noAnimation ? '' : 'transition-[width] duration-1000 ease-[0.16,1,0.3,1]'} ${visible ? 'w-full' : 'w-0'}`}>
                <span className={`${weight} ${tracking} ${size} uppercase leading-none font-sans whitespace-nowrap ${shadow}`} style={{ color: color || '#ffffff' }}>
                    {children}
                </span>
            </div>
        </div>
    );
};

const GlitchReveal: React.FC<{ text: string, delay?: number, className?: string, speed?: number, style?: React.CSSProperties }> = ({ text, delay = 0, className = "", speed = 15, style }) => {
    const [displayText, setDisplayText] = useState("");
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!visible) return;

        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&[]{}<>";
        let iterations = 0;

        const interval = setInterval(() => {
            setDisplayText(
                text.split("").map((char, index) => {
                    if (char === " ") return " ";
                    if (index < iterations) return text[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
            }
            iterations += 1 / 2;
        }, speed);

        return () => clearInterval(interval);
    }, [visible, text, speed]);

    return (
        <div className={`${className} ${visible ? 'opacity-100' : 'opacity-0'}`} style={style}>
            {displayText || "\u00A0"}
        </div>
    );
};

const ShowcaseCube: React.FC<{ videos?: string[], scale?: number; sectionRef: React.RefObject<HTMLElement | null>, onContactClick?: () => void, onIntroExpands?: () => void, onIntroComplete?: () => void, content?: any, theme?: any, currentPhase: number, isMobile?: boolean, onExpansionStart?: () => void, onCubeClick?: () => void }> = ({ videos = [], scale = 1, sectionRef, onContactClick, onIntroExpands, onIntroComplete, content, theme, currentPhase, isMobile, onExpansionStart, onCubeClick }) => {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const innerMeshRef = useRef<THREE.Mesh>(null);
    const materialRefs = useRef<any[]>([]);
    const chevronRefs = useRef<THREE.Group[]>([]);
    const flashRef = useRef(0);

    // LOAD VIDEO ONCE (SHARED) - Optimization for fast loading & Shader Fix
    const sharedTexture = useVideoTexture(INNER_CUBE_VIDEO, {
        unsuspend: 'loadedmetadata',
        muted: true,
        loop: true,
        start: true,
        crossOrigin: 'Anonymous',
        playsInline: true
    });

    const { viewport, gl } = useThree();

    useEffect(() => {
        sharedTexture.minFilter = THREE.LinearMipmapLinearFilter;
        sharedTexture.magFilter = THREE.LinearFilter;
        sharedTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
        sharedTexture.generateMipmaps = true;
        sharedTexture.needsUpdate = true;
    }, [sharedTexture, gl]);

    const isAssembled = useRef(false); // Start as false to see the expansion effect

    // START DIRECTLY AT PHASE 3 IF INTRO ALREADY PLAYED

    const timer = useRef(0);
    const introPhase = useRef(0);
    const expansionStartFired = useRef(false); // Ensures onExpansionStart is called only once

    // Skip intro if already played in this session (reset on refresh)
    // Skip intro if already played in this session (reset on refresh)
    useEffect(() => {
        if (hasIntroPlayed) {
            // JUMP DIRECTLY TO PHASE 3 (READY TO BUILD)
            // No white screen, no slide-ins, just the cube and the final button.
            timer.current = 15.0; // Way past early phases
            introPhase.current = 1.0; // Fully expanded
            if (onIntroExpands) onIntroExpands();
            if (onIntroComplete) onIntroComplete();
        }
    }, [onIntroComplete]);

    const globalOpacity = useRef(0.0);
    const lastScrollTime = useRef(0);
    const globalMouse = useRef(new THREE.Vector2(0, 0));

    const [videoSize, setVideoSize] = useState(new THREE.Vector2(1, 1));

    useEffect(() => {
        const video = sharedTexture.image;
        if (video instanceof HTMLVideoElement) {
            const updateSize = () => {
                if (video.videoWidth && video.videoHeight) setVideoSize(new THREE.Vector2(video.videoWidth, video.videoHeight));
            };
            if (video.readyState >= 1) updateSize();
            video.addEventListener('loadedmetadata', updateSize);
            return () => video.removeEventListener('loadedmetadata', updateSize);
        }
    }, [sharedTexture]);

    const stateRef = useRef({
        lerpPhase: hasIntroPlayed ? 3.0 : 0, // On return: snap to Phase 3 (centered, no left-right sweep)
        rotation: new THREE.Euler(0, 0, 0),
        springScale: 0, // Always start at 0 — cube grows from nothing every time
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
    const bgGroupRef = useRef<THREE.Group>(null);

    // Dynamic Material for Background Grid
    const gridMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "white", transparent: true, opacity: 0.05, depthWrite: false }), []);

    useFrame((state, delta) => {
        const dt = Math.max(0.0001, Math.min(delta, 0.05));
        const time = state.clock.getElapsedTime();
        const s = stateRef.current;
        timer.current += dt;

        // ... (standard logic) ...

        // Mouse Parallax for HTML overlays
        const mx = s.lerpMouse.x * 30; // 30px max movement
        const my = s.lerpMouse.y * 30;





        // Cinematic Start Sequencer (COHESIVE SYSTEM)
        // 0.0s: System Init (Text 1) -> BAM
        // 0.6s: System Verification (Text 2) -> BAM
        // 1.2s: LOADER START (Right Side + Cube Init) -> BAM
        // 3.5s: ACTIVATION (Expansion + UI Clear) (Delayed for realistic preload)

        const elapsed = timer.current;
        const CUBE_START = 0.5;
        const LOADER_START = 0.5;
        // Speeds up mobile intro so it doesn't drag out and freeze the device
        const INTRO_START = isMobile ? 1.5 : 3.5;
        const EXIT_TIME = isMobile ? 3.0 : 5.0;

        // Background Grid: TACTICAL GLITCH (Digital System Reaction)
        // Stable State
        if (bgGroupRef.current) {
            bgGroupRef.current.position.set(0, 0, -2);
            bgGroupRef.current.scale.set(1, 1, 1);
            bgGroupRef.current.rotation.z = 0;
        }
        gridMaterial.opacity = 0.05;

        // Visibility Logic
        globalOpacity.current = 1.0;

        // Intro Expansion Logic (Starts at INTRO_START seconds)
        if (elapsed > INTRO_START && introPhase.current < 1) {
            // Signal loader hide ONCE as soon as cube starts expanding
            if (!expansionStartFired.current && onExpansionStart) {
                expansionStartFired.current = true;
                onExpansionStart();
            }
            introPhase.current += dt * 8.0; // Hyper fast expansion
            if (introPhase.current >= 1) {
                introPhase.current = 1;
                if (!hasIntroPlayed) {
                    hasIntroPlayed = true;
                    if (onIntroExpands) onIntroExpands();
                    if (onIntroComplete) onIntroComplete();
                }
            }
        }



        s.lerpPhase = THREE.MathUtils.lerp(s.lerpPhase, currentPhase, dt * 5.0);

        let activeMouse = globalMouse.current;
        let targetInfluence = 1.0;

        if (isMobile) {
            // Keep it perfectly centered horizontally, but moved up slightly more to match new cube height
            activeMouse = new THREE.Vector2(0, 0.45);

            // Reveal when loading is done
            targetInfluence = elapsed > 2.5 ? 1.8 : 0.0;
        } else {
            if (currentPhase === 1) {
                activeMouse = s.phase1Mouse;
                targetInfluence = 1.5;
            } else if (currentPhase === 2) {
                activeMouse = s.phase2Mouse;
                targetInfluence = 1.5;
            }
            // Phase 0: use actual mouse position so the shader hole follows cursor during expansion
        }

        s.lerpMouse.lerp(activeMouse, dt * 5.0);
        const moveVel = s.tempVec.subVectors(activeMouse, s.prevMouse).divideScalar(dt);
        s.mouseVel.lerp(moveVel, dt * 8.0);
        s.prevMouse.copy(activeMouse);

        // Flash Logic
        if (elapsed > INTRO_START && flashRef.current === 0) {
            flashRef.current = 1.0;
        }
        flashRef.current = THREE.MathUtils.lerp(flashRef.current, 0, dt * 5.0);

        // WhiteOut Logic
        const whiteOutVal = elapsed < INTRO_START ? 1.0 : Math.max(0, 1.0 - (elapsed - INTRO_START) * 8.0);

        // Calculate base scale
        let targetScale = 0.001;

        if (isMobile) {
            targetScale = 0.55; // Reduced from 0.70
            // Snap the spring instantly so there's no growth animation on mobile
            if (s.springScale < 0.5) {
                s.springScale = 0.55;
            }
        } else {
            const easedP = easeInOutQuart(introPhase.current);
            if (elapsed > CUBE_START - 0.2) {
                const appear = Math.min(1, (elapsed - CUBE_START + 0.2) * 5.0); // Fast initial small appearance
                targetScale = 0.15 * appear;
            }

            targetScale += easedP * 0.85;

            // Dynamic Shockwave on Cube Scale during Intro
            if (elapsed > INTRO_START && elapsed < INTRO_START + 0.2) { // Shorter shock
                const shock = Math.sin((elapsed - INTRO_START) * Math.PI * 4.0) * 0.15;
                targetScale += shock;
            }

            // Phase 3+ modification: Cube smaller and higher
            if (s.lerpPhase > 2.0) {
                const p3 = Math.min(1, (s.lerpPhase - 2.0) * 2);
                targetScale = 1.0 - p3 * 0.15;
            }
        }

        const force = (targetScale - s.springScale) * 90.0; // Smoother Force (was 120)
        s.springVel += (force - s.springVel * 25.0) * dt; // Higher Damping (was 15)
        s.springScale += s.springVel * dt;

        if (groupRef.current && meshRef.current) {
            meshRef.current.scale.setScalar(s.springScale);
            if (innerMeshRef.current) innerMeshRef.current.scale.setScalar(s.springScale * 0.99);

            let posX = 0;
            let posY = s.lerpMouse.y * 0.2 + Math.sin(time * 0.4) * 0.05;
            let rotX = 0.15;
            let rotY = 0.4;

            if (isMobile) {
                posX = 0;
                posY += 1.5; // Fixed height on mobile

                // Static rotation on mobile (Phase 3 equivalent)
                rotY = 1.6 + 1.0;
                rotX = 0.2 - 0.1;
            } else {
                const offset = viewport.width * 0.08;
                const P = s.lerpPhase;

                if (P < 1) {
                    posX = THREE.MathUtils.lerp(0, -offset, P);
                } else if (P < 2) {
                    posX = THREE.MathUtils.lerp(-offset, offset, P - 1);
                } else {
                    posX = THREE.MathUtils.lerp(offset, 0, Math.min(1, P - 2));
                }

                if (P > 2) {
                    // Move higher in phase 3
                    posY += Math.min(1, P - 2) * 0.5;
                }

                if (P > 0 && P <= 1) {
                    rotY = 0.4 + P * 0.5;
                    rotX = 0.15 + P * 0.15;
                } else if (P > 1 && P <= 2) {
                    rotY = 0.9 + (P - 1) * 0.7;
                    rotX = 0.3 - (P - 1) * 0.1;
                } else if (P > 2) {
                    rotY = 1.6 + (P - 2) * 1.0;
                    rotX = 0.2 - (P - 2) * 0.1;
                }
            }

            groupRef.current.position.x = posX + s.lerpMouse.x * 0.2;
            groupRef.current.position.y = posY;

            // JITTER during loading (Only when visible)
            if (elapsed > CUBE_START && elapsed < INTRO_START) {
                rotX += (Math.random() - 0.5) * 0.05;
                rotY += (Math.random() - 0.5) * 0.05;
            }

            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX + (-s.lerpMouse.y * 0.3), dt * 3.0);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY + (s.lerpMouse.x * 0.3), dt * 3.0);
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

                if (isMobile) {
                    // On mobile, force the outer metal shader to be fully visible and solid immediately
                    mat.uniforms.uIntroProgress.value = 1.0;
                    if (mat.uniforms.uWhiteOut) mat.uniforms.uWhiteOut.value = 0.0;

                    // Force influence to exactly 0 ONLY at the very beginning to fix initial flash
                    if (elapsed < 0.2) {
                        mat.uniforms.uInfluence.value = 0.0;
                    }
                } else {
                    // Give it a tiny bit of visibility (0.05) even when black
                    mat.uniforms.uIntroProgress.value = 0.05 + introPhase.current * 0.95;
                    if (mat.uniforms.uWhiteOut) mat.uniforms.uWhiteOut.value = whiteOutVal;
                }

                if (mat.uniforms.uIntroFlash) mat.uniforms.uIntroFlash.value = flashRef.current;
                mat.uniforms.uInfluence.value = THREE.MathUtils.lerp(mat.uniforms.uInfluence.value, targetInfluence, dt * 2.0);
            }
        });
    });



    return (
        <>
            {/* Static 3D Background Grid (Behind Cube) */}
            <group ref={bgGroupRef} position={[0, 0, -2]}>
                {/* Vertical Lines (Left, Center, Right) */}
                {[-6, 0, 6].map((x, i) => (
                    <mesh key={`v-${i}`} position={[x, 0, 0]}>
                        <planeGeometry args={[0.02, 100]} />
                        <meshBasicMaterial color="white" transparent opacity={0.05} depthWrite={false} />
                    </mesh>
                ))}

                {/* Horizontal Line (Horizon) */}
                <mesh position={[0, 0, 0]}>
                    <planeGeometry args={[100, 0.02]} />
                    <meshBasicMaterial color="white" transparent opacity={0.05} depthWrite={false} />
                </mesh>
            </group>

            <group ref={groupRef} scale={scale}>


                <mesh 
                    ref={meshRef}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onCubeClick) onCubeClick();
                    }}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; }}
                >
                    <boxGeometry args={[3, 3, 3]} />
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                        <VideoFace key={index} texture={sharedTexture} videoSize={videoSize} attach={`material-${index}`} ref={(el) => { materialRefs.current[index] = el; }} />
                    ))}
                </mesh>

                <InnerCube ref={innerMeshRef} texture={sharedTexture} />

                <group>
                    {cornerData.map((data, i) => (
                        <TechChevron key={i} position={[0, 0, 0]} scaleSign={data.sign} ref={(el) => { if (el) chevronRefs.current[i] = el; }} />
                    ))}
                </group>
            </group>
        </>
    );
};
// --- Main Hero Component ---
const CUBE_VIDEO_URL = "/assets/oe-showreel-2026.mp4";

export interface HeroProps {
    data?: any;
    theme?: any;
    onContactClick?: () => void;
    onIntroComplete?: () => void;
    onIntroExpands?: () => void;
    isIntroAlreadyDone?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ data, theme, onContactClick, onIntroExpands, onIntroComplete, isIntroAlreadyDone }) => {
    const content = data || homeContent.hero;
    const currentTheme = theme || homeContent.theme; // Fallback to import if no prop

    const videos = useMemo(() => [
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL,
        CUBE_VIDEO_URL
    ], []);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { margin: "100px" });
    const phaseRef = useRef(0);
    const [currentPhase, setCurrentPhase] = useState(0);
    const [isVideoExpanded, setIsVideoExpanded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(hasIntroPlayed ? 101 : 0);
    const lastScrollTime = useRef(0);
    // Tracks whether the cube intro expansion is done (allows phase scrolling)
    const [introExpanded, setIntroExpanded] = useState(hasIntroPlayed);
    // Tracks whether all phases are done and site should unlock
    const [phasesComplete, setPhasesComplete] = useState(false);

    // Sync ref with state (though we'll update ref first in handler)
    useEffect(() => {
        if (isVideoExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isVideoExpanded]);

    // Sync ref with state (though we'll update ref first in handler)
    useEffect(() => {
        phaseRef.current = currentPhase;
    }, [currentPhase]);

    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768));
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);


    // When phases are complete, notify parent
    useEffect(() => {
        if (phasesComplete && onIntroComplete) {
            onIntroComplete();
        }
    }, [phasesComplete, onIntroComplete]);

    // On mobile, there are no scroll phases — unlock directly when intro expands
    useEffect(() => {
        if (isMobile && introExpanded && !phasesComplete) {
            setPhasesComplete(true);
        }
    }, [isMobile, introExpanded, phasesComplete]);

    // If parent says intro is already done (e.g. navigated away and back), skip everything
    useEffect(() => {
        if (isIntroAlreadyDone && !phasesComplete) {
            setIntroExpanded(true);
            setPhasesComplete(true);
        }
    }, [isIntroAlreadyDone]);

    // Pure JS Scroll Lock - Controls phase transitions via scroll
    useEffect(() => {
        // Once phases are done (phase 4+), unlock everything
        if (phasesComplete || currentPhase >= 4) {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            return;
        }

        const preventScroll = (e: Event) => {
            if (isMobile) return;
            if (phaseRef.current >= 4) return;
            if (e.cancelable) e.preventDefault();
        };

        const handleWheel = (e: WheelEvent) => {
            if (isMobile) return;
            if (phaseRef.current >= 4) return;

            // Kill browser smooth scroll during phase transitions
            if (e.cancelable) e.preventDefault();

            if (!sectionRef.current) return;
            // Block phase changes until cube intro expansion is done
            if (!introExpanded) return;

            const now = Date.now();
            const delta = e.deltaY;
            if (Math.abs(delta) < 5) return;
            const direction = Math.sign(delta);
            const currentP = phaseRef.current;

            // Enforce a strict 1.2s delay between phases
            if (now - lastScrollTime.current > 1200) {
                const nextP = Math.max(0, Math.min(4, currentP + direction));
                if (nextP !== currentP) {
                    phaseRef.current = nextP;
                    setCurrentPhase(nextP);
                    lastScrollTime.current = now;

                    // Unlock the site when we reach Phase 4
                    if (nextP === 4) {
                        setPhasesComplete(true);
                    }
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchmove', preventScroll, { passive: false });

        // Lock body during phase transitions
        if (currentPhase < 4) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchmove', preventScroll);
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [loadProgress, isMobile, currentPhase, introExpanded, phasesComplete]);


    // Loader Logic — only runs on first visit
    useEffect(() => {
        // On return visits, loadProgress already starts at 101 — nothing to do
        if (hasIntroPlayed) return;

        const loaderSpeed = isMobile ? 10 : 25;
        const startDelay = isMobile ? 200 : 500;

        let interval: NodeJS.Timeout;
        const timer = setTimeout(() => {
            interval = setInterval(() => {
                setLoadProgress(prev => {
                    // If forced to 101+ from outside (expansion started), stop interval
                    if (prev > 100) {
                        clearInterval(interval);
                        return prev;
                    }
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 1;
                });
            }, loaderSpeed);
        }, startDelay);

        // Safety Reveal Timeout — in case animation never fires
        const safetyTimer = setTimeout(() => {
            if (!hasIntroPlayed) {
                hasIntroPlayed = true;
                setLoadProgress(101); // Force-hide loader
                setIntroExpanded(true);
            }
        }, isMobile ? 3000 : 8000);

        return () => {
            clearTimeout(timer);
            clearTimeout(safetyTimer);
            if (interval) clearInterval(interval);
        };
    }, [onIntroComplete]); // Run once on mount

    const isPhase1 = currentPhase === 1;
    const isPhase2 = currentPhase === 2;
    const isPhase3Plus = currentPhase >= 3;

    return (
        <section 
            id="home" 
            ref={sectionRef} 
            className="h-screen w-full relative overflow-hidden" 
            style={{ 
                backgroundColor: content?.backgroundColor || currentTheme?.background || '#050505',
                touchAction: currentPhase < 4 ? 'none' : 'auto'
            }}
        >
            {isInView && (
                <Canvas
                    dpr={isMobile ? [1.5, 3] : [1, 3]}
                    performance={{ min: 0.65 }}
                    gl={{
                        alpha: true,
                        antialias: true,
                        powerPreference: "high-performance",
                        stencil: false,
                        depth: true
                    }}
                    onCreated={({ gl }) => {
                        gl.setClearColor(0x000000, 0);
                    }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0, 10.5]} fov={45} />
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} intensity={2.0} />
                    <pointLight position={[-10, 5, 10]} intensity={1.0} color="#ffffff" />
                    <Suspense fallback={
                        <group position={[0, isMobile ? 1.5 : 0, 0]} rotation={[0.15, 0.4, 0.02]} scale={isMobile ? 0.7 : 0.15}>
                            <mesh>
                                <boxGeometry args={[3, 3, 3]} />
                                <meshBasicMaterial color="#111111" />
                            </mesh>
                        </group>
                    }>
                        <ShowcaseCube
                            videos={videos}
                            scale={1}
                            sectionRef={sectionRef}
                            onContactClick={onContactClick}
                            onIntroComplete={() => setIntroExpanded(true)}
                            content={content}
                            theme={currentTheme}
                            currentPhase={isMobile ? 3 : currentPhase}
                            isMobile={isMobile}
                            onIntroExpands={() => setIntroExpanded(true)}
                            onExpansionStart={() => setLoadProgress(101)}
                            onCubeClick={() => setIsVideoExpanded(true)}
                        />
                    </Suspense>
                </Canvas>
            )}

            {/* UI Overlay - Absolutely Static */}
            <div className="absolute inset-0 pointer-events-none z-10 w-full h-full">

                <style>{`
                    @keyframes simpleFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideInRight {
                        from { opacity: 0; transform: translateX(100px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes slideInLeft {
                        from { opacity: 0; transform: translateX(-100px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                    @keyframes simpleFadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes glitchHide {
                        0% { opacity: 1; transform: translate(0); clip-path: inset(0 0 0 0); }
                        20% { opacity: 0.9; transform: translate(-2px, 1px); clip-path: inset(20% 0 50% 0); }
                        40% { opacity: 0.5; transform: translate(2px, -1px); clip-path: inset(40% 0 10% 0); }
                        60% { opacity: 0.2; transform: translate(-1px, 2px); clip-path: inset(10% 0 70% 0); }
                        80% { opacity: 0.1; transform: translate(1px, -2px); clip-path: inset(0 0 0 0); }
                        100% { opacity: 0; transform: translate(0); clip-path: inset(0 0 0 0); }
                    }
                `}</style>

                {/* Intro Texts (Desktop Only) */}
                {!isMobile && (
                    <div className={`absolute top-1/2 -translate-y-1/2 left-6 md:left-12 flex flex-col md:flex-row items-start gap-12 md:gap-24 transition-opacity duration-500 ${loadProgress < 101 ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Block 1 */}
                        <div
                            className="flex flex-col justify-center py-1 gap-1 opacity-0"
                            style={{ animation: 'simpleFadeIn 0.5s ease-out 0.7s forwards, simpleFadeOut 0.3s ease-in 2.8s forwards' }}
                        >
                            <div className="font-ocr text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest leading-none">// OPTIC_ELEMENT_SYS</div>
                            <div className="font-ocr text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest leading-none">GROWTH.ENGINE.INIT</div>
                        </div>

                        {/* Block 2 */}
                        <div
                            className="flex flex-col justify-center py-1 gap-1 opacity-0"
                            style={{ animation: 'simpleFadeIn 0.5s ease-out 1.7s forwards, simpleFadeOut 0.3s ease-in 2.8s forwards' }}
                        >
                            <div className="font-ocr text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest leading-none">// OPTICELEMENT.SYSTEM</div>
                            <div className="font-ocr text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest leading-none">STRATEGY // EXEC</div>
                            <div className="font-ocr text-[8px] md:text-[9px] font-bold text-white uppercase tracking-widest leading-none">GLOBAL_COORDINATES</div>
                        </div>
                    </div>
                )}

                {/* Loader */}
                <div
                    className={`absolute md:top-1/2 bottom-[40vh] md:bottom-auto left-1/2 md:left-auto md:-translate-y-1/2 -translate-x-1/2 md:translate-x-0 md:right-32 pointer-events-none transition-opacity duration-300 ${loadProgress > 0 && loadProgress < 101 ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="text-center md:text-right" style={{ animation: loadProgress === 100 ? 'glitchHide 0.25s steps(3) 0.2s forwards' : 'none' }}>
                        <span className="font-ocr text-[14px] md:text-[16px] text-white font-medium tracking-widest">
                            {loadProgress < 100 ? loadProgress : 100}
                        </span>
                        <span className="font-ocr text-[10px] md:text-[12px] text-white font-normal align-top ml-1">%</span>
                    </div>
                </div>

                {/* MOBILE SPECIFIC UI */}
                {isMobile && (
                    <div className="absolute inset-0 z-10 w-full h-full flex flex-col justify-end items-center px-10 md:px-6 pb-[25vh] pointer-events-none">
                        <div
                            className={`transition-all duration-1000 ease-out flex flex-col items-center text-center gap-6 w-full max-w-sm uppercase ${loadProgress >= 100 ? 'translate-y-0 pointer-events-auto' : 'translate-y-8 pointer-events-none'}`}
                            style={{
                                opacity: loadProgress >= 100 ? 1 : 0,
                                visibility: loadProgress >= 100 ? 'visible' : 'hidden',
                                transitionDelay: loadProgress >= 100 ? '1500ms' : '0ms'
                            }}
                        >
                            <div className="flex flex-col gap-8 w-full items-center">
                                {/* Block 1 */}
                                <div className="flex flex-col items-center w-full gap-0">
                                    <h2 className="text-lg sm:text-xl font-black tracking-widest text-white/95 uppercase text-center w-full">
                                        {content?.phase1 || homeContent.hero.phase1}
                                    </h2>
                                    <h2 className="text-3xl sm:text-4xl font-black leading-none tracking-tighter drop-shadow-xl uppercase text-center w-full" style={{ color: content?.highlightColor || theme?.primary || homeContent.theme?.primary }}>
                                        {content?.phase1Highlight || homeContent.hero.phase1Highlight}
                                    </h2>
                                </div>
                                
                                {/* Block 2 */}
                                <div className="flex flex-col items-center w-full gap-0">
                                    <h2 className="text-lg sm:text-xl font-black tracking-widest text-white/95 uppercase text-center w-full">
                                        {content?.phase2 || homeContent.hero.phase2}
                                    </h2>
                                    <h2 className="text-3xl sm:text-4xl font-black leading-none tracking-tighter drop-shadow-xl uppercase text-center w-full" style={{ color: content?.highlightColor || theme?.primary || homeContent.theme?.primary }}>
                                        {content?.phase2Highlight || homeContent.hero.phase2Highlight}
                                    </h2>
                                </div>
                            </div>

                            <button
                                onClick={onContactClick}
                                className="mt-4 border border-white/20 px-10 py-4 font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl relative"
                                style={{ backgroundColor: content?.ctaBg || '#ffffff', color: content?.ctaText || '#000000' }}
                            >
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/30 z-20" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/30 z-20" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/30 z-20" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/30 z-20" />
                                {content?.cta || homeContent.hero.cta}
                            </button>
                        </div>
                    </div>
                )}

                {/* DESKTOP UI (PHASE SECTIONS) */}
                {!isMobile && (
                    <>
                        {/* Phase 1 Text */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-[22%] max-w-[90vw] md:max-w-4xl text-right">
                            {isPhase1 && (
                                <div className="flex flex-col md:flex-row items-end md:items-center justify-end gap-1 md:gap-2" style={{ animation: 'slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                                    <TacticalText visible={isPhase1} color="#ffffff">
                                        {content?.phase1 || homeContent.hero.phase1}
                                    </TacticalText>
                                    <TacticalText visible={isPhase1} color={content?.highlightColor || theme?.primary || homeContent.theme?.primary}>
                                        {content?.phase1Highlight || homeContent.hero.phase1Highlight}
                                    </TacticalText>
                                </div>
                            )}
                        </div>

                        {/* Phase 2 Text */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-[22%] max-w-[90vw] md:max-w-4xl text-left">
                            {isPhase2 && (
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-start gap-1 md:gap-2" style={{ animation: 'slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                                    <TacticalText visible={isPhase2} color="#ffffff">
                                        {content?.phase2 || homeContent.hero.phase2}
                                    </TacticalText>
                                    <TacticalText visible={isPhase2} color={content?.highlightColor || theme?.primary || homeContent.theme?.primary}>
                                        {content?.phase2Highlight || homeContent.hero.phase2Highlight}
                                    </TacticalText>
                                </div>
                            )}
                        </div>

                        {/* Phase 3+: Center Button */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-60 flex flex-col items-center transition-opacity duration-700 ${isPhase3Plus && introExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <button
                                onClick={onContactClick}
                                className="relative px-10 py-4 border-none pointer-events-auto group overflow-hidden"
                                style={{
                                    backgroundColor: content?.ctaBg || '#ffffff',
                                }}
                            >
                                {/* Brackets */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black/20 z-20" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-black/20 z-20" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-black/20 z-20" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black/20 z-20" />

                                <div className="relative z-10">
                                    <TacticalText
                                        visible={isPhase3Plus}
                                        color={content?.ctaText || '#000000'}
                                        weight="font-black"
                                        size="text-[10px] md:text-xs"
                                        tracking="tracking-[0.4em]"
                                        shadow=""
                                        noAnimation
                                    >
                                        {content?.cta || homeContent.hero.cta}
                                    </TacticalText>
                                </div>
                            </button>
                        </div>

                        {/* DESKTOP SCROLL INDICATOR */}
                        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-1000 ${loadProgress >= 101 ? 'opacity-40 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            <span className="font-ocr text-[8px] uppercase tracking-[0.3em] font-medium text-white">Scroll</span>
                            <div className="w-[1px] h-8 bg-white/20 relative overflow-hidden">
                                <motion.div
                                    className="w-full h-full bg-white origin-top"
                                    animate={{
                                        y: ['-100%', '100%'],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}

            </div>

            {/* Video Modal Overlay */}
            <AnimatePresence>
                {isVideoExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md pointer-events-auto"
                        onClick={() => setIsVideoExpanded(false)}
                    >
                        <button
                            className="absolute top-10 right-10 text-white font-ocr text-sm uppercase tracking-widest z-[110] hover:opacity-70 transition-opacity bg-black/50 px-4 py-2 backdrop-blur-md border border-white/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVideoExpanded(false);
                            }}
                        >
                            [ CLOSE ]
                        </button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="w-[95vw] md:w-[80vw] max-h-[85vh] relative flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <video
                                src={CUBE_VIDEO_URL}
                                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
                                autoPlay
                                controls
                                playsInline
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};
