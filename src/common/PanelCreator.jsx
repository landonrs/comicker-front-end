import React, { useState } from "react";
import { SketchPicker } from "react-color";
import CanvasDraw from "react-canvas-draw";
import { Slider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  slider: {
    width: "30%",
  },
});

const PanelCreator = (props) => {
  const [selectedColor, setSelectedColor] = useState("#444");
  const [selectedBrushRadius, setSelectedBrushRadius] = useState(5);
  const classes = useStyles();

  const onColorChange = (event) => {
    setSelectedColor(event.hex);
  };

  return (
    <div>
      <SketchPicker color={selectedColor} onChangeComplete={onColorChange} />
      <Slider
        className={classes.slider}
        defaultValue={selectedBrushRadius}
        aria-labelledby="brush-radius-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={50}
        onChange={(event, value) => setSelectedBrushRadius(value)}
      />
      <CanvasDraw
        hideGrid={true}
        brushColor={selectedColor}
        brushRadius={selectedBrushRadius}
      />
    </div>
  );
};

export default PanelCreator;
