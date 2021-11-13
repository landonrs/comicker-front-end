const ROOT_NODE_ID = "rootNode";

const comicSortType = {
  VOTE_COUNT_LOW_TO_HIGH: "voteCountLowToHigh",
  VOTE_COUNT_HIGH_TO_LOW: "voteCountHighToLow",
};

class ComicTree {
  constructor(comicData, sortBy = comicSortType.VOTE_COUNT_HIGH_TO_LOW) {
    this.comicId = comicData.comicId;
    this.comicData = comicData;
    this.comicSortType = sortBy;
    this.nodes = buildComicTree(comicData, sortBy);
  }

  static getTotalComicVoteCount(comicData) {
    let totalVoteCount = 0;
    const nodes = buildComicTree(comicData);
    nodes.forEach((panelNode) => {
      totalVoteCount += panelNode.voteCount;
    });

    return totalVoteCount;
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
   * Get all child nodes for the specified panel.
   * @param {String} panelId
   */
  getChildPanels(panelId) {
    let children = this.nodes.filter((node) => node.parentId === panelId);
    return this.sortNodes(children);
  }

  sortNodes(nodes) {
    if (this.comicSortType === comicSortType.VOTE_COUNT_LOW_TO_HIGH) {
      nodes.sort(function (a, b) {
        return getVoteCount(a.panelData) - getVoteCount(b.panelData);
      });
    } else {
      nodes.sort(function (a, b) {
        return getVoteCount(b.panelData) - getVoteCount(a.panelData);
      });
    }

    return nodes;
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

const getVoteCount = (panel) => {
  return panel.voterIds ? panel.voterIds.length : 0;
};

class PanelNode {
  constructor(parentId, panelData) {
    this.parentId = parentId;
    this.panelId = panelData.panelId;
    this.panelData = panelData;
    this.voteCount = panelData.voterIds.length;
  }
}

export default ComicTree;
