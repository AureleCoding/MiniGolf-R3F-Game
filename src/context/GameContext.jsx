// src/context/GameContext.jsx
import {createContext, useContext, useState} from "react";
import * as THREE from "three";

const GameContext = createContext(undefined);

export const stats = {
    playing: "playing", win: "win", lose: "lose",
};

export const gameSettings = [{
    position: new THREE.Vector3(0, 0.5, -3), par: 2, hole: 1,
}, {
    position: new THREE.Vector3(1, 0.5, -3), par: 4, hole: 2,
}];

export const GameProvider = ({children}) => {

    const [gameState, setGameState] = useState(stats.playing);
    const [currentHole, setCurrentHole] = useState(0);

    const nextHole = () => {
        setCurrentHole((prev) => prev + 1 % gameSettings.length);
        setGameState(stats.playing);
    }


    return (<GameContext.Provider value={{gameState, setGameState, currentHole, nextHole}}>
        {children}
    </GameContext.Provider>);
};

export const useGameContext = () => useContext(GameContext);