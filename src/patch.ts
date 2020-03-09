import {
  CREATE,
  REMOVE,
  REPLACE,
  UPDATE,
  SET_PROP,
  REMOVE_PROP,
  isString
} from './utils';

import { Node, AnyObject, AnyArray } from './index';

function createElement(node: Node | any) {
  if (isString(node)) {
    return document.createTextNode(node + '');
  }
  const el = document.createElement(node.type);
  setProps(el, node.props || {});
  node.children &&
    node.children.map(createElement).forEach(el.appendChild.bind(el));

  return el;
}

function setProp(target, name: string, value: AnyObject): void {
  if (name.toLowerCase() === 'classname') {
    name = 'class';
  }
  target.setAttribute(name, value);
}

function setProps(target, props: AnyObject) {
  Object.keys(props).forEach(name => {
    setProp(target, name, props[name]);
  });
}

function removeProp(target, name: string, value: AnyObject): void {
  if (name.toLowerCase() === 'classname') {
    name = 'class';
  }
  target.removeAttribute(name);
}

function patchProps(parent, patches: AnyArray): void {
  patches.forEach((patch: AnyObject) => {
    const {type, name, value} = patch;
    if (type === SET_PROP) {
      setProp(parent, name, value)
    }
    if (type === REMOVE_PROP) {
      removeProp(parent, name, value)
    }
  });
}

function patch(parent, patches: AnyObject, index: number = 0) {
  if (!patches) {
    return;
  }
  const el = parent.children[index];

  switch (patches.type) {
    case CREATE: {
      const { newNode } = patches;
      const newEl = document.createElement(newNode);
      return parent.appendChild(newEl);
    }
    case REMOVE: {
      return parent.removeChild(el);
    }
    case REPLACE: {
      const { newNode } = patches;
      const newEl = createElement(newNode);
      return parent.replaceChild(newEl, el);
    }
    case UPDATE: {
      const { props, children } = patches;
      patchProps(el, props);
      children.forEach((child, idx) => {
        patch(el, child, idx);
      });
    }
  }
}

export { createElement, setProp, setProps, removeProp, patchProps, patch };
