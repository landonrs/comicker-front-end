import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Paper,
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import CreateIcon from "@material-ui/icons/Create";
import { getAllComics } from "./utils/comicker-client";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
});

const Home = () => {
  const [value, setValue] = React.useState(0);
  const { authState, authService } = useOktaAuth();
  const [comics, setComics] = useState([]);
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    let isCancelled = false;

    getAllComics()
      .then((data) => {
        if (!isCancelled) {
          const [comicList] = data;
          setComics(comicList);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setComics([]);
      });
  }, []);

  if (authState.isPending) {
    return <div>Loading...</div>;
  }

  const button = authState.isAuthenticated ? (
    <button
      onClick={() => {
        authService.logout();
      }}
    >
      Logout
    </button>
  ) : (
    <button
      onClick={() => {
        history.push("/login");
      }}
    >
      Login
    </button>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Link to="/">
            <img
              className={classes.logo}
              alt="Logo"
              src="/images/logo192.png"
            />
          </Link>

          <Typography variant="h6" color="inherit" align="center">
            Comicker
          </Typography>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Avatar>L</Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper className={classes.root}>
        <div>
          <Link to="/">Home</Link>
          <br />
          <Link to="/protected">Protected</Link>
          <br />
          {button}
        </div>
        {comics.map((comic) => {
          console.log("setting comic panel");
          return (
            <Container maxWidth="xs" key={comic.comic.title}>
              <Typography>{comic.comic.title}</Typography>
              <img
                className={classes.logo}
                alt="comic"
                src="/images/comic.jpg"
              />
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
    </>
  );
};
export default Home;
