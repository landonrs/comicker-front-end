import React, { useState } from "react";
import { SketchPicker } from "react-color";
import CanvasDraw from "react-canvas-draw";
import { Box, IconButton, Slider, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UndoIcon from "@material-ui/icons/Undo";
import { BiEraser } from "react-icons/bi";
import ComicStage from "./SpeechBubbleHelper";
import TextSelectDialog from "./TextSelectDialog";
import SpeechBubbleSelectDialog from "./SpeechBubbleSelectDialog";

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
  const { icon, onClick, isSelected = false } = props;

  return (
    <IconButton
      onClick={() => onClick()}
      color={isSelected ? "secondary" : "primary"}
      aria-label="upload picture"
      component="span"
    >
      {icon}
    </IconButton>
  );
};

const PanelCreator = (props) => {
  // state for the drawable canvas
  const [penSelectedColor, setPenSelectedColor] = useState("#444");
  const [eraserSelected, setEraserSelected] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);
  const [selectedBrushRadius, setSelectedBrushRadius] = useState(1);

  // state for the speech items
  const [draggableItems, setDraggableItems] = useState([]);
  const [currentSelectedSpeechItem, setCurrentSelectedSpeechItem] =
    useState(null);
  const [comicSpeechStageSelected, setComicSpeechStageSelected] =
    useState(false);
  const [showTextDialog, setShowTextDialog] = useState(false);
  const [showBubbleSelectDialog, setShowBubbleSelectDialog] = useState(false);

  const classes = useStyles();

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

  const onSpeechBubbleSelected = (imageSrc) => {
    const speechBubble = {
      type: "bubble",
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      src: imageSrc,
      id: `bubble${Date.now()}`,
    };
    console.log("adding bubble");
    setDraggableItems((draggableItems) => [...draggableItems, speechBubble]);

    console.log("drag items", draggableItems);

    setShowBubbleSelectDialog(false);
  };

  const onTextItemAdded = (textValue) => {
    const textItem = {
      type: "text",
      x: 50,
      y: 50,
      fontSize: 12,
      width: 100,
      text: textValue,
      align: "left",
      fill: "black",
      fontFamily: "Comic Sans MS",
      id: `text${Date.now()}`,
    };

    console.log("adding text");
    setDraggableItems((draggableItems) => [...draggableItems, textItem]);

    console.log("drag items", draggableItems);
    setShowTextDialog(false);
  };

  const onSpeechItemChanged = (newAttrs, index) => {
    const speechItems = draggableItems.slice();
    speechItems[index] = newAttrs;
    setDraggableItems(speechItems);
  };

  const onSpeechItemSelected = (itemIndex) => {
    console.log("speech item selected at ", itemIndex);
    setCurrentSelectedSpeechItem(itemIndex);
  };

  const onDeleteSelectedItem = () => {
    console.log("called delete", currentSelectedSpeechItem);
    if (currentSelectedSpeechItem !== null) {
      // remove item from array
      draggableItems.splice(currentSelectedSpeechItem, 1);
      setDraggableItems([...draggableItems]);
      setCurrentSelectedSpeechItem(null);
    }
  };

  const onUndo = (event) => {
    canvasRef.undo();
  };

  return (
    <div className={classes.panelRoot}>
      <Toolbar>
        {comicSpeechStageSelected ? (
          <>
            <ToolButton
              icon={<TextFieldsIcon />}
              onClick={() => setShowTextDialog(true)}
            />
            <ToolButton
              icon={<ChatBubbleOutlineIcon />}
              onClick={() => setShowBubbleSelectDialog(true)}
            />
            <ToolButton
              icon={<DeleteForeverIcon />}
              onClick={onDeleteSelectedItem}
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
            <ToolButton
              icon={<CreateIcon />}
              onClick={onPenSelected}
              isSelected={!eraserSelected}
            />
            <ToolButton
              icon={<BiEraser />}
              onClick={onEraserSelected}
              isSelected={eraserSelected}
            />
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
            onItemSelect={onSpeechItemSelected}
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
          isSelected={!comicSpeechStageSelected}
        />
        <ToolButton
          icon={<ChatBubbleOutlineIcon />}
          onClick={() => setComicSpeechStageSelected(true)}
          isSelected={comicSpeechStageSelected}
        />
      </Toolbar>

      {/*speech item dialogs*/}
      <TextSelectDialog
        open={showTextDialog}
        onClose={() => setShowTextDialog(false)}
        onConfirm={onTextItemAdded}
      />
      <SpeechBubbleSelectDialog
        open={showBubbleSelectDialog}
        onClose={() => setShowBubbleSelectDialog(false)}
        onConfirm={onSpeechBubbleSelected}
      />
    </div>
  );
};

export default PanelCreator;
