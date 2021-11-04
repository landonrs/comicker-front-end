import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
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
import PanelCreator from "./components/PanelCreator";
import html2canvas from "html2canvas";

const ComicCreator = () => {
  const history = useHistory();
  const { comicId, panelId } = useParams();

  const [comicTitle, setComicTitle] = useState(null);
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);
  const [displayFinalDialog, setDisplayFinalDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  const [uploadingComic, setUploadingComic] = useState(false);

  const onCreate = async (title) => {
    html2canvas(document.querySelector("#comicPanelImage")).then((canvas) => {
      canvas.toBlob(function (imageBlob) {
        createComic({ title, comicId: comicId, parentPanelId: panelId })
          .then(async (data) => {
            const { imageUrl } = data[0];
            var file = new File([imageBlob], "panel.jpg");

            await fetch(imageUrl, {
              method: "PUT",
              headers: {
                "Content-Type": "multipart/form-data",
              },
              body: file,
            });

            setUploadingComic(false);
            setSuccess(true);
          })
          .catch((error) => {
            console.log(error.message);
            setUploadingComic(false);
            setSuccess(false);
          });
      });
    });

    setDisplayConfirmDialog(false);
    setUploadingComic(true);
    setDisplayFinalDialog(true);
  };

  const saveAndConfirm = () => {
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
      <PanelCreator onUpload={saveAndConfirm}/>
      <Dialog
        onClose={() => setDisplayConfirmDialog(false)}
        open={displayConfirmDialog}
      >
        <DialogTitle>
          {comicId ? "Create new panel?" : "Select a title for this comic:"}
        </DialogTitle>
        {!comicId && (
          <DialogContent>
            <TextField
              variant="outlined"
              onChange={(e) => setComicTitle(e.target.value)}
            />
          </DialogContent>
        )}
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
                ? `Comic panel has been successfully created`
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
