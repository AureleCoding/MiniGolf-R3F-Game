import {Box, Clone, OrbitControls, useGLTF} from "@react-three/drei";
import {RigidBody} from "@react-three/rapier";
import {useEffect, useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";
import {audios, playAudio} from "../utils/AudioManager.jsx";
import {usePlayerContext} from "../context/PlayerContext.jsx";
import {oscillate} from "../utils/Math";
import {gameSettings, stats, useGameContext} from "../context/GameContext.jsx";

export const Ball = () => {
    const {scene} = useGLTF("/models/ball.glb");
    const rb = useRef();
    const controlsRef = useRef();
    const {camera} = useThree();

    const [isArrowVisible, setIsArrowVisible] = useState(false);
    const [canHitBall, setCanHitBall] = useState(true);

    const arrowRef = useRef();
    const groupArrowRef = useRef();

    const {incrementHitCount, updateStrength, getStrength, setScoreBoard, getHitCount} = usePlayerContext();
    const {setGameState, gameState, currentHole} = useGameContext();

    const punch = () => {
        const arrowDirection = new THREE.Vector3();
        groupArrowRef.current.getWorldDirection(arrowDirection);
        const impulse = arrowDirection.multiplyScalar(getStrength());
        rb.current.applyImpulse({x: impulse.x, y: 0, z: impulse.z}, true);
        setIsArrowVisible(false);
        playAudio(audios.hit);
        incrementHitCount();
        console.log("Hit count: ", getStrength());
    };

    const win = () => {
        playAudio(audios.hole);
        setGameState(stats.win);
        setCanHitBall(false);
        setScoreBoard(currentHole, getHitCount());
    }

    const respawn = () => {
        rb.current.setLinvel({x: 0, y: 0, z: 0}, true);
        rb.current.setAngvel({x: 0, y: 0, z: 0}, true);
        rb.current.setTranslation(gameSettings[currentHole].position, true);
    };

    useEffect(() => {
        camera.position.set(rb.current.translation().x, rb.current.translation().y + 3, rb.current.translation().z - 5);
        camera.lookAt(rb.current.translation());

        controlsRef.current.target.set(rb.current.translation().x, rb.current.translation().y, rb.current.translation().z);
        controlsRef.current.update();

        respawn();
    }, [camera]);

    useEffect(() => {
        const handleMouseDown = () => {
            setIsArrowVisible(true);
        };

        const handleMouseUp = () => {
            punch();
            setIsArrowVisible(false);
        };

        if (!canHitBall) {
            window.addEventListener("mousedown", handleMouseDown);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [canHitBall]);

    useFrame((state) => {
        if (rb.current && controlsRef.current) {
            const ballPosition = rb.current.translation();

            controlsRef.current.target.set(ballPosition.x, ballPosition.y, ballPosition.z);
            controlsRef.current.update();

            const cameraDirection = new THREE.Vector3();
            camera.getWorldDirection(cameraDirection).normalize();
            groupArrowRef.current.position.copy(ballPosition).add(new THREE.Vector3(0, 0, 0));
            groupArrowRef.current.lookAt(ballPosition.x + cameraDirection.x, ballPosition.y, ballPosition.z + cameraDirection.z);

            setCanHitBall(rb.current.linvel().x !== 0 || rb.current.linvel().z !== 0 || gameState === stats.win);
        }

        const elapsedTime = state.clock.getElapsedTime();
        updateStrength(oscillate(0.0005, 0.002, elapsedTime, 5));
    });


    return (<>
        <OrbitControls
            ref={controlsRef}
            minDistance={2}
            maxDistance={5}
            enablePan={false}
            enableZoom={true}
            maxPolarAngle={0.49 * Math.PI}
        />
        <RigidBody
            position={gameSettings[currentHole].position}
            name="ball"
            colliders={"ball"}
            ref={rb}
            restitution={0.5}
            friction={0.5}
            linearDamping={2.0}
            angularDamping={0.9}
            type="dynamic"
            onIntersectionEnter={(e) => {
                if (e.other.rigidBodyObject?.name === "hole") {
                    win();
                }
                if (e.other.rigidBodyObject?.name === "void") {
                    respawn();
                    incrementHitCount();
                }
            }}
        >
            <Clone object={scene} castShadow/>
        </RigidBody>

        <group ref={groupArrowRef} visible={isArrowVisible}>
            <Box args={[0.05, 0.02, 0.3]} ref={arrowRef} position={[0, 0, 0.15]}/>
        </group>
    </>);
};

useGLTF.preload("/models/ball.glb");