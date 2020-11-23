var accessToken;

function client(url, { body, method, noAuth, ...customConfig } = {}) {
  const headers = {
    "content-type": "application/json",
    Accept: "application/json",
  };

  if (accessToken && !noAuth) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const config = {
    method: method ? method : body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return window.fetch(url, config).then((r) => {
    return r.text().then((text) => {
      const resp = { type: "text", data: null };
      try {
        resp.data = JSON.parse(text);
        resp.type = "json";
      } catch (error) {
        resp.data = text;
      }

      if (r.status >= 400 || resp.data.errorMessage) {
        let err;

        switch (resp.type) {
          case "json":
            err = new Error(resp.data.message || resp.data.errorMessage);
            break;
          case "text":
            err = new Error(resp.data);
            break;
          default:
            err = new Error("Error requesting url: " + url);
            break;
        }

        err.status = r.status;
        err.data = resp.data;

        throw err;
      }

      return [resp.data, r];
    });
  });
}

export function setAccessToken(token) {
  accessToken = token;
}

export default client;
