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

// d
/**
 * while_loop는 원시함수로 평가된다.
 * job 함수 본문의 평가가 반환문으로 종료되었는지, 끝까지 마쳤는지 알 수가 없다. while_loop의 job 함수를 평가기를 활용해서 평가하는 방식밖에 없다.
 * 근데 위 방식은 파생된 구성요소라고 볼 수 없다.
 */
