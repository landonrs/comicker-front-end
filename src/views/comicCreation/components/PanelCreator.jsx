import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import CanvasDraw from "react-canvas-draw";
import { Box, IconButton, Slider, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import UndoIcon from "@material-ui/icons/Undo";
import { BiEraser } from "react-icons/bi";
import ComicStage from "./SpeechBubbleHelper";

const WHITE = "#FFFFFF";

const useStyles = makeStyles({
  panelRoot: { marginTop: "10%" },
  slider: {
    width: "90px",
  },
  canvasBorder: {
    display: "inline-block",
  },
});

const ToolButton = (props) => {
  const { icon, onClick } = props;

  return (
    <IconButton
      onClick={() => onClick()}
      color="primary"
      aria-label="upload picture"
      component="span"
    >
      {icon}
    </IconButton>
  );
};

const initialRectangles = [
  {
    x: 10,
    y: 10,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect1",
  },
  {
    x: 150,
    y: 150,
    width: 100,
    height: 100,
    fill: "green",
    id: "rect2",
  },
];

const PanelCreator = (props) => {
  const [penSelectedColor, setPenSelectedColor] = useState("#444");
  const [eraserSelected, setEraserSelected] = useState(false);
  const [draggingItem, setDraggingItem] = useState(false);
  const [draggableItems, setDraggableItems] = useState(initialRectangles);
  const [comicSpeechStageSelected, setComicSpeechStageSelected] = useState(
    null
  );

  const [selectedBrushRadius, setSelectedBrushRadius] = useState(1);
  const classes = useStyles();

  const [canvasRef, setCanvasRef] = useState(null);
  let ctx = null;

  const onColorChange = (event) => {
    setPenSelectedColor(event.hex);
  };

  const onPenSelected = (event) => {
    setEraserSelected(false);
  };

  const onEraserSelected = (event) => {
    setEraserSelected(true);
  };

  const onSpeechBubbleSelected = (event) => {
    const opposite = !draggingItem;
    console.log(opposite);
    if (opposite) {
      const rect = {
        x: 50,
        y: 50,
        width: 100,
        height: 100,
        fill: "blue",
        id: `rect${draggableItems.length + 1}`,
      };
      console.log("adding rect");
      setDraggableItems((draggableItems) => [...draggableItems, rect]);

      console.log("drag items", draggableItems);
    }
    setDraggingItem(opposite);
  };

  const onSpeechItemChanged = (newAttrs, index) => {
    const speechItems = draggableItems.slice();
    speechItems[index] = newAttrs;
    setDraggableItems(speechItems);
  };

  const onUndo = (event) => {
    canvasRef.undo();
  };

  return (
    <div className={classes.panelRoot}>
      <Toolbar>
        {comicSpeechStageSelected ? (
          <>
            <ToolButton icon={<TextFieldsIcon />} onClick={() => {}} />
            <ToolButton
              icon={<ChatBubbleOutlineIcon />}
              onClick={onSpeechBubbleSelected}
            />
          </>
        ) : (
          <>
            <Slider
              className={classes.slider}
              defaultValue={selectedBrushRadius}
              aria-labelledby="brush-radius-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={30}
              onChange={(event, value) => setSelectedBrushRadius(value)}
            />
            <ToolButton icon={<CreateIcon />} onClick={onPenSelected} />
            <ToolButton icon={<BiEraser />} onClick={onEraserSelected} />
            <ToolButton icon={<UndoIcon />} onClick={onUndo} />
          </>
        )}
      </Toolbar>
      {/* <SketchPicker color={selectedColor} onChangeComplete={onColorChange} /> */}
      <Box className={classes.canvasBorder} disableGutters={true} border={5}>
        <div id={"comicPanelImage"}>
          <ComicStage
            stageSelected={comicSpeechStageSelected}
            items={draggableItems}
            onChange={onSpeechItemChanged}
          />
          <CanvasDraw
            ref={(canvasDraw) => setCanvasRef(canvasDraw)}
            hideGrid={true}
            brushColor={eraserSelected ? WHITE : penSelectedColor}
            brushRadius={selectedBrushRadius}
            canvasWidth={300}
            canvasHeight={300}
            lazyRadius={0}
            hideInterface={true}
          />
        </div>
      </Box>
      <Toolbar>
        <ToolButton
          icon={<CreateIcon />}
          onClick={() => setComicSpeechStageSelected(false)}
        />
        <ToolButton
          icon={<ChatBubbleOutlineIcon />}
          onClick={() => setComicSpeechStageSelected(true)}
        />
      </Toolbar>
    </div>
  );
};

export default PanelCreator;
