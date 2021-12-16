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


const BUBBLE_TYPES = [
  {
    src: "/images/SB-1.png",
    id: "SB-1"
  },
  {
    src: "/images/SB-2.png",
    id: "SB-2"
  },
  {
    src: "/images/SB-3.png",
    id: "SB-3"
  },
  {
    src: "/images/SB-4.png",
    id: "SB-4"
  },
  {
    src: "/images/SB-5.png",
    id: "SB-5"
  },
  {
    src: "/images/SB-6.png",
    id: "SB-6"
  },
  {
    src: "/images/SB-7.png",
    id: "SB-7"
  },
  {
    src: "/images/SB-8.png",
    id: "SB-8"
  },
  {
    src: "/images/SB-9.png",
    id: "SB-9"
  }
];

const useStyles = makeStyles({
  bubbleItem: { width: "30px", height: "30px" },
  selectedBubbleDisplay: { height: "200px", margin: "15px" },
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
