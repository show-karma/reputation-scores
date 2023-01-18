import { Operator, ScoreBreakdownCalc } from "../score/interfaces";

export class ScoreCalculator {
  /**
   * Evaluates an operation with an operator symbol, the first and second
   * values then returns its result if valid.
   *
   * #### Example
   * ```ts
   * const calc = new ScoreCalculator();
   * calc.evaulate('+', 10, 22)
   * // 32
   * calc.evaluate('/', 10, 2)
   * // 5
   * ```
   *
   * @param op
   * @param first
   * @param second
   */
  static evaluate(op: Operator, first: number, second: number) {
    // Checks if there are any symbols that aren't permitted.
    if (!["+", "-", "/", "*"].includes(op))
      throw new Error(`Invalid character "${op}" at expression.`);

    const result = +eval(`${first}${op}${second}`);
    return result && !Number.isNaN(result) ? result : 0;
  }

  /**
   * Calculate the score based on the given definition
   *
   * Definition is given by
   *
   * `(parent <op> (result(...children)) <next.op> (...recursion)`
   *
   * #### Example
   * ```ts
   * const calc = new ScoreCalculator();
   * const breakdown = <ScoreBreakdownCalc>[
   *  {
   *    label: 'Age',
   *    value: 30,
   *    weight: 2,
   *    children: [{
   *      label: 'Weight',
   *      value: 2,
   *      weight: 1,
   *      op: '/',
   *    }]
   *  },
   *  {
   *    label: 'Goals done',
   *    value: 30,
   *    weight: 0.5,
   *    op: '+'
   *  }
   * ];
   *
   * calc.calculate(breakdown);
   * // ((30 * 2) / (2*1)) + (30 * 0.5) = 45
   * ```
   *
   * @param breakdown
   * @returns
   */
  static calculate(breakdown: ScoreBreakdownCalc) {
    return breakdown.reduce((result, item, index) => {
      // Gets the subtotal, being the value * weight
      const subTotal = item.value * item.weight;
      // If item has children, then do the operation inside the children, multiply by its weight and then concatenates
      if (item.children) {
        // Do calculation inside the children recursively
        const childrenValue = this.calculate(item.children);
        // The operator in the first children indicates the operation type
        // for the parent versus children
        const { op = "+" } = item.children[0];
        // Gets the result from the operation `parent <op> children`
        // Then multiplies by parent weight
        result += this.evaluate(op, subTotal, childrenValue);
      } else if (item.op && index > 0) {
        // If item has operator, gets the result
        result = this.evaluate(item.op, result, subTotal);
        // Else only adds the subtotal
      } else result += subTotal;
      return result;
    }, 0);
  }
}
