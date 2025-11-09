import React, { useState } from "react";
import "../styles/FocusLevelSelector.css";

interface FocusLevelSelectorProps {
  onSelect: (level: number) => void;
}

function FocusLevelSelector({ onSelect }: FocusLevelSelectorProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (level: number) => {
    setSelected(level);
    onSelect(level);
  };

  return (
    <div className="focus-level-selector">
      <h4>How focused were you?</h4>
      <div className="levels">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            className={selected === level ? "selected" : ""}
            onClick={() => handleSelect(level)}
          >
            {level} ⭐
          </button>
        ))}
      </div>
    </div>
  );
}

export default FocusLevelSelector;
