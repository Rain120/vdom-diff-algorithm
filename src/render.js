import { diff } from './diff';
import { createElement, patch } from './patch';

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

export { render };
