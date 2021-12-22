import React, { useState, useEffect } from "react";
import {
  AppBar,
  Grid,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useOktaAuth } from "@okta/okta-react";
import { setAccessToken } from "../utils/api-client";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34, marginLeft: "35%" },
  comicRow: { height: 100 },
  headerText: { height: 40, padding: 10 },
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
        <Grid container direction="row" alignItems="center" justify="center" xs={12} spacing={0}>
          <Grid item xs={4}>
            <Grid container direction="column" item xs={12} align="center">
              <div>
              <Link to="/">
                <img className={classes.headerText} alt="Logo" src="/images/comicker-logo-main.png" />
              </Link>
              </div>
            </Grid>
          </Grid>
          {/* spacer */}
          <Grid item xs={6}>
            <div>
            </div>
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
