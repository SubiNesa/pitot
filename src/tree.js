// https://www.30secondsofcode.org/articles/s/js-data-structures-tree/#:~:text=A%20tree%20is%20a%20data,any%20children%20are%20the%20leaves.
class TreeNode {
  constructor(key, value = {}, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.children = [];
  }

  get isLeaf() {
    return this.children.length === 0;
  }

  get hasChildren() {
    return !this.isLeaf;
  }
}

module.exports.Tree = class Tree {
  root;
  constructor(key, value = {}) {
    this.root = new TreeNode(key, value);
  }

  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root) {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(parentNodeKey, key, value = key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, value, node));
        return true;
      }
    }
    return false;
  }

  // insert(type, parentNodeKey, key, value = {}) {
  //   if (key === this.root.key) {
  //     this.root.value = { ...{ value }, ...this.root.value };
  //   } else {
  //     for (let node of this.preOrderTraversal()) {
  //       if (node.key === parentNodeKey) {
  //         if (!node.value[type]) {
  //           node.value[type] = [value];
  //         } else {
  //           node.value[type] = [...[value], ...node.value[type]];
  //         }
  //         node.children.push(new TreeNode(key, {}, node));

  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
};
