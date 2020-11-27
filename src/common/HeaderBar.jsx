import React from "react";
import {
  Avatar,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  logo: { height: 34 },
  comicRow: { height: 100 },
});

const HeaderBar = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link to="/">
          <img className={classes.logo} alt="Logo" src="/images/logo192.png" />
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
  );
};

export default HeaderBar;
