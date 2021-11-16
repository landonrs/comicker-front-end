import React, { useState } from "react";
import { OktaAuth } from "@okta/okta-auth-js";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column",
    height: "100vh",
    backgroundColor: "#3F51B5"
  },
  formInput: {
    backgroundColor: "white",
    marginTop: "5%"
  },
  loginButton: {
    backgroundColor: "white",
    height: 50,
    width: 200
  }
}));

const SignInForm = ({ issuer }) => {
  const { authService } = useOktaAuth();
  const [sessionToken, setSessionToken] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    const oktaAuth = new OktaAuth({
      // If your app is configured to use the Implicit Flow
      // instead of the Authorization Code with Proof of Code Key Exchange (PKCE)
      // you will need to uncomment the below line:
      // pkce: false,
      issuer: issuer,
    });
    oktaAuth
      .signIn({ username, password })
      .then((res) => {
        const sessionToken = res.sessionToken;
        setSessionToken(sessionToken);
        // sessionToken is a one-use token, so make sure this is only called once
        authService.redirect({ sessionToken });
      })
      .catch((err) => console.log("Found an error", err));
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  if (sessionToken) {
    // Hide form while sessionToken is converted into id/access tokens
    return null;
  }

  return (
    <Paper className={classes.root}>
      <Grid container direction="column" item xs={12} align="center">
        <Grid item justify="center" style={{ marginTop: "30%" }}>
          <div >
            <img width={250} alt="Logo" src="/images/comicker-logo-main.png" />
          </div>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid item justify="center">
            <TextField
              className={classes.formInput}
              id="username"
              type="text"
              label={"Username:"}
              value={username}
              onChange={handleUsernameChange}
              variant="filled"
            />
          </Grid>
          <Grid item justify="center">
            <TextField
              className={classes.formInput}
              id="password"
              type="password"
              label={"Password:"}
              value={password}
              onChange={handlePasswordChange}
              variant="filled"
            />
          </Grid>
          <Grid item justify="center" style={{ marginTop: "5%" }}>
            <Button className={classes.loginButton} fullWidth={true} id="submit" type="submit">Login</Button>
          </Grid>
        </form>
      </Grid>
    </Paper>
  );
};
export default SignInForm;
