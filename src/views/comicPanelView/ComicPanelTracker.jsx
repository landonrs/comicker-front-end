import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderBar from "../../common/HeaderBar";
import ComicPanel from "./components/ComicPanel";
import { getStartingPanel } from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";
import { useSwipeable } from "react-swipeable";
import ComicTree from "../../utils/comic-tree";

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

  const [panelImageUris, setPanelImageUris] = useState({});

  const showPreviousPanel = (eventData) => {
    const previousPanelNode = comicTree.getParentPanel(currentPanel.panelId);

    if (previousPanelNode) {
      console.log("moving to previous panel", previousPanelNode);
      setCurrentPanel(previousPanelNode.panelData);
      setCurrentColumnPanels(
        comicTree.getChildPanels(previousPanelNode.parentId)
      );
    }
  };

  const showNextPanel = (eventData) => {
    const childPanelNodes = comicTree.getChildPanels(currentPanel.panelId);

    if (childPanelNodes.length) {
      console.log("moving to next panel", childPanelNodes[0]);
      setCurrentColumnPanels(childPanelNodes);
      setCurrentPanel(childPanelNodes[0].panelData);
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
      setCurrentPanel(currentColumnPanels[panelIndex - 1].panelData);
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
      setCurrentPanel(currentColumnPanels[panelIndex + 1].panelData);
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
      <ComicPanel panelData={currentPanel} dataUri={"/images/comic.jpg"} />
    </div>
  );
};

export default ComicPanelTracker;
