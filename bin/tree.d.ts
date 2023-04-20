export declare class Tree {
    root: any;
    constructor(key: string, value?: {});
    preOrderTraversal(node?: any): any;
    postOrderTraversal(node?: any): any;
    insert(type: string, parentNodeKey: any, key: string, value?: {}): boolean;
    remove(key: string): boolean;
    find(key: string): any;
}
