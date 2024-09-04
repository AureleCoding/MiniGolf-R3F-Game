// src/App.jsx
import {Canvas} from "@react-three/fiber";
import {Experience} from "./components/Experience";
import {Suspense} from "react";
import {UI} from "./components/UI";
import {GameProvider} from "./context/GameContext";
import {PlayerProvider} from "./context/PlayerContext";

function App() {
    return (
        <GameProvider>
            <PlayerProvider>
                <Canvas shadows camera={{position: [0, 5, 5], fov: 30}}>
                    <color attach="background" args={["lightBlue"]}/>
                    <Suspense>
                        <Experience/>
                        {/*<Grid args={[100, 100]} />*/}
                    </Suspense>
                </Canvas>
                <UI/>
            </PlayerProvider>
        </GameProvider>
    );
}

export default App;