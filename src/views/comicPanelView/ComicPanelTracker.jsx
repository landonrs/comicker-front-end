import React, { useState, useEffect } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";
import {
  Button,
  Box,
  Card,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import { getStartingPanel } from "../../utils/comic-navigation-helper";
import { makeStyles } from "@material-ui/core/styles";
import { useSwipeable } from "react-swipeable";
import ComicTree from "../../utils/comic-tree";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
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
  canvasBorder: {
    display: "inline-block",
  },
  panelImage: { width: "100%", marginTop: "0%" },
});

const userIdInPanelVotes = (panelData, userInfo) => {
  return panelData.voterIds.includes(userInfo?.sub);
};

const ComicPanelTracker = (props) => {
  const { comicId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const comicData = location.state.comicData;

  const [comicTree, setComicTree] = useState(null);

  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  // The current panel the user is viewing
  const [currentPanel, setCurrentPanel] = useState(
    getStartingPanel(location.state.comicData)
  );

  const [userHasVoted, setUserHasVoted] = useState(
    userIdInPanelVotes(currentPanel.panelData, userInfo)
  );

  // used to track which child panel to go to if user looks at next panel
  const [lastChildPanelVisited, setLastChildPanelVisited] = useState(null);

  // used to track ordering of all siblings of a parent
  const [currentColumnPanels, setCurrentColumnPanels] = useState([]);

  const [slideDirection, setSlideDirection] = useState(RIGHT);
  const [slideIn, setSlideIn] = useState(true);

  const showPreviousPanel = (eventData) => {
    const previousPanelNode = comicTree.getParentPanel(
      currentPanel.panelData.panelId
    );

    if (previousPanelNode) {
      console.log("moving to previous panel", previousPanelNode);
      setLastChildPanelVisited(currentPanel);
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
    const childPanelNodes = comicTree.getChildPanels(
      currentPanel.panelData.panelId
    );

    if (childPanelNodes.length) {
      const childPanel = lastChildPanelVisited
        ? lastChildPanelVisited
        : childPanelNodes[0];
      console.log("moving to next panel", childPanel);
      setSlideDirection(RIGHT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(childPanelNodes);

      // this is reset to avoid user being able to scroll to right infinitely
      setLastChildPanelVisited(null);

      setTransitionTimeout(LEFT, childPanel);
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
      // this is reset to avoid mismtched rows
      setLastChildPanelVisited(null);

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

      // this is reset to avoid mismtched rows
      setLastChildPanelVisited(null);

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
      <Paper>
        <Card>
          <Grid container direction="column" item xs={12} align="center">
            <Grid item justify="center">
              <IconButton
                color={"primary"}
                disabled={false}
                onClick={showAlternativeAbovePanel}
              >
                <KeyboardArrowUp />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container alignItems="center" xs={12}>
            <Grid item xs={2}>
              <IconButton
                color={"primary"}
                disabled={false}
                onClick={showPreviousPanel}
              >
                <KeyboardArrowLeft />
              </IconButton>
            </Grid>
            <Grid item xs={8}>
              <Slide direction={slideDirection} in={slideIn}>
                <div>
                  <Box
                    className={classes.canvasBorder}
                    disableGutters={true}
                    border={5}
                  >
                    <img
                      className={classes.panelImage}
                      src={`https://comicker-comic-panels.s3.amazonaws.com/comics/${comicId}/${currentPanel.panelData.panelId}.jpg`}
                      alt="comic"
                    />
                  </Box>
                </div>
              </Slide>
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color={"primary"}
                disabled={false}
                onClick={showNextPanel}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
            <Grid container direction="column" item xs={12} align="center">
            <Grid item justify="center">
              <IconButton
                color={"primary"}
                disabled={false}
                onClick={showAlternativeBelowPanel}
              >
                <KeyboardArrowDown />
              </IconButton>
            </Grid>
          </Grid>
            <Typography>{`Author: ${currentPanel.panelData.author}`}</Typography>
          </Grid>
        </Card>
      </Paper>
      <Grid container direction="row" alignItems="center">
        <Grid className={classes.arrow} item>
          <IconButton
            color={userHasVoted ? "primary" : "default"}
            disableRipple={userHasVoted}
            onClick={
              !userHasVoted
                ? () => onVote(currentPanel.panelData.panelId)
                : () => {}
            }
          >
            <ArrowUpwardIcon />
          </IconButton>
        </Grid>
        <Grid className={classes.voteBox} item>
          <Typography variant="h6">
            {currentPanel.panelData.voterIds
              ? currentPanel.panelData.voterIds.length
              : 0}
          </Typography>
        </Grid>
        <Grid className={classes.spacer} item>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => onCreateNewPanel(currentPanel.panelData.panelId)}
          >
            Add Next Panel
          </Button>
        </Grid>
        <Grid item>
          {currentPanel.parentId && (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => onCreateNewPanel(currentPanel.parentId)}
            >
              Add Alternative Panel
            </Button>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default ComicPanelTracker;
