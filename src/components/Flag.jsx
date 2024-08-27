import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import { easeOutCirc } from "../utils/Math";

export const Flag = () => {
    const { scene } = useGLTF("/models/flag.glb");
    const flagRef = useRef();
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useFrame((state, delta) => {
        if (isAnimating && animationProgress < 1) {
            const newProgress = Math.min(animationProgress + delta, 1);
            setAnimationProgress(newProgress);
            flagRef.current.position.y = easeOutCirc(newProgress) * 0.5;
        }
    });

    return (
        <RigidBody
            type="fixed"
            sensor
            colliders={false}
            name="flag"
            position={[0, 0, 0]}
            onIntersectionEnter={(e) => {
                if (e.other.rigidBodyObject?.name === "ball") {
                    setIsAnimating(true);
                    setAnimationProgress(0);
                }
            }}

            onIntersectionExit={(e) => {
                if (e.other.rigidBodyObject?.name === "ball") {
                    setIsAnimating(true);
                    setAnimationProgress(0);
                }
            }
            }
        >
            <CuboidCollider args={[1, 1, 1]} />
            <primitive object={scene} ref={flagRef} />
        </RigidBody>
    );
}

useGLTF.preload("/models/flag.glb");
