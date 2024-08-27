import { useState } from "react";

export const UI = () => {
  const [win, setWin] = useState(false);

  return (
    <>

      {/* Force gauge */}

      <div className="force-gauge">
        <div className="force-bar"></div>
      </div>

      {win && (
        <div className="win">
          WIN
        </div>
      )}
    </>
  );
};
