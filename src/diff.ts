import {
  CREATE,
  REMOVE,
  REPLACE,
  UPDATE,
  SET_PROP,
  REMOVE_PROP
} from './utils';

import { Node, AnyObject, AnyArray } from './index';

function changed(node1: Node | any, node2: Node | any): boolean {
  return (
    typeof node1 !== typeof node2 ||
    node1.type !== node2.type ||
    (typeof node1 !== 'string' && node1 !== node2)
  );
}

function diffProps(oldProps: AnyObject, newProps: AnyObject): AnyArray {
  const patches: AnyArray = [];
  const props: AnyObject = Object.assign({}, oldProps, newProps);
  Object.keys(props).forEach(key => {
    const oldValue: any = oldProps[key];
    const newValue: any = newProps[key];

    if (!newValue) {
      patches.push({
        type: REMOVE_PROP,
        name,
        value: oldValue
      });
    } else if (!oldValue || oldValue !== newValue) {
      patches.push({
        type: SET_PROP,
        name,
        value: newValue
      });
    }
  });
  return patches;
}

function diffChildren(oldChildren: AnyArray, newChildren: AnyArray): AnyArray {
  const patches: AnyArray = [];
  const patchesLength: number = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < patchesLength; i++) {
    patches[i] = diff(oldChildren, newChildren);
  }
  return patches;
}

function diff(oldNode: Node | any, newNode: Node | any): AnyObject {
  if (!oldNode) {
    return { type: CREATE, newNode };
  }

  if (!newNode) {
    return { type: REMOVE };
  }

  if (changed(oldNode, newNode)) {
    return { type: REPLACE, newNode };
  }

  if (oldNode.type !== newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(oldNode.props, newNode.props),
      children: diffChildren(oldNode.children, newNode.children)
    };
  }
}

export { changed, diffProps, diffChildren, diff };
