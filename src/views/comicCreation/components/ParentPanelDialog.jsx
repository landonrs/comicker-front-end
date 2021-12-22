import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
    parentPanelDialog: { height: "100%", width: "100%"},
    panelDisplay: { height: "100%", width: "100%" },
});

const ParentPanelDialog = (props) => {
  const { onConfirm, open, onClose, parentPanelUrl } = props;
  const classes = useStyles();

  return (
    <Dialog onClose={() => onClose()} open={open} className={classes.parentPanelDialog}>
      <DialogContent>
        <img
          src={parentPanelUrl}
          className={classes.panelDisplay}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
              onConfirm()
              onClose()
          }
        }
        >
          Copy panel
        </Button>
        <Button variant="contained" color="primary" onClick={() => onClose()}>
          Close
        </Button>
      </DialogActions>{" "}
    </Dialog>
  );
};

export default ParentPanelDialog;
