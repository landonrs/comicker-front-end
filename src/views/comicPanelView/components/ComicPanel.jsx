import React from "react";
import { Card, Paper, Typography, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  panelImage: { width: "100%", marginTop: "10%" },
});

const ComicPanel = (props) => {
  const { panelData, dataUri } = props;
  const classes = useStyles();

  return (
    <div>
      <Paper>
        <Card>
          <img className={classes.panelImage} src={dataUri} alt="comic" />
          <Typography>{`Author: ${panelData.author}`}</Typography>
        </Card>
      </Paper>
    </div>
  );
};

export default ComicPanel;
