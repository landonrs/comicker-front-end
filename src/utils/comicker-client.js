import client from "./api-client";

const BASE_PATH = "/comicker";

const getAllComics = () => {
  return client(`${BASE_PATH}/comics`);
};

const voteOnComic = (comicId) => {
  return client(`/comics/${comicId}/vote`, { body: {}, method: "PUT" });
};

const addPanel = (comic, previousPanelId, panelImage) => {
  return client(`/comics/${comic.comicId}/addPanel`, {
    body: { comic, previousPanelId, panelImage },
  });
};

const createComic = (comicData) => {
  return client(`/comics/create`, { body: { comicData }, method: "POST" });
};

export { getAllComics };
