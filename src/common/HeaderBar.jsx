import React, { useState, useEffect } from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useOktaAuth } from "@okta/okta-react";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
  comicRow: { height: 100 },
  headerText: { marginLeft: "15%", marginRight: "10%" },
});

const HeaderBar = () => {
  const classes = useStyles();
  const history = useHistory();
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        console.log(info);
        setUserInfo(info);
      });
    }
  }, [authState, authService]);

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
    <AppBar position="sticky">
      <Toolbar>
        <Link to="/">
          <img className={classes.logo} alt="Logo" src="/images/logo192.png" />
        </Link>

        <Typography
          className={classes.headerText}
          variant="h4"
          color="inherit"
          align="center"
        >
          Comicker
        </Typography>

        {userInfo ? (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Avatar>{userInfo.name[0]}</Avatar>
          </IconButton>
        ) : (
          <div>{button}</div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
