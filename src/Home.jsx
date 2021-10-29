import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
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
import { getAllComics} from "./utils/comicker-client";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
  comicRow: { height: 100 },
});

const Home = () => {
  const [value, setValue] = React.useState(0);
  const { authState } = useOktaAuth();
  const [comics, setComics] = useState([]);
  const [comicsLoading, setComicsLoading] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    let isCancelled = false;

    getAllComics()
      .then((data) => {
        if (!isCancelled) {
          const [comicList] = data;
          setComics(comicList);
          setComicsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setComics([]);
        setComicsLoading(false);
      });

    setComicsLoading(true);
  }, []);

  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
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
        <Paper className={classes.root}>
          {comics.map((comicData) => {
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
                      <Typography variant="caption">total votes: 5</Typography>
                    </Grid>
                  </Grid>
                </Card>
              </Container>
            );
          })}
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
      )}
    </>
  );
};
export default Home;
