import { list } from "../lib";
import { is_tagged_list } from "./sec-4.1.2";

// a
let isEven = (number) => number === 0 || isOdd(number - 1);
let isOdd = (number) => number > 0 && isEven(number - 1);
// isOdd를 let*로 변경하면 동작하지 않는다.

//b
function make_star_let_declaration(name, value_expression) {
  return list("start_let_declaration", name, value_expression);
}

function is_start_let_declaration(component) {
  return is_tagged_list(component, "start_let_declaration");
}

// d
/* 
새로운 구문형이 아닌 eval_sequence를 확장해야한다.
*/
