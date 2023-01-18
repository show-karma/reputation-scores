import { Operator, ScoreBreakdownCalc } from "../score/interfaces";
export declare class ScoreCalculator {
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
    static evaluate(op: Operator, first: number, second: number): number;
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
    static calculate(breakdown: ScoreBreakdownCalc): number;
}
