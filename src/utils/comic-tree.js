const ROOT_NODE_ID = "rootNode";

class ComicTree {
  constructor(comicData) {
    this.comicId = comicData.comicId;
    this.comicData = comicData;
    this.nodes = buildComicTree(comicData);
  }

  /**
   * Get the Parent Panel data for the specified panel, returns null if starting panel.
   * @param {*} panelId
   */
  getParentPanel(panelId) {
    let parentId = "";
    this.nodes.forEach((panelNode) => {
      if (
        panelNode.panelId === panelId &&
        panelNode.parentId !== ROOT_NODE_ID
      ) {
        parentId = panelNode.parentId;
      }
    });
    return this.getPanelById(parentId);
  }

  /**
   * Get the specified panel data, returns null if not found.
   * @param {*} panelId
   */
  getPanelById(panelId) {
    return this.nodes.find((panel) => panel.panelId === panelId);
  }
}

const buildComicTree = (comicData) => {
  var nodeList = [];
  const comicPanels = comicData.comic.panels;
  // Add starting panel
  const startingPanel = comicPanels[0];
  addChildrenNodesToTree(startingPanel, ROOT_NODE_ID, nodeList);

  console.log("tree built", nodeList);
  return nodeList;
};

const addChildrenNodesToTree = (panel, parentId, nodeList) => {
  panel.childPanels.forEach((childPanel) => {
    addChildrenNodesToTree(childPanel, panel.panelId, nodeList);
  });

  nodeList.push(new PanelNode(parentId, panel));
};

class PanelNode {
  constructor(parentId, panelData) {
    this.parentId = parentId;
    this.panelId = panelData.panelId;
    this.panelData = panelData;
  }
}

export default ComicTree;
