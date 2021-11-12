import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  IconButton,
} from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CreateIcon from "@material-ui/icons/Create";
import ComicTree from "./utils/comic-tree";
import { getPaginatedComics } from "./utils/comicker-client";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
  comicRow: { height: 100 },
});

const Home = () => {
  // allow user to scroll
  document.body.style.overflow = 'visible';
  const [value, setValue] = React.useState(0);
  const { authState } = useOktaAuth();
  const [comics, setComics] = useState([]);
  const [comicPageId, setComicPageId] = useState("first");
  const [comicsLoading, setComicsLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  function getNextComicPage() {
    getPaginatedComics(comicPageId)
      .then((data) => {
        const [comicList] = data;
        setComics((currentComics) => currentComics.concat(comicList.comics));
        setComicPageId(comicList.pageId);
        setComicsLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
        setComics([]);
        setComicsLoading(false);
      });
    setComicsLoading(true);
  }

  useEffect(() => {
    getNextComicPage();
  }, []);

  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Paper className={classes.root}>
        {comics && comics.map((comicData) => {
          console.log("setting comic panel");
          return (
            <Container maxWidth="xs" key={comicData.comic.title}>
              <Card>
                <CardActionArea
                  onClick={(event) =>
                    history.push({
                      pathname: `/view/${comicData.comicId}`,
                      state: { comicData },
                    })
                  }
                >
                  <Typography>{comicData.comic.title}</Typography>
                  <img
                    className={classes.comicRow}
                    alt="comic"
                    src={`https://comicker-comic-panels.s3.amazonaws.com/comics/${comicData.comicId}/${comicData.comicId}.jpg`}
                  />
                </CardActionArea>
                <Divider orientation="vertical" />
                <Grid container direction="row" alignItems="center">
                  <Grid className={classes.voteBox} item>
                    <Typography variant="caption">{`total votes: ${ComicTree.getTotalComicVoteCount(comicData)}`}</Typography>
                  </Grid>
                </Grid>
              </Card>
            </Container>
          );
        })}
        {comicsLoading ? (
          <Box
            display="flex"
            width={"100%"}
            height={500}
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            {comicPageId && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => getNextComicPage()}
              >
                View More Comics
              </Button>
            )}
          </>
        )}
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction
            label="Start a comic"
            icon={
              <IconButton onClick={() => history.push("/create")}>
                <CreateIcon />
              </IconButton>
            }
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};
export default Home;
