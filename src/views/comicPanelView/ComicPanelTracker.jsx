import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderBar from "../../common/HeaderBar";
import ComicPanel from "./components/ComicPanel";
import { getStartingPanel } from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";
import { useSwipeable } from "react-swipeable";
import ComicTree from "../../utils/comic-tree";
import { Slide } from "@material-ui/core";

const DOWN = "down";
const UP = "up";
const LEFT = "left";
const RIGHT = "right";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

const ComicPanelTracker = (props) => {
  const { comicId } = useParams();
  const location = useLocation();
  const classes = useStyles();

  const comicData = location.state.comicData;

  const [comicTree, setComicTree] = useState(null);

  // The current panel the user is viewing
  const [currentPanel, setCurrentPanel] = useState(
    getStartingPanel(location.state.comicData)
  );
  // used to track ordering of all siblings of a parent
  const [currentColumnPanels, setCurrentColumnPanels] = useState([]);

  const [slideDirection, setSlideDirection] = useState(RIGHT);
  const [slideIn, setSlideIn] = useState(true);

  const [panelImageUris, setPanelImageUris] = useState({});

  const showPreviousPanel = (eventData) => {
    const previousPanelNode = comicTree.getParentPanel(currentPanel.panelId);

    if (previousPanelNode) {
      console.log("moving to previous panel", previousPanelNode);
      setSlideDirection(LEFT);
      // exit current panel
      setSlideIn(false);

      setCurrentPanel(previousPanelNode.panelData);
      setCurrentColumnPanels(
        comicTree.getChildPanels(previousPanelNode.parentId)
      );

      setTransitionTimeout(RIGHT);
    }
  };

  const setTransitionTimeout = (direction) => {
    setTimeout(() => {
      setSlideDirection(direction);
      setSlideIn(true);
    }, 250);
  };

  const showNextPanel = (eventData) => {
    const childPanelNodes = comicTree.getChildPanels(currentPanel.panelId);

    if (childPanelNodes.length) {
      console.log("moving to next panel", childPanelNodes[0]);
      setSlideDirection(RIGHT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(childPanelNodes);
      setCurrentPanel(childPanelNodes[0].panelData);

      setTransitionTimeout(LEFT);
    }
  };

  const showAlternativeAbovePanel = (eventData) => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelId
    );

    if (panelIndex > 0) {
      console.log(
        "moving up to alternative panel",
        currentColumnPanels[panelIndex - 1].panelData
      );
      setSlideDirection(UP);
      // exit current panel
      setSlideIn(false);
      setCurrentPanel(currentColumnPanels[panelIndex - 1].panelData);

      setTransitionTimeout(DOWN);
    }
  };

  const showAlternativeBelowPanel = (eventData) => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelId
    );

    if (panelIndex < currentColumnPanels.length - 1) {
      console.log(
        "moving down to alternative panel",
        currentColumnPanels[panelIndex + 1].panelData
      );
      setSlideDirection(DOWN);
      // exit current panel
      setSlideIn(false);

      setCurrentPanel(currentColumnPanels[panelIndex + 1].panelData);

      setTransitionTimeout(UP);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: showNextPanel,
    onSwipedRight: showPreviousPanel,
    onSwipedUp: showAlternativeBelowPanel,
    onSwipedDown: showAlternativeAbovePanel,
  });

  useEffect(() => {
    // TODO load image data for current panel and all children
    console.log(comicId);
    console.log(comicData);
    setComicTree(new ComicTree(comicData));
  }, []);

  return (
    <div className={classes.root} {...handlers}>
      <HeaderBar />
      <Slide direction={slideDirection} in={slideIn}>
        <div>
          <ComicPanel panelData={currentPanel} dataUri={"/images/comic.jpg"} />
        </div>
      </Slide>
    </div>
  );
};

export default ComicPanelTracker;
