import client from "./api-client";

const BASE_PATH = "/comicker";

const getAllComics = () => {
  return client(`${BASE_PATH}/comics`);
};

const voteOnComic = (comicId) => {
  return client(`${BASE_PATH}/comics/${comicId}/vote`, {
    body: {},
    method: "PUT",
  });
};

const addPanel = (comic, previousPanelId, panelImage) => {
  return client(`${BASE_PATH}/comics/${comic.comicId}/addPanel`, {
    body: { comic, previousPanelId, panelImage },
  });
};

const createComic = (comicData) => {
  return client(`${BASE_PATH}/comics/create`, {
    body: { comicData },
    method: "POST",
  });
};

export { getAllComics, createComic, addPanel, voteOnComic };
