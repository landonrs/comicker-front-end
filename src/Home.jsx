import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { makeStyles } from "@material-ui/core/styles";
import {
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

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
});

const Home = () => {
  const [value, setValue] = React.useState(0);
  const { authState, authService } = useOktaAuth();
  const history = useHistory();
  const classes = useStyles();

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
        <BottomNavigation
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          showLabels
        >
          <BottomNavigationAction label="Start a comic" icon={<CreateIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};
export default Home;
