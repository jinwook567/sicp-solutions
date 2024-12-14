import { list } from "../lib";
import { is_tagged_list } from "./sec-4.1.2";
import { first_statement } from "./sec-4.1.2";

// a
let isEven = (number) => number === 0 || isOdd(number - 1);
let isOdd = (number) => number > 0 && isEven(number - 1);
/*
isOdd의 let을 let*으로 변경하면 작동하지 않는다.
isEven은 하위 스코프인 isOdd를 참조할 수 없게 된다.
 */

// b
function make_star_let_declaration(name, value_expression) {
  return list("start_let_declaration", name, value_expression);
}

function is_star_let_declaration(component) {
  return is_tagged_list(component, "start_let_declaration");
}
/*
name, value_expression 관련 접근자는 declaration_symbol, declaration_value_expression을 사용하면 된다.
*/

// c
function first_clause(source) {}

function rest_clauses(source) {}

function make_source(clauses) {}

function is_star_let(clause) {}

function make_variable_component(clause) {}

function parse(source) {}

function let_star_to_nested_let(source) {
  return is_null(first_clause(source))
    ? null
    : is_star_let(first_clause(source))
    ? list(
        "sequence",
        pair(
          make_variable_component(first_clause(source)),
          list(
            "block",
            let_star_to_nested_let(make_source(rest_clauses(source)))
          )
        )
      )
    : list(
        "sequence",
        pair(
          first_statement(parse(first_clause(source))),
          let_star_to_nested_let(make_source(rest_clauses(source)))
        )
      );
}
/*
parse 함수를 구현하지 않아, 수도 코드로 작성하였다.
*/

// d
/* 
평가기는 코드를 환경을 받아서 재귀적으로 평가한다.
새로운 구문형으로 let*을 평가할 때, 다음 stmts에 대한 context가 제공되지 않는다.
평가기에 변화를 주는 방식으로 구현하려면, 새로운 구문형이 아닌 eval_sequence를 확장하는 수밖에 없다.
let*은 평가기의 새로운 구문형이라기 보다는, 단순히 문법적 설탕일 뿐이다. parse의 책임으로 하는 것이 더 적절해보인다.
*/
