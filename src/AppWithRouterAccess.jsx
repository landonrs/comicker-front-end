import React from "react";
import { Route, useHistory } from "react-router-dom";
import { Security, SecureRoute, LoginCallback } from "@okta/okta-react";
import Home from "./Home";
import SignIn from "./SignIn";
import Protected from "./Protected";
import ComicCreator from "./views/comicCreation/ComicCreator";
import ComicPanelTracker from "./views/comicPanelView/ComicPanelTracker";

const AppWithRouterAccess = () => {
  const history = useHistory();
  const onAuthRequired = () => {
    history.push("/login");
  };

  return (
    <Security
      issuer="https://dev-2337597.okta.com/oauth2/default"
      clientId="0oa11x8lf6LsqfwAH5d6"
      redirectUri={window.location.origin + "/login/callback"}
      onAuthRequired={onAuthRequired}
      pkce={true}
      scopes={["openid", "profile", "groups"]}
    >
      <Route path="/" exact={true} component={Home} />
      <Route path="/view/:comicId" exact={true} component={ComicPanelTracker} />
      <SecureRoute path="/protected" component={Protected} />
      <SecureRoute path="/create" exact={true} component={ComicCreator} />
      <SecureRoute
        path="/create/:comicId/:panelId"
        exact={true}
        component={ComicCreator}
      />
      <Route
        path="/login"
        render={() => (
          <SignIn issuer="https://dev-2337597.okta.com/oauth2/default" />
        )}
      />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
};
export default AppWithRouterAccess;
