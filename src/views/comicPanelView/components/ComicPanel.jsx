import React, { useState } from "react";
import {
  Button,
  Box,
  Card,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const useStyles = makeStyles({
  canvasBorder: {
    display: "inline-block",
  },
  panelImage: { width: "100%", marginTop: "0%" },
  arrow: { margin: "0, 0, 5%, 5%", width: "10%" },
  spacer: { marginLeft: "15%", width: "30%", height: "30%" },
});

const userIdInPanelVotes = (panelData, userInfo) => {
  return panelData.voterIds.includes(userInfo?.sub);
};

const ComicPanel = (props) => {
  const { userInfo, panelNode, dataUri, onCreatePanel, onVote } = props;
  const classes = useStyles();
  const [panelImageLoaded, setPanelImageLoaded] = useState(false);
  const panelData = panelNode.panelData
  const panelParentId = panelNode.parentId

  const [userHasVoted, setUserHasVoted] = useState(
    userIdInPanelVotes(panelData, userInfo)
  );

  return (
    <div>
      <Paper>
        <Card>
          <Box
            className={classes.canvasBorder}
            disableGutters={true}
            border={5}
          >
            <img
              className={classes.panelImage}
              style={panelImageLoaded ? {} : { display: "none" }}
              src={dataUri}
              alt="comic"
              onLoad={() => setPanelImageLoaded(true)}
            />
          </Box>
          <Typography>{`Author: ${panelData.author}`}</Typography>
          <Grid container direction="row" alignItems="center">
            <Grid className={classes.arrow} item>
              <IconButton
                color={userHasVoted ? "primary" : "default"}
                disableRipple={userHasVoted}
                onClick={
                  !userHasVoted ? () => onVote(panelData.panelId) : () => {}
                }
              >
                <ArrowUpwardIcon />
              </IconButton>
            </Grid>
            <Grid className={classes.voteBox} item>
              <Typography variant="h6">
                {panelData.voterIds ? panelData.voterIds.length : 0}
              </Typography>
            </Grid>
            <Grid className={classes.spacer} item>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => onCreatePanel(panelData.panelId)}
              >
                Add Next Panel
              </Button>
            </Grid>
            <Grid item>
              {panelParentId && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => onCreatePanel(panelParentId)}
                >
                  Add Alternative Panel
                </Button>
              )}
            </Grid>
          </Grid>
        </Card>
      </Paper>
    </div>
  );
};

export default ComicPanel;
