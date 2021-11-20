const STARTING_PANEL_INDEX = 0;

const getStartingPanel = (comic) => {
  return {
    panelData: comic.panels[STARTING_PANEL_INDEX],
    parentId: null,
  };
};

export { getStartingPanel };
