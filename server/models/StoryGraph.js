export class StoryGraph {
  constructor() {
    this.nodes = new Map();
    this.branches = new Map();
    this.branches.set("main", { name: "Main Timeline", headNodeId: null, forkPointId: null });
  }

  addNode(eventNode) {
    this.nodes.set(eventNode.id, eventNode);

    if (eventNode.parentId && this.nodes.has(eventNode.parentId)) {
      const parent = this.nodes.get(eventNode.parentId);
      if (!parent.children.includes(eventNode.id)) {
        parent.children.push(eventNode.id);
      }
    }

    const branch = this.branches.get(eventNode.branchId);
    if (branch) {
      branch.headNodeId = eventNode.id;
    }
  }

  getNode(nodeId) {
    return this.nodes.get(nodeId) ?? null;
  }

  getMainline() {
    return this._walkBranch("main");
  }

  getBranch(branchId) {
    return this._walkBranch(branchId);
  }

  getForksAt(nodeId) {
    const forks = [];
    for (const [branchId, info] of this.branches) {
      if (branchId !== "main" && info.forkPointId === nodeId) {
        forks.push(branchId);
      }
    }
    return forks;
  }

  fork(parentNodeId, newBranchId, forkNode, rippleNodes) {
    this.branches.set(newBranchId, {
      name: `Branch ${newBranchId}`,
      headNodeId: null,
      forkPointId: parentNodeId,
    });

    this.addNode(forkNode);
    for (const node of rippleNodes) {
      this.addNode(node);
    }
  }

  getTimeline(branchId) {
    if (branchId === "main") {
      return this.getMainline().map((n) => n.toLightweight());
    }

    const branchInfo = this.branches.get(branchId);
    if (!branchInfo) return null;

    const mainline = this.getMainline();
    const forkIndex = mainline.findIndex((n) => n.id === branchInfo.forkPointId);
    const prefix = forkIndex >= 0 ? mainline.slice(0, forkIndex + 1) : [];
    const branchNodes = this._walkBranch(branchId);

    return [...prefix, ...branchNodes].map((n) => n.toLightweight());
  }

  getBranchList() {
    return Array.from(this.branches.entries()).map(([id, info]) => ({
      id,
      name: info.name,
      headNodeId: info.headNodeId,
      forkPointId: info.forkPointId,
    }));
  }

  _walkBranch(branchId) {
    const result = [];
    let startNode = null;

    if (branchId === "main") {
      for (const node of this.nodes.values()) {
        if (node.branchId === "main" && node.parentId === null) {
          startNode = node;
          break;
        }
      }
    } else {
      const branchInfo = this.branches.get(branchId);
      if (!branchInfo || !branchInfo.forkPointId) return result;

      const forkPoint = this.nodes.get(branchInfo.forkPointId);
      if (!forkPoint) return result;

      for (const childId of forkPoint.children) {
        const child = this.nodes.get(childId);
        if (child && child.branchId === branchId) {
          startNode = child;
          break;
        }
      }
    }

    if (!startNode) return result;

    let current = startNode;
    while (current) {
      result.push(current);
      let next = null;
      for (const childId of current.children) {
        const child = this.nodes.get(childId);
        if (child && child.branchId === branchId) {
          next = child;
          break;
        }
      }
      current = next;
    }

    return result;
  }
}
