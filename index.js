const CREATE = 'CREATE';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
const UPDATE = 'UPDATE';
const SET_PROP = 'SET_PROP';
const REMOVE_PROP = 'REMOVE_PROP';

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}

function changed(node1, node2) {
  return (
    typeof node1 !== typeof node2 ||
    node1.type !== node2.type ||
    (typeof node1 !== 'string' && node1 !== node2)
  );
}

function diffProps(oldProps, newProps) {
  const patches = [];
  const props = Object.assign({}, oldProps, newProps);
  Object.keys(props).forEach(key => {
    const oldValue = oldProps[key];
    const newValue = newProps[key];

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

function diffChildren(oldChildren, newChildren) {
  const patches = [];
  const patchesLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < patchesLength; i++) {
    patches[i] = diff(oldChildren, newChildren);
  }
  return patches;
}

function diff(oldNode, newNode) {
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

function createElement(node) {
  if (isString(node)) {
    return document.createTextNode(node + '');
  }
  const el = document.createElement(node.type);
  setProps(el, node.props || {});
  node.children &&
    node.children.map(createElement).forEach(el.appendChild.bind(el));

  return el;
}

function setProp(target, name, value) {
  if (name.toLowerCase() === 'classname') {
    name = 'class';
  }
  target.setAttribute(name, value);
}

function setProps(target, props) {
  Object.keys(props).forEach(name => {
    setProp(target, name, props[name]);
  });
}

function removeProp(target, name, value) {
  if (name.toLowerCase() === 'classname') {
    name = 'class';
  }
  target.removeAttribute(name);
}

function patchProps(parent, patches) {
  patches.forEach(patch => {
    const {type, name, value} = patch
    if (type === SET_PROP) {
      setProp(parent, name, value)
    }
    if (type === REMOVE_PROP) {
      removeProp(parent, name, value)
    }
  });
}

function patch(parent, patches, index = 0) {
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

function flatten(arr) {
  return [].concat.apply([], arr);
}

function h(type, props, ...children) {
  props = props || {};
  return { type, props, children: flatten(children) };
}

function view(count) {
  const r = [...Array(count).keys()];
  return (
    <ul id="cool" className={`my-class-${count}`}>
      {r.map(n => (
        <li>item {(count * n).toString()}</li>
      ))}
    </ul>
  );
}

function tick(el, count) {
  const patches = diff(view(count + 1), view(count));
  patch(el, patches);
  if (count > 20) {
    return;
  }
  setTimeout(() => tick(el, count + 1), 500);
}

function render(el) {
  el.appendChild(createElement(view(0)));
  setTimeout(() => tick(el, 0), 500);
}
