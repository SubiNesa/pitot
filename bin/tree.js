"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
// https://www.30secondsofcode.org/articles/s/js-data-structures-tree/#:~:text=A%20tree%20is%20a%20data,any%20children%20are%20the%20leaves.
var TreeNode = /** @class */ (function () {
    function TreeNode(key, value, parent) {
        if (value === void 0) { value = {}; }
        if (parent === void 0) { parent = null; }
        this.key = key;
        this.value = value;
        this.parent = parent;
        this.children = [];
    }
    Object.defineProperty(TreeNode.prototype, "isLeaf", {
        get: function () {
            return this.children.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeNode.prototype, "hasChildren", {
        get: function () {
            return !this.isLeaf;
        },
        enumerable: false,
        configurable: true
    });
    return TreeNode;
}());
var Tree = /** @class */ (function () {
    function Tree(key, value) {
        if (value === void 0) { value = {}; }
        this.root = new TreeNode(key, value);
    }
    Tree.prototype.preOrderTraversal = function (node) {
        var _i, _a, child;
        if (node === void 0) { node = this.root; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, node];
                case 1:
                    _b.sent();
                    if (!node.children.length) return [3 /*break*/, 5];
                    _i = 0, _a = node.children;
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    child = _a[_i];
                    return [5 /*yield**/, __values(this.preOrderTraversal(child))];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    };
    Tree.prototype.postOrderTraversal = function (node) {
        var _i, _a, child;
        if (node === void 0) { node = this.root; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!node.children.length) return [3 /*break*/, 4];
                    _i = 0, _a = node.children;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    child = _a[_i];
                    return [5 /*yield**/, __values(this.postOrderTraversal(child))];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [4 /*yield*/, node];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    };
    Tree.prototype.insert = function (type, parentNodeKey, key, value) {
        if (value === void 0) { value = {}; }
        if (key === this.root.key) {
            this.root.value = __assign({ value: value }, this.root.value);
        }
        else {
            for (var _i = 0, _a = this.preOrderTraversal(); _i < _a.length; _i++) {
                var node = _a[_i];
                if (node.key === parentNodeKey) {
                    if (!node.value[type]) {
                        node.value[type] = [value];
                    }
                    else {
                        node.value[type] = __spreadArray(__spreadArray([], [value], false), node.value[type], true);
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
    };
    Tree.prototype.remove = function (key) {
        for (var _i = 0, _a = this.preOrderTraversal(); _i < _a.length; _i++) {
            var node = _a[_i];
            var filtered = node.children.filter(function (c) { return c.key !== key; });
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    };
    Tree.prototype.find = function (key) {
        for (var _i = 0, _a = this.preOrderTraversal(); _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.key === key)
                return node;
        }
        return undefined;
    };
    return Tree;
}());
exports.Tree = Tree;
