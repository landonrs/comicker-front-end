import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import HeaderBar from "../../common/HeaderBar";
import ComicPanel from "./components/ComicPanel";
import { getStartingPanel } from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

const ComicPanelTracker = (props) => {
  const { comicId } = useParams();
  const location = useLocation();
  const classes = useStyles();

  const [currentPanel, setCurrentPanel] = useState(
    getStartingPanel(location.state.comicData)
  );
  const [panelImageUris, setPanelImageUris] = useState({});

  useEffect(() => {
    // TODO load image data for current panel and all children
    console.log(comicId);
    console.log(location.state.comicData);
  }, []);

  return (
    <div className={classes.root}>
      <HeaderBar />
      <ComicPanel panelData={currentPanel} dataUri={"/images/comic.jpg"} />
    </div>
  );
};

export default ComicPanelTracker;
