import {createContext, useContext, useState} from "react";

const PlayerContext = createContext(undefined);

export const PlayerProvider = ({children}) => {
    const [hitCount, setHitCount] = useState(0);
    const [strength, setStrength] = useState(0.0001);

    const incrementHitCount = () => setHitCount((prev) => prev + 1);
    const resetHitCount = () => setHitCount(0);
    const getHitCount = () => hitCount;
    const updateStrength = (newStrength) => setStrength(newStrength);
    const getStrength = () => strength;

    return (
        <PlayerContext.Provider
            value={{hitCount, incrementHitCount, resetHitCount, strength, updateStrength, getHitCount, getStrength}}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayerContext = () => useContext(PlayerContext);