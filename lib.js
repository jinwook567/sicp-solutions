export function pair(a, b) {
  function dispatch(type) {
    return type === 0 ? a : type === 1 ? b : "pair";
  }
  return dispatch;
}

export function is_pair(pair) {
  return typeof pair === "function" && pair(2) === "pair";
}

export function head(pair) {
  return pair(0);
}

export function tail(pair) {
  return pair(1);
}

export function is_null(list) {
  return list === null;
}

export function map(f, items) {
  return is_null(items) ? null : pair(f(head(items)), map(f, tail(items)));
}

export function accumulate(op, initial, items) {
  return is_null(items)
    ? initial
    : accumulate(op, op(initial, head(items)), tail(items));
}

export function append(list1, list2) {
  return is_null(list1) ? list2 : pair(head(list1), append(tail(list1), list2));
}

export function list(...args) {
  const [first, ...rest] = args;
  return args.length === 0 ? null : pair(first, list(...rest));
}

export function every(predicate, items) {
  return is_null(items)
    ? true
    : predicate(head(items))
    ? every(predicate, tail(items))
    : false;
}

export function error(...args) {
  throw new Error(JSON.stringify(args));
}

export function list_ref(list, n) {
  return n === 0 ? head(list) : list_ref(tail(list), n - 1);
}

export function length(list) {
  return is_null(list) ? 0 : 1 + length(tail(list));
}

export function set_head(list, value) {
  list = pair(value, tail(list));
  return list;
}

export function set_tail(list, value) {
  list = pair(head(list), value);
  return list;
}

export function display(tree) {
  function stringify(tree) {
    return is_null(tree)
      ? "null"
      : is_pair(tree)
      ? `(${stringify(head(tree))}, ${stringify(tail(tree))})`
      : `${tree}`;
  }
  console.log(stringify(tree));
}
