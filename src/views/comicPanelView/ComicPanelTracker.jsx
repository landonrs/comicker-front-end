import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import ComicPanel from "./components/ComicPanel";
import { getStartingPanel } from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";
import { useSwipeable } from "react-swipeable";
import ComicTree from "../../utils/comic-tree";
import { Slide } from "@material-ui/core";
import { voteOnComicPanel } from "../../utils/comicker-client";
import { useOktaAuth } from "@okta/okta-react";

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
  const history = useHistory();
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

  const showPreviousPanel = (eventData) => {
    const previousPanelNode = comicTree.getParentPanel(currentPanel.panelData.panelId);

    if (previousPanelNode) {
      console.log("moving to previous panel", previousPanelNode);
      setSlideDirection(LEFT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(
        comicTree.getChildPanels(previousPanelNode.parentId)
      );

      setTransitionTimeout(RIGHT, previousPanelNode);
    }
  };

  const setTransitionTimeout = (direction, newPanel) => {
    setTimeout(() => {
      setSlideDirection(direction);
      setCurrentPanel(newPanel);
      setSlideIn(true);
    }, 250);
  };

  const showNextPanel = (eventData) => {
    const childPanelNodes = comicTree.getChildPanels(currentPanel.panelData.panelId);

    if (childPanelNodes.length) {
      console.log("moving to next panel", childPanelNodes[0]);
      setSlideDirection(RIGHT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(childPanelNodes);

      setTransitionTimeout(LEFT, childPanelNodes[0]);
    }
  };

  const showAlternativeAbovePanel = (eventData) => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    if (panelIndex > 0) {
      console.log(
        "moving up to alternative panel",
        currentColumnPanels[panelIndex - 1].panelData
      );
      setSlideDirection(UP);
      // exit current panel
      setSlideIn(false);

      setTransitionTimeout(DOWN, currentColumnPanels[panelIndex - 1]);
    }
  };

  const showAlternativeBelowPanel = (eventData) => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    if (panelIndex < currentColumnPanels.length - 1) {
      console.log(
        "moving down to alternative panel",
        currentColumnPanels[panelIndex + 1].panelData
      );
      setSlideDirection(DOWN);
      // exit current panel
      setSlideIn(false);

      setTransitionTimeout(UP, currentColumnPanels[panelIndex + 1]);
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

  const onCreateNewPanel = (panelId) => {
    history.push(`/create/${comicId}/${panelId}`);
  };

  const onVote = (panelId) => {
    voteOnComicPanel(comicId, panelId)
      .then((result) => {})
      .catch((error) => {
        console.log(error.message);
      });
  };

  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        console.log(info);
        setUserInfo(info);
      });
    }
  }, [authState, authService]);

  return (
    <div className={classes.root} {...handlers}>
      <Slide direction={slideDirection} in={slideIn}>
        <div>
          <ComicPanel
            userInfo={userInfo}
            panelNode={currentPanel}
            dataUri={`https://comicker-comic-panels.s3.amazonaws.com/comics/${comicId}/${currentPanel.panelData.panelId}.jpg`}
            onCreatePanel={onCreateNewPanel}
            onVote={onVote}
          />
        </div>
      </Slide>
    </div>
  );
};

export default ComicPanelTracker;
