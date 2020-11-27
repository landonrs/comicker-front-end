import ComicTree from "./comic-tree";

const STARTING_PANEL_INDEX = 0;

const getStartingPanel = (comic) => {
  return comic.comic.panels[STARTING_PANEL_INDEX];
};

const getNextPanel = (panel) => {
  if (panel.childPanels.length) {
    return panel.childPanels[0];
  }

  return null;
};

const getPreviousPanel = (comicData, panel) => {
  const comicTree = new ComicTree(comicData);
  const parentNode = comicTree.getParentPanel(panel.panelId);
  return parentNode ? parentNode.panelData : null;
};

export { getStartingPanel, getNextPanel, getPreviousPanel };
