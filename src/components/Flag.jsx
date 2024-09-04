import {useGLTF} from "@react-three/drei";
import {useFrame} from "@react-three/fiber";
import {CuboidCollider, RigidBody} from "@react-three/rapier";
import {useRef, useState} from "react";
import {easeInCirc, easeOutCirc} from "../utils/Math";

export const Flag = () => {
    const {scene} = useGLTF("/models/flag.glb");
    const flagRef = useRef();
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMovingUp, setIsMovingUp] = useState(false);

    useFrame((state, delta) => {
        if (isAnimating) {
            const newProgress = Math.min(animationProgress + delta, 1);
            setAnimationProgress(newProgress);

            flagRef.current.position.y = isMovingUp ? easeOutCirc(newProgress) * 0.5 : easeInCirc(1 - newProgress) * 0.5;

            if (newProgress === 1) {
                setIsAnimating(false);
            }
        }
    });

    return (<RigidBody
        type="fixed"
        sensor
        colliders={false}
        name="flag"
        position={[0, 0, 0]}
        onIntersectionEnter={(e) => {
            if (e.other.rigidBodyObject?.name === "ball") {
                setIsAnimating(true);
                setIsMovingUp(true);
                setAnimationProgress(0);
            }
        }}
        onIntersectionExit={(e) => {
            if (e.other.rigidBodyObject?.name === "ball") {
                setIsAnimating(true);
                setIsMovingUp(false);
                setAnimationProgress(0);
            }
        }}
    >
        <CuboidCollider args={[1, 1, 1]}/>
        <primitive object={scene} ref={flagRef}/>
    </RigidBody>);
}

useGLTF.preload("/models/flag.glb");
