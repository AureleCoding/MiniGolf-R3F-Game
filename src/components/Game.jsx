import { useGLTF, Box, Stars, Sky } from "@react-three/drei";
import { CuboidCollider, Physics, RigidBody } from "@react-three/rapier";
import { Ball } from "./Ball";
import { useEffect } from "react";
import * as THREE from "three";
import { Ground } from "./Ground";
import { Flag } from "./Flag";

export const Game = () => {
  const { scene } = useGLTF("/models/Map1.glb");

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
      <ambientLight intensity={0.5} />

      <group position={[0, 3, 1]}>
        <pointLight
          intensity={1}
          color="white"
          distance={10}
          decay={2}
          castShadow
          shadow-mapSize={[shadowMapSize, shadowMapSize]}
          shadow-bias={shadowBias}
        />
        <Box scale={0.5} visible={false}>
          <meshBasicMaterial attach="material" color="red" />
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

      <Physics debug={false}>
        <RigidBody
          type="fixed"
          sensor
          colliders={false}
          name="hole"
          position={[0, 0, 0]}
        >
          <CuboidCollider args={[0.1, 0.1, 0.1]} />
        </RigidBody>

        <RigidBody
          type="fixed"
          sensor
          colliders={false}
          name="void"
          position={[0, -1, 0]}
        >
          <CuboidCollider args={[10, 1, 10]} />
        </RigidBody>

        <RigidBody
          type="fixed"
          colliders={"trimesh"}
          friction={0.5}
          name="map"
        >
          <primitive object={scene} castShadow receiveShadow />
        </RigidBody>

        <Ball />

        <Flag />
      </Physics>


      <Ground />
    </>
  );
};

useGLTF.preload("/models/Map1.glb");
