import React, { useState } from "react";
import { SketchPicker } from "react-color";
import CanvasDraw from "react-canvas-draw";

const ComicCreator = () => {
  const [selectedColor, setSelectedColor] = useState("#444");
  const [selectedBrushRadius, setSelectedBrushRadius] = useState(1);

  const onColorChange = (event) => {
    setSelectedColor(event.hex);
  };

  return (
    <div>
      <SketchPicker color={selectedColor} onChangeComplete={onColorChange} />
      <CanvasDraw
        hideGrid={true}
        brushColor={selectedColor}
        brushRadius={selectedBrushRadius}
      />
    </div>
  );
};

export default ComicCreator;
