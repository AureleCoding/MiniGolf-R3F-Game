import {Box, Sky, Stars, useGLTF} from "@react-three/drei";
import {CuboidCollider, Physics, RigidBody} from "@react-three/rapier";
import {Ball} from "./Ball";
import {useEffect} from "react";
import {Ground} from "./Ground";
import {Course} from "./Course.jsx";

export const Game = () => {
    const {scene} = useGLTF("/models/Course1.glb");

    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    const shadowBias = -0.001;
    const shadowMapSize = 2048;

    return (
        <>
            <ambientLight intensity={0.5}/>

            <group position={[0, 3, 1]}>
                <pointLight
                    intensity={1}
                    color="white"
                    distance={10}
                    decay={2}
                    castShadow={true}
                    shadow-mapSize={[shadowMapSize, shadowMapSize]}
                    shadow-bias={shadowBias}
                />
                <Box scale={0.5} visible={false}>
                    <meshBasicMaterial attach="material" color="red"/>
                </Box>
            </group>

            <Sky
                distance={450000}
                sunPosition={[0, 1, 0]}
                inclination={0}
                azimuth={180}
                elevation={2}
                turbidity={10}
                rayleigh={0.1}
                mieCoefficient={0.005}
                mieDirectionalG={0.8}
                exposure={0.5}
            />
            <Stars
                radius={100}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={1}
            />

            <Physics debug={true}>
                <RigidBody
                    type="fixed"
                    sensor
                    colliders={false}
                    name="void"
                    position={[0, -1, 0]}
                >
                    <CuboidCollider args={[10, 1, 10]}/>
                </RigidBody>

                <Ball/>
                <Course/>
            </Physics>
            <Ground/>
        </>
    );
};