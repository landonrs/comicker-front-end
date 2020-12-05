import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const THOUGHT_BUBBLE_URL = "/images/thought_bubble.png";
const SPEECH_BUBBLE_URL = "/images/speechBubble.png";

const BUBBLE_TYPES = [
  {
    src: THOUGHT_BUBBLE_URL,
    id: "thoughtBubble1",
  },
  {
    src: SPEECH_BUBBLE_URL,
    id: "speechBubble1",
  },
];

const useStyles = makeStyles({
  bubbleItem: { width: "30px", height: "30px" },
  selectedBubbleDisplay: { height: "100px", margin: "15px" },
});

const SpeechBubbleSelectDialog = (props) => {
  const { onConfirm, open, onClose } = props;
  const [selectedBubbleType, setSelectedBubbleType] = useState(BUBBLE_TYPES[0]);
  const classes = useStyles();

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>{"Select bubble type:"}</DialogTitle>
      <DialogContent>
        <img
          src={selectedBubbleType.src}
          className={classes.selectedBubbleDisplay}
        />
        <Grid container direction="row" alignItems="center">
          {BUBBLE_TYPES.map((bubble) => {
            return (
              <Grid onClick={() => setSelectedBubbleType(bubble)} item xs={3}>
                <Box
                  disableGutters={true}
                  border={selectedBubbleType.id === bubble.id ? 2 : 0}
                >
                  <img src={bubble.src} className={classes.bubbleItem} />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onConfirm(selectedBubbleType.src)}
        >
          Add Bubble
        </Button>
        <Button variant="contained" color="primary" onClick={() => onClose()}>
          Cancel
        </Button>
      </DialogActions>{" "}
    </Dialog>
  );
};

export default SpeechBubbleSelectDialog;
