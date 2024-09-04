import {CuboidCollider, RigidBody} from "@react-three/rapier";
import {useGLTF} from "@react-three/drei";
import {Flag} from "./Flag.jsx";
import {useGameContext} from "../context/GameContext.jsx";

const COURSES = ["Course1", "Course2",]
export const Course = () => {
    const {currentHole} = useGameContext();
    const {scene} = useGLTF(`/models/${COURSES[currentHole]}.glb`);

    return (
        <>
            <RigidBody
                type="fixed"
                sensor
                colliders={false}
                name="hole"
            >
                {/*<CuboidCollider args={[1, 1, 1]} />*/}
                <CuboidCollider args={[.1, .1, .1]}/>
            </RigidBody>
            <RigidBody
                type="fixed"
                colliders="trimesh"
                name="map"
                key={currentHole}
            >
                <primitive object={scene} castShadow={true} receiveShadow={true}/>
            </RigidBody>

            <Flag/>
        </>
    );
}

COURSES.forEach((course) => {
    useGLTF.preload(`/models/${course}.glb`)
})