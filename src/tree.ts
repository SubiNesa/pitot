// https://www.30secondsofcode.org/articles/s/js-data-structures-tree/#:~:text=A%20tree%20is%20a%20data,any%20children%20are%20the%20leaves.
class TreeNode {
  key: string;
  value: {};
  parent: any;
  children: string[];

  constructor(key: string, value = {}, parent = null) {
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

export class Tree {
  root: any;
  constructor(key: string, value = {}) {
    this.root = new TreeNode(key, value);
  }

  *preOrderTraversal(node = this.root): any {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  *postOrderTraversal(node = this.root): any {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  insert(type: string, parentNodeKey: any, key: string, value = {}) {
    if (key === this.root.key) {
      this.root.value = { ...{ value }, ...this.root.value };
    } else {
      for (let node of this.preOrderTraversal()) {
        if (node.key === parentNodeKey) {
          if (!node.value[type]) {
            node.value[type] = [value];
          } else {
            node.value[type] = [...[value], ...node.value[type]];
          }
          node.children.push(new TreeNode(key, {}, node));

          console.log('------ .. -- node');
          console.log(node);
          console.log(node.value);

          return true;
        }
      }
    }
    return false;
  }

  remove(key: string) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c: any) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key: string) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}
