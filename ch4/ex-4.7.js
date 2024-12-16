import {
  first_statement,
  is_empty_sequence,
  is_tagged_list,
} from "./sec-4.1.2.js";
import { tail, head } from "../lib.js";
import { make_application } from "./sec-4.1.2.js";
import { is_return_value, is_truthy } from "./sec-4.1.3.js";
import { eval_sequence, evaluate } from "./sec-4.1.1.js";

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

// e
function eval_while(component, env) {
  function iter() {
    if (is_truthy(evaluate(while_predicate(component), env))) {
      const while_block_value = evaluate(while_block(component), env);
      if (!is_return_value(while_block_value)) {
        iter();
      }
    }
  }
  iter();
}

// f, g
function is_break_statement(component) {
  return is_tagged_list(component, "break");
}

function is_continue_statement(component) {
  return is_tagged_list(component, "continue");
}

function make_break() {
  return list("break");
}

function is_break(result) {
  return head(result) === "break";
}

export function eval_sequence(stmts, env) {
  if (is_empty_sequence(stmts)) {
    return undefined;
  } else if (is_break_statement(first_statement(stmts))) {
    return make_break();
  } else if (is_continue_statement(first_statement(stmts))) {
    return;
  } else if (is_last_statement(stmts)) {
    return evaluate(first_statement(stmts), env);
  } else {
    const first_stmt_value = evaluate(first_statement(stmts), env);
    if (is_return_value(first_stmt_value)) {
      return first_stmt_value;
    } else {
      return eval_sequence(rest_statements(stmts), env);
    }
  }
}

function eval_while(component, env) {
  function iter() {
    if (is_truthy(evaluate(while_predicate(component), env))) {
      const result = evaluate(while_block(component), env);
      if (!is_return_value(result) && !is_break(result)) {
        iter();
      }
    }
  }
  iter();
}

/**
 * eval_sequence를 확장해야할지, eval_while에서 전부 다 처리할지 고민했다.
 * eval_while에서 전부 다 처리하면 break나 continue 등의 키워드는 평가기의 반환 결과가 될 수 없고 다른 구문형이 이를 신경 쓸 필요가 없다.
 * 하지만 eval_block, eval_sequence 코드의 중복이 일어나게되고, 재귀적으로 구문형에 따라 평가하는 평가기의 설계 방식과 어긋난다고 생각하여 eval_sequence를 확장하였다.
 * break, continue 키워드가 while block 내부에서 사용된다는 규칙은 parser에서 처리하는 방향이 좋을 듯 하다.
 */
