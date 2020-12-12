import React from "react";
import { Stage, Layer, Image, Text, Transformer } from "react-konva";
import useImage from "use-image";

const MIN_WIDTH = 20;
const MAX_WIDTH = 300;

const SpeechBubbleImage = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const [img] = useImage(shapeProps.src);
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        image={img}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateAnchorOffset={20}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const TextItem = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransform={() => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          if (scaleY >= 0.9 && scaleY <= 1.01) {
            console.log("only x scale changed");
            // by removing this, we allow the component to determine what the height should be
            // so it resizes correctly
            delete shapeProps.height;
            onChange({
              ...shapeProps,
              width: Math.min(node.width() * scaleX, MAX_WIDTH),
            });
          }
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          console.log("event", e);

          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);

          if (scaleY >= 0.9 && scaleY <= 1.01) {
            console.log("only x scale changed");
            onChange({
              ...shapeProps,
              width: Math.min(node.width() * scaleX, MAX_WIDTH),
            });
          } else {
            console.log("current font size:", node.fontSize());
            console.log("scaleX", scaleX);
            console.log("scaleY", scaleY);
            console.log(
              "scaled font size",
              Math.max(5, node.fontSize() * scaleX)
            );

            // delete shapeProps.width;
            delete shapeProps.height;

            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.min(node.width() * scaleX, MAX_WIDTH),
              // height: Math.max(node.height() * scaleY),
              fontSize: Math.max(5, node.fontSize() * scaleX),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateAnchorOffset={20}
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

const ComicStage = (props) => {
  const { stageSelected, items, onChange, onItemSelect } = props;
  const [selectedId, selectShape] = React.useState(null);

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
      onItemSelect(null);
    }
  };

  return (
    <Stage
      width={300}
      height={300}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      style={{ position: "absolute", zIndex: stageSelected ? 999 : 0 }}
    >
      <Layer>
        {items.map((item, i) => {
          if (item.type === "bubble") {
            return (
              <SpeechBubbleImage
                key={item.id}
                shapeProps={item}
                isSelected={item.id === selectedId}
                onSelect={() => {
                  selectShape(item.id);
                  onItemSelect(i);
                }}
                onChange={(newAttrs) => onChange(newAttrs, i)}
              />
            );
          } else {
            return (
              <TextItem
                key={item.id}
                shapeProps={item}
                isSelected={item.id === selectedId}
                onSelect={() => {
                  selectShape(item.id);
                  onItemSelect(i);
                }}
                onChange={(newAttrs) => onChange(newAttrs, i)}
              />
            );
          }
        })}
      </Layer>
    </Stage>
  );
};

export default ComicStage;
