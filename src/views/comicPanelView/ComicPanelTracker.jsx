import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderBar from "../../common/HeaderBar";
import ComicPanel from "./components/ComicPanel";
import {
  getStartingPanel,
  getNextPanel,
  getPreviousPanel,
} from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";
import { useSwipeable } from "react-swipeable";

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

  const [currentPanel, setCurrentPanel] = useState(
    getStartingPanel(location.state.comicData)
  );
  const [panelImageUris, setPanelImageUris] = useState({});

  const showPreviousPanel = (eventData) => {
    const previousPanel = getPreviousPanel(comicData, currentPanel);

    if (previousPanel) {
      console.log("moving to previous panel", previousPanel);
      setCurrentPanel(previousPanel);
    }
  };

  const showNextPanel = (eventData) => {
    const nextPanel = getNextPanel(currentPanel);
    if (nextPanel) {
      console.log("moving to next panel", nextPanel);
      setCurrentPanel(nextPanel);
    }
  };

  const showAlternativeAbovePanel = (eventData) => {};

  const showAlternativeBelowPanel = (eventData) => {};

  const handlers = useSwipeable({
    onSwipedLeft: showNextPanel,
    onSwipedRight: showPreviousPanel,
    onSwipedUp: showAlternativeAbovePanel,
    onSwipedDown: showAlternativeBelowPanel,
  });

  useEffect(() => {
    // TODO load image data for current panel and all children
    console.log(comicId);
    console.log(comicData);
  }, []);

  return (
    <div className={classes.root} {...handlers}>
      <HeaderBar />
      <ComicPanel panelData={currentPanel} dataUri={"/images/comic.jpg"} />
    </div>
  );
};

export default ComicPanelTracker;
