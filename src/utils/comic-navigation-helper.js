import ComicTree from "./comic-tree";

const STARTING_PANEL_INDEX = 0;

const getStartingPanel = (comic) => {
  return comic.comic.panels[STARTING_PANEL_INDEX];
};

export { getStartingPanel };
