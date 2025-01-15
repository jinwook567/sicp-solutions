import { head, tail, every, error } from "../lib";
import {
  lamda_parameter_symbols,
  lamda_body,
  is_lamda_expression,
} from "./sec-4.1.2";
import { scan_out_declarations } from "./sec-4.1.1";

// a
function are_parameters_unique(parameters) {
  return (
    every((parameter) => parameter !== head(parameters), tail(parameters)) &&
    are_parameters_unique(parameters)
  );
}

function make_function(parameters, body, env) {
  return are_declarations_unique(parameters)
    ? list("compound_function", parameters, body, env)
    : error("parameters should be unique");
}

function verify(components) {
  return every(
    (component) =>
      is_lamda_expression(component)
        ? are_parameters_unique(lamda_parameter_symbols(component))
        : true,
    components
  );
}

/*
verify 함수를 사용하는 편이 더 좋아보인다. 
1. 관심사 분리가 가능하다. 평가기는 평가의 역할만 수행한다.
2. 런타임이 아닌, 컴파일 타임에 오류를 색출할 수 있다.
3. 성능상 이점이 있다. 매번 컴포넌트에 오류가 있는지 없는지 판별할 필요가 없다.
*/

// b
function verify_lamda_expression(component) {
  return are_parameters_unique(
    append(
      lamda_parameter_symbols(component),
      scan_out_declarations(lamda_body(component))
    )
  );
}

function verify(components) {
  return every(
    (component) =>
      is_lamda_expression(component)
        ? verify_lamda_expression(component)
        : true,
    components
  );
}
