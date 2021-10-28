import client from "./api-client";

const BASE_PATH = "/comicker";

const getAllComics = () => {
  return client(`${BASE_PATH}/comics`);
};

const voteOnComicPanel = (comicId, panelId) => {
  return client(`${BASE_PATH}/comics/${comicId}/vote`, {
    body: { panelId },
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
    body: { ...comicData },
    method: "POST",
  });
};

export { getAllComics, createComic, addPanel, voteOnComicPanel };
