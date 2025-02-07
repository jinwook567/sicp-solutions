import { map, accumulate, append, list, error } from "../lib.js";
import {
  is_function_declaration,
  is_declaration,
  declaration_symbol,
} from "./sec-4.1.2.js";
import { is_sequence, block_body } from "./sec-4.1.3.js";
import { declaration_symbol } from "./sec-4.1.2.js";

// a
export function scan_out_declarations(component) {
  return is_sequence(component)
    ? accumulate(
        append,
        null,
        map(scan_out_declarations, sequence_statements(component))
      )
    : is_declaration(component)
    ? list(component)
    : null;
}

function eval_block(component, env) {
  const body = block_body(component);
  const locals = scan_out_declarations(body);
  const symbols = map(declaration_symbol, locals);
  const unassigneds = map(
    (component) =>
      is_function_declaration(component) ? component : "unassigned",
    locals
  );
  return evaluate(body, extend_environment(symbols, unassigneds, env));
}
