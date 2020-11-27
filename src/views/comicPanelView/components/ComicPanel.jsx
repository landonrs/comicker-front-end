import React from "react";
import {
  Button,
  Card,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

const useStyles = makeStyles({
  panelImage: { width: "100%", marginTop: "10%" },
  arrow: { margin: "0, 0, 5%, 5%", width: "10%" },
  spacer: { marginLeft: "45%", width: "30%", height: "25%" },
});

const ComicPanel = (props) => {
  const { panelData, dataUri } = props;
  const classes = useStyles();

  const onPanelVote = (panelId) => {
    // TODO call vote endpoint
  };

  const onCreateChildPanel = (panelId) => {
    console.log("navigate to panel creator...");
  };

  return (
    <div>
      <Paper>
        <Card>
          <img className={classes.panelImage} src={dataUri} alt="comic" />
          <Typography>{`Author: ${panelData.author}`}</Typography>
          <Grid container direction="row" alignItems="center">
            <Grid className={classes.arrow} item>
              <IconButton onClick={() => onPanelVote(panelData.panelId)}>
                <ArrowUpwardIcon />
              </IconButton>
            </Grid>
            <Grid className={classes.voteBox} item>
              <Typography variant="h6">{panelData.voteCount}</Typography>
            </Grid>
            <Grid className={classes.spacer} item>
              <Button
                variant="contained"
                color="primary"
                onClick={(e) => onCreateChildPanel(panelData.panelId)}
              >
                Add Next Panel
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Paper>
    </div>
  );
};

export default ComicPanel;
