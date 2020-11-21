import client from "./api-client";

const BASE_PATH = "/comicker";

const getAllComics = () => {
  return client(`/comics`);
};

export { getAllComics };
