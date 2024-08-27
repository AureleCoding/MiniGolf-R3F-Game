import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Suspense } from "react";
import { UI } from "./components/UI";
import { CameraControls } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 5, 5], fov: 30 }}>
        <color attach="background" args={["lightBlue"]} />
        <Suspense>
          <Experience />
        </Suspense>
      </Canvas>
      <UI />
    </>
  );
}

export default App;
