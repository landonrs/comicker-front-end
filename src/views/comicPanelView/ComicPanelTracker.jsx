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
import { ComicTree, ROOT_NODE_ID } from "../../utils/comic-tree";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";
import { Slide } from "@material-ui/core";
import { voteOnComicPanel, getComic } from "../../utils/comicker-client";
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
  panelImage: { width: "100%", marginTop: "0%" }
});

const userIdInPanelVotes = (panelData, userInfo) => {
  return panelData.voterIds.includes(userInfo?.sub);
};

const ComicPanelTracker = (props) => {
  const { comicId } = useParams();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  const [comicTreeLoading, setComicTreeLoading] = useState(true);

  const [comicTree, setComicTree] = useState(null);

  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  // The current panel the user is viewing
  const [currentPanel, setCurrentPanel] = useState(
    getStartingPanel(location.state.comicData)
  );
  // 0 based index used to make sure users cannot chain more than 4 panels together
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0)

  const [panelVoteCount, setPanelVoteCount] = useState(
    currentPanel.panelData.voterIds.length
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

  const [imageLoading, setImageLoading] = useState(false)


  const panelIsFirstPanel = (panel) => {
    return !(panel.parentId && panel.parentId !== ROOT_NODE_ID)
  }

  const panelDoesNotHaveChildPanels = (panel) => {
    const childPanelNodes = comicTree.getChildPanels(
      panel.panelData.panelId
    );

    return !(childPanelNodes.length)
  }

  const panelDoesNotHaveAlternativePanelAbove = () => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    return !(panelIndex > 0)
  }

  const panelDoesNotHaveAlternativePanelBelow = () => {
    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    // True if panel is last in array, or if we are switching panels and panel is not found in array
    return !(panelIndex < currentColumnPanels.length - 1 && panelIndex !== -1)
  }

  const showPreviousPanel = (eventData) => {
    if (comicTree == null) {
      return;
    }

    const previousPanelNode = comicTree.getParentPanel(
      currentPanel.panelData.panelId
    );

    if (previousPanelNode) {
      // console.log("moving to previous panel", previousPanelNode);
      setLastChildPanelVisited(currentPanel);
      setSlideDirection(LEFT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(
        comicTree.getChildPanels(previousPanelNode.parentId)
      );
      setCurrentColumnIndex((currentIndex) => currentIndex - 1)

      setTransitionTimeout(RIGHT, previousPanelNode);
    }
  };

  const setTransitionTimeout = (direction, newPanel) => {
    setTimeout(() => {
      setSlideDirection(direction);
      setCurrentPanel(newPanel);
      setSlideIn(true);
      setImageLoading(true)
      setUserHasVoted(userIdInPanelVotes(newPanel.panelData, userInfo));
      setPanelVoteCount(newPanel.panelData.voterIds.length);
    }, 300);
  };

  const showNextPanel = (eventData) => {
    if (comicTree == null) {
      return;
    }

    const childPanelNodes = comicTree.getChildPanels(
      currentPanel.panelData.panelId
    );

    if (childPanelNodes.length) {
      const childPanel = lastChildPanelVisited
        ? lastChildPanelVisited
        : childPanelNodes[0];
      // console.log("moving to next panel", childPanel);
      setSlideDirection(RIGHT);
      // exit current panel
      setSlideIn(false);

      setCurrentColumnPanels(childPanelNodes);
      setCurrentColumnIndex((currentIndex) => currentIndex + 1)

      // this is reset to avoid user being able to scroll to right infinitely
      setLastChildPanelVisited(null);

      setTransitionTimeout(LEFT, childPanel);
    }
  };

  const showAlternativeAbovePanel = (eventData) => {
    if (comicTree == null) {
      return;
    }

    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    if (panelIndex > 0) {
      // console.log(
      //   "moving up to alternative panel",
      //   currentColumnPanels[panelIndex - 1].panelData
      // );
      // this is reset to avoid mismtched rows
      setLastChildPanelVisited(null);

      setSlideDirection(UP);
      // exit current panel
      setSlideIn(false);

      setTransitionTimeout(DOWN, currentColumnPanels[panelIndex - 1]);
    }
  };

  const showAlternativeBelowPanel = (eventData) => {
    if (comicTree == null) {
      return;
    }

    const panelIndex = currentColumnPanels.findIndex(
      (panel) => panel.panelId === currentPanel.panelData.panelId
    );

    if (panelIndex < currentColumnPanels.length - 1) {
      // console.log(
      //   "moving down to alternative panel",
      //   currentColumnPanels[panelIndex + 1].panelData
      // );

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
    getComic(comicId).then((result) => {
      const [data] = result;
      setComicTree(new ComicTree(data));
      setComicTreeLoading(false);
    });

    setComicTreeLoading(true);
  }, [comicId]);

  const onCreateNewPanel = (panelId) => {
    history.push(`/create/${comicId}/${panelId}`);
  };

  const onVote = (panelId) => {
    voteOnComicPanel(comicId, panelId)
      .then((result) => {
        const [data] = result;
        setComicTree(new ComicTree(data.comicData));
      })
      .catch((error) => {
        console.log(error.message);
      });
    // automatically update counter so user does not have to wait for response
    setPanelVoteCount((panelVoteCount) => panelVoteCount + 1);
    setUserHasVoted(true)
  };

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        // console.log(info);
        setUserInfo(info);
        setUserHasVoted(userIdInPanelVotes(currentPanel.panelData, info))
      });
    }
  }, [authState, authService]);

  return (
    <div className={classes.root} {...handlers}>
      <Paper>
        <Card>
          {comicTreeLoading && (
            <Typography variant="h5">Loading Comic Panels...</Typography>
          )}
          <Grid container direction="column" item xs={12} align="center">
            <Grid item justify="center">
              <IconButton
                color={"primary"}
                size={"small"}
                style={{ backgroundColor: (comicTreeLoading || panelDoesNotHaveAlternativePanelAbove()) ? "white" : "lightGrey" }}
                disabled={comicTreeLoading || panelDoesNotHaveAlternativePanelAbove()}
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
                size={"small"}
                style={{ backgroundColor: (comicTreeLoading || panelIsFirstPanel(currentPanel)) ? "white" : "lightGrey", marginLeft: "25%" }}
                disabled={comicTreeLoading || panelIsFirstPanel(currentPanel)}
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
                    {imageLoading && <img
                      className={classes.panelImage}
                      src={`/images/blank-loading.png`}
                      alt="loading panel"
                    />}
                    <img
                      className={classes.panelImage}
                      style={imageLoading ? { display: 'none' } : {}}
                      src={`https://comicker-comic-panels.s3.amazonaws.com/comics/${comicId}/${currentPanel.panelData.panelId}.jpg`}
                      alt="comic"
                      onLoad={() => setImageLoading(false)}
                    />
                  </Box>
                </div>
              </Slide>
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color={"primary"}
                size={"small"}
                style={{ backgroundColor: (comicTreeLoading || panelDoesNotHaveChildPanels(currentPanel)) ? "white" : "lightGrey", marginLeft: "25%" }}
                disabled={comicTreeLoading || panelDoesNotHaveChildPanels(currentPanel)}
                onClick={showNextPanel}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Grid>
            <Grid container direction="column" item xs={12} align="center">
              <Grid item justify="center">
                <IconButton
                  color={"primary"}
                  size={"small"}
                  style={{ backgroundColor: (comicTreeLoading || panelDoesNotHaveAlternativePanelBelow()) ? "white" : "lightGrey" }}
                  disabled={comicTreeLoading || panelDoesNotHaveAlternativePanelBelow()}
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
      <Grid container direction="row" alignItems="center" justify="center" xs={12} spacing={2}>
        <Grid item xs={4}>
          <Button variant="contained"
            style={{ color: "white", backgroundColor: userHasVoted ? "green" : "grey" }}
            startIcon={<ArrowUpwardIcon />}
            onClick={() => {
              if (!userHasVoted) {
                onVote(currentPanel.panelData.panelId)
              }
            }}>
            {userHasVoted ? "voted" : "vote"} {panelVoteCount}
          </Button>
        </Grid>
        {/* do not let the user chain more than 4 panels together */}
        {currentColumnIndex != 3 && <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => onCreateNewPanel(currentPanel.panelData.panelId)}
          >
            Add Next Panel
          </Button>
        </Grid>
        }
        <Grid item xs={4}>
          {!panelIsFirstPanel(currentPanel) && (
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
