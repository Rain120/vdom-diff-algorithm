const CREATE = 'CREATE';
const REMOVE = 'REMOVE';
const REPLACE = 'REPLACE';
const UPDATE = 'UPDATE';
const SET_PROP = 'SET_PROP';
const REMOVE_PROP = 'REMOVE_PROP';

function isString(str: string): boolean {
  return Object.prototype.toString.call(str) === '[object String]';
}

export { CREATE, REMOVE, REPLACE, UPDATE, SET_PROP, REMOVE_PROP, isString };
