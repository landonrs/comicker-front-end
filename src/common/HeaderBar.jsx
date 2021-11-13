import React, { useState, useEffect } from "react";
import {
  AppBar,
  Grid,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useOktaAuth } from "@okta/okta-react";
import { setAccessToken } from "../utils/api-client";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34, marginLeft: "25%" },
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
      setAccessToken(authState.accessToken);
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
    <>
      {authState.isAuthenticated && <AppBar position="sticky">
        <Grid container direction="row" alignItems="center" xs={12} spacing={2}>
          <Grid item xs={2}>
            <Link to="/">
              <img className={classes.logo} alt="Logo" src="/images/logo192.png" />
            </Link>
          </Grid>
          <Grid item xs={8}>
            <Typography
              variant="h4"
              color="inherit"
              align="center"
            >
              Comicker
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <div>{button}</div>
          </Grid>
        </Grid>
      </AppBar>}
    </>
  );
};

export default HeaderBar;
