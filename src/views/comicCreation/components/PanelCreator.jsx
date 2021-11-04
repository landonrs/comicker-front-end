import React, { useState } from "react";
import { SketchPicker } from "react-color";
import CanvasDraw from "react-canvas-draw";
import { Box, Button, IconButton, Slider, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import TextFieldsIcon from "@material-ui/icons/TextFields";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UndoIcon from "@material-ui/icons/Undo";
import { BiEraser } from "react-icons/bi";
import { SpeechBubbleImage, TextItem } from "./SpeechBubbleHelper";
import { Stage, Layer } from "react-konva";
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
  const { onUpload } = props;
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

  const [selectedDraggableItemId, setSelectedDraggableItemId] = React.useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedDraggableItemId(null);
      onSpeechItemSelected(null);
    }
  };

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
    setDraggableItems((draggableItems) => [...draggableItems, speechBubble]);

    setShowBubbleSelectDialog(false);
    setSelectedDraggableItemId(speechBubble.id);
  };

  const onTextItemAdded = (textValue) => {
    const width = Math.min(textValue.length * 15, 100);

    const textItem = {
      type: "text",
      x: 50,
      y: 50,
      fontSize: 20,
      width: width,
      text: textValue,
      align: "left",
      fill: "black",
      fontFamily: "Comic Sans MS",
      id: `text${Date.now()}`,
    };

    setDraggableItems((draggableItems) => [...draggableItems, textItem]);

    setShowTextDialog(false);
    setSelectedDraggableItemId(textItem.id);
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
          <Stage
            width={300}
            height={300}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
            style={{
              position: "absolute",
              zIndex: comicSpeechStageSelected ? 999 : 0,
            }}
          >
            <Layer>
              {draggableItems.map((item, i) => {
                if (item.type === "bubble") {
                  return (
                    <SpeechBubbleImage
                      key={item.id}
                      shapeProps={item}
                      isSelected={item.id === selectedDraggableItemId}
                      onSelect={() => {
                        setSelectedDraggableItemId(item.id);
                        onSpeechItemSelected(i);
                      }}
                      onChange={(newAttrs) => onSpeechItemChanged(newAttrs, i)}
                    />
                  );
                } else {
                  return (
                    <TextItem
                      key={item.id}
                      shapeProps={item}
                      isSelected={item.id === selectedDraggableItemId}
                      onSelect={() => {
                        setSelectedDraggableItemId(item.id);
                        onSpeechItemSelected(i);
                      }}
                      onChange={(newAttrs) => onSpeechItemChanged(newAttrs, i)}
                    />
                  );
                }
              })}
            </Layer>
          </Stage>
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
          onClick={() => {
            setComicSpeechStageSelected(false);
            setSelectedDraggableItemId(null);
          }}
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setSelectedDraggableItemId(null);
          onUpload();
        }}
      >
        Upload
      </Button>
    </div>
  );
};

export default PanelCreator;
