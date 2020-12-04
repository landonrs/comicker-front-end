import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";

const TextSelectDialog = (props) => {
  const { onConfirm, open, onClose } = props;
  const [textValue, setTextValue] = useState("Type Your text here...");

  return (
    <Dialog onClose={() => onClose()} open={open}>
      <DialogTitle>{"Enter your text:"}</DialogTitle>
      <DialogContent>
        <TextField
          variant="outlined"
          onChange={(e) => setTextValue(e.target.value)}
          autoFocus={true}
          multiline={true}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onConfirm(textValue)}
        >
          Add Text
        </Button>
        <Button variant="contained" color="primary" onClick={() => onClose()}>
          Cancel
        </Button>
      </DialogActions>{" "}
    </Dialog>
  );
};

export default TextSelectDialog;
