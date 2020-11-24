import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createComic } from "../../utils/comicker-client";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";
import PanelCreator from "../../common/PanelCreator";

const ComicCreator = () => {
  const history = useHistory();

  const [comicTitle, setComicTitle] = useState(null);
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);
  const [displayFinalDialog, setDisplayFinalDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  const [uploadingComic, setUploadingComic] = useState(false);

  const onCreate = (title) => {
    createComic({ title })
      .then((data) => {
        setUploadingComic(false);
        setSuccess(true);
      })
      .catch((error) => {
        console.log(error.message);
        setUploadingComic(false);
        setSuccess(false);
      });

    setDisplayConfirmDialog(false);
    setUploadingComic(true);
    setDisplayFinalDialog(true);
  };

  const saveAndConfirm = () => {
    // TODO - encode image data
    setDisplayConfirmDialog(true);
  };

  const closeAndNavigateHome = () => {
    setDisplayFinalDialog(false);
    if (success) {
      history.push("/");
    }
  };

  return (
    <div>
      <PanelCreator />
      <Button color="primary" onClick={() => saveAndConfirm()}>
        Upload
      </Button>

      <Dialog
        onClose={() => setDisplayConfirmDialog(false)}
        open={displayConfirmDialog}
      >
        <DialogTitle>Select a title for this comic:</DialogTitle>
        <DialogContent>
          <TextField
            variant="outlined"
            onChange={(e) => setComicTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onCreate(comicTitle)}
          >
            Create
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDisplayConfirmDialog(false)}
          >
            Cancel
          </Button>
        </DialogActions>{" "}
      </Dialog>

      <Dialog onClose={() => closeAndNavigateHome()} open={displayFinalDialog}>
        {uploadingComic ? (
          <CircularProgress />
        ) : (
          <>
            <DialogTitle>
              {success
                ? `'${comicTitle}' has been successfully created`
                : "An Error Occurred, please try again"}
              :
            </DialogTitle>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => closeAndNavigateHome()}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default ComicCreator;
