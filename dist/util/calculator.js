"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreCalculator = void 0;
class ScoreCalculator {
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
    static evaluate(op, first, second) {
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
     *    childrenOp: '/',
     *    children: [{
     *      label: 'Weight',
     *      value: 2,
     *      weight: 1,
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
    static calculate(breakdown) {
        return breakdown.reduce((result, item, index) => {
            // Gets the subtotal, being the value * weight
            const subTotal = item.value * item.weight || 0;
            // If item has children, then do the operation inside the children, multiply by its weight and then concatenates
            if (item.children) {
                // Do calculation inside the children recursively
                const childrenValue = this.calculate(item.children);
                // console.log("children of", item.label, "value", childrenValue);
                // The operator in the first children indicates the operation type
                // for the parent versus children
                const { childrenOp: op = "+" } = item;
                // Gets the result from the operation `parent <op> children`
                // Then multiplies by parent weight
                result = this.evaluate(item.op || "+", result, this.evaluate(op, subTotal, childrenValue));
            }
            else if (item.op && index > 0) {
                // If item has operator, gets the result
                result = this.evaluate(item.op, result, subTotal);
                // Else only adds the subtotal
            }
            else
                result += subTotal;
            return result;
        }, 0);
    }
    /**
     * Creates a stringified model of the calculation
     *
     * #### Example
     * ```ts
     * const calc = new ScoreCalculator();
     * const breakdown = <ScoreBreakdownCalc>[
     *  {
     *    label: 'Age',
     *    value: 30,
     *    weight: 2,
     *    childrenOp: '/',
     *    children: [{
     *      label: 'Weight',
     *      value: 2,
     *      weight: 1,
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
     * calc.breakdownToString(breakdown);
     * // ((30 * 2) / (2*1)) + (30 * 0.5)
     * ```
     */
    static breakdownToString(breakdown, withLabels = false) {
        const getSubtotalStr = (item) => {
            return withLabels &&
                typeof item.value === "undefined" &&
                typeof item.weight === "undefined"
                ? `${item.label}: `
                : withLabels && typeof item.value !== "undefined"
                    ? `(${item.label}: ${item.value} ${typeof item.weight !== "undefined" ? `* ${item.weight}` : ""})`
                    : `${item.value
                        ? `(${item.value} ${item.weight ? `* ${item.weight}` : ""})`
                        : `(${item.value} * ${item.weight})`}`;
        };
        return breakdown.reduce((result, item, index) => {
            // Gets the subtotal, being the value * weight
            const subTotal = getSubtotalStr(item);
            // If item has children, then do the operation inside the children, multiply by its weight and then concatenates
            if (item.children) {
                // Do calculation inside the children recursively
                const childrenValue = this.breakdownToString(item.children, withLabels);
                // The operator in the first children indicates the operation type
                // for the parent versus children
                const { childrenOp: op } = item;
                // Gets the result from the operation `parent <op> children`
                // Then multiplies by parent weight
                result += `\n${item.op || ""} (${subTotal} ${op || ""} (${childrenValue}))\n`; //this.evaluate(op, subTotal, childrenValue);
            }
            else if (item.op && index > 0) {
                // If item has operator, gets the result
                result += ` ${item.op} ${getSubtotalStr(item)}`; //this.evaluate(item.op, result, subTotal);
                // Else only adds the subtotal
            }
            else
                result += `${subTotal}`;
            // remove extra spaces
            return result.replace(/(\()\s+|\s+(\))|(\n)\s|(\s)\s+/gim, "$1$2$3$4");
        }, "");
    }
}
exports.ScoreCalculator = ScoreCalculator;
