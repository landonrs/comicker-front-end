import React, { useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

const Protected = () => {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      authService.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, authService]);

  return <h3>Protected info {JSON.stringify(userInfo)}</h3>;
};

export default Protected;
