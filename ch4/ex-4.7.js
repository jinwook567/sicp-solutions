import { is_tagged_list } from "./sec-4.1.2.js";
import { tail, head } from "../lib.js";
import { make_application } from "./sec-4.1.2.js";
import { is_truthy } from "./sec-4.1.3.js";

// a
function is_while_loop(component) {
  return is_tagged_list(component, "while_loop");
}

function while_predicate(component) {
  return head(tail(component));
}

function while_block(component) {
  return head(tail(tail(component)));
}

// b
function while_loop(predicate, job) {
  function iter() {
    if (is_truthy(predicate())) {
      job();
      iter();
    }
  }
  iter();
}

// c
function while_to_application(component) {
  const predicate = while_predicate(component);
  const block = while_block(component);
  return make_application(
    list("primitive", while_loop),
    list(predicate, block)
  );
}
