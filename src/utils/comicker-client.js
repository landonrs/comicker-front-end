import client from "./api-client";

const BASE_PATH = "/comicker";

const getPaginatedComics = (comicPageId) => {
  return client(`${BASE_PATH}/comics/${comicPageId}`);
};

const getComic = (comicId) => {
  return client(`${BASE_PATH}/comics/comic/${comicId}`);
};

const voteOnComicPanel = (comicId, panelId) => {
  return client(`${BASE_PATH}/comics/comic/${comicId}/vote`, {
    body: { panelId },
    method: "PUT",
  });
};

const createComic = (comicData) => {
  return client(`${BASE_PATH}/comics/comic/create`, {
    body: { ...comicData },
    method: "POST",
  });
};

export {
  getPaginatedComics,
  getComic,
  createComic,
  voteOnComicPanel,
};
