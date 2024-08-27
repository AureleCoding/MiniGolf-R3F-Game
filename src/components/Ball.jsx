import { useGLTF, Clone, OrbitControls, Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const IMPULSE_SCALAR = 0.001;
const SPAWN_POSITION = new THREE.Vector3(0, 1, -3);

export const Ball = () => {
  const { scene } = useGLTF("/models/ball.glb");
  const rb = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();

  const [win, setWin] = useState(false);
  const [isTargetMode, setIsTargetMode] = useState(false);
  const [isArrowVisible, setIsArrowVisible] = useState(false);

  const arrowRef = useRef();
  const groupArrowRef = useRef();

  const punch = () => {
    const arrowDirection = new THREE.Vector3();
    groupArrowRef.current.getWorldDirection(arrowDirection);
    const impulse = arrowDirection.multiplyScalar(IMPULSE_SCALAR);
    rb.current.applyImpulse(impulse);
    setIsTargetMode(false);
    setIsArrowVisible(false);
  };

  const respawn = () => {
    rb.current.setLinvel({ x: 0, y: 0, z: 0 });
    rb.current.setAngvel({ x: 0, y: 0, z: 0 });
    rb.current.setTranslation(SPAWN_POSITION, true);
    camera.position.set(SPAWN_POSITION.x, SPAWN_POSITION.y + 3, SPAWN_POSITION.z - 5);
  };

  useEffect(() => {
    const handleMouseDown = () => {
      setIsArrowVisible(true);
    };

    const handleMouseUp = () => {
      punch();
      setIsArrowVisible(false);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isTargetMode]);

  useEffect(() => {
    camera.position.set(SPAWN_POSITION.x, SPAWN_POSITION.y + 5, SPAWN_POSITION.z - 10);
  }, [camera]);

  useFrame(() => {
    if (rb.current && controlsRef.current) {
      const ballPosition = rb.current.translation();

      controlsRef.current.target.set(ballPosition.x, ballPosition.y, ballPosition.z);
      controlsRef.current.update();

      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection).normalize();
      groupArrowRef.current.position.copy(ballPosition).add(new THREE.Vector3(0, 0.01, 0));
      groupArrowRef.current.lookAt(
        ballPosition.x + cameraDirection.x,
        ballPosition.y,
        ballPosition.z + cameraDirection.z
      );
    }

    if (win) {
      setWin(false);
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        minDistance={2}
        maxDistance={5}
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={0.49 * Math.PI}
      />
      <RigidBody
        name="ball"
        position={SPAWN_POSITION}
        colliders={"ball"}
        ref={rb}
        restitution={0.6}
        friction={2.0}
        linearDamping={0.5}
        angularDamping={0.6}
        frictionCombineRule={"Max"}
        type="dynamic"
        onIntersectionEnter={(e) => {
          if (e.other.rigidBodyObject?.name === "hole") {
            setWin(true);
          }
          if (e.other.rigidBodyObject?.name === "void") {
            respawn();
          }
        }}
      >
        <Clone object={scene} castShadow />
      </RigidBody>

      <group ref={groupArrowRef} visible={isArrowVisible}>
        <Box args={[0.05, 0.02, 0.3]} ref={arrowRef} position={[0, 0, 0.15]} />
      </group>
    </>
  );
};

useGLTF.preload("/models/ball.glb");
