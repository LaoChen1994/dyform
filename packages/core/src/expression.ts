/**
 * Safe AST Expression Parser & Evaluator
 * Fully parses and evaluates expressions like:
 *   "$values.age > 18 && !$values.isSuspended"
 *
 * It prevents dynamic execution vulnerabilities by avoiding eval() or new Function().
 */

import { get } from './utils';

export type TokenType =
  | 'VARIABLE'
  | 'NUMBER'
  | 'STRING'
  | 'BOOLEAN'
  | 'NULL'
  | 'UNDEFINED'
  | 'OPERATOR'
  | 'LPAREN'
  | 'RPAREN'
  | 'EOF';

export interface Token {
  type: TokenType;
  value: string;
}

/**
 * Tokenize an expression string into a stream of tokens
 */
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = expr.length;

  while (i < len) {
    const char = expr[i];

    // 1. Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // 2. Parentheses
    if (char === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (char === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    // 3. String literals (single or double quoted)
    if (char === "'" || char === '"') {
      const quote = char;
      let val = '';
      i++; // Skip opening quote
      while (i < len && expr[i] !== quote) {
        // Simple escape support if needed
        if (expr[i] === '\\' && i + 1 < len) {
          val += expr[i + 1];
          i += 2;
        } else {
          val += expr[i];
          i++;
        }
      }
      if (i >= len) {
        throw new Error('Unterminated string literal in expression');
      }
      i++; // Skip closing quote
      tokens.push({ type: 'STRING', value: val });
      continue;
    }

    // 4. Variables starting with $values
    if (expr.substring(i, i + 7) === '$values') {
      // Find the boundary of the variable path
      // e.g. $values.profile.age, $values.contacts[0].name
      let start = i;
      i += 7; // skip '$values'
      while (i < len && /[a-zA-Z0-9_.[\]]/.test(expr[i])) {
        i++;
      }
      const valPath = expr.substring(start, i);
      tokens.push({ type: 'VARIABLE', value: valPath });
      continue;
    }

    // 5. Operators: ===, !==, >=, <=, ==, !=, >, <, &&, ||, !
    if (expr.substring(i, i + 3) === '===' || expr.substring(i, i + 3) === '!==') {
      tokens.push({ type: 'OPERATOR', value: expr.substring(i, i + 3) });
      i += 3;
      continue;
    }
    if (
      expr.substring(i, i + 2) === '>=' ||
      expr.substring(i, i + 2) === '<=' ||
      expr.substring(i, i + 2) === '==' ||
      expr.substring(i, i + 2) === '!=' ||
      expr.substring(i, i + 2) === '&&' ||
      expr.substring(i, i + 2) === '||'
    ) {
      tokens.push({ type: 'OPERATOR', value: expr.substring(i, i + 2) });
      i += 2;
      continue;
    }
    if (char === '>' || char === '<' || char === '!') {
      tokens.push({ type: 'OPERATOR', value: char });
      i++;
      continue;
    }

    // 6. Numbers (integers and decimals)
    if (/[0-9]/.test(char)) {
      let val = '';
      while (i < len && /[0-9.]/.test(expr[i])) {
        val += expr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: val });
      continue;
    }

    // 7. Keywords (true, false, null, undefined)
    if (/[a-zA-Z]/.test(char)) {
      let val = '';
      while (i < len && /[a-zA-Z]/.test(expr[i])) {
        val += expr[i];
        i++;
      }
      if (val === 'true' || val === 'false') {
        tokens.push({ type: 'BOOLEAN', value: val });
      } else if (val === 'null') {
        tokens.push({ type: 'NULL', value: val });
      } else if (val === 'undefined') {
        tokens.push({ type: 'UNDEFINED', value: val });
      } else {
        throw new Error(`Unexpected identifier in expression: ${val}`);
      }
      continue;
    }

    throw new Error(`Unexpected character in expression: ${char}`);
  }

  tokens.push({ type: 'EOF', value: '' });
  return tokens;
}

// --- AST Node Definitions ---
export type ASTNode =
  | { type: 'Literal'; value: unknown }
  | { type: 'Identifier'; path: string }
  | { type: 'UnaryExpression'; operator: '!'; argument: ASTNode }
  | { type: 'BinaryExpression'; operator: string; left: ASTNode; right: ASTNode };

/**
 * Recursive Descent Parser
 */
export class Parser {
  private tokens: Token[];
  private current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF';
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  /**
   * Entry Point: expression -> logicalOr
   */
  public parse(): ASTNode {
    return this.logicalOr();
  }

  /**
   * logicalOr -> logicalAnd ( '||' logicalAnd )*
   */
  private logicalOr(): ASTNode {
    let expr = this.logicalAnd();

    while (this.peek().type === 'OPERATOR' && this.peek().value === '||') {
      const op = this.advance().value;
      const right = this.logicalAnd();
      expr = { type: 'BinaryExpression', operator: op, left: expr, right };
    }

    return expr;
  }

  /**
   * logicalAnd -> equality ( '&&' equality )*
   */
  private logicalAnd(): ASTNode {
    let expr = this.equality();

    while (this.peek().type === 'OPERATOR' && this.peek().value === '&&') {
      const op = this.advance().value;
      const right = this.equality();
      expr = { type: 'BinaryExpression', operator: op, left: expr, right };
    }

    return expr;
  }

  /**
   * equality -> comparison ( ( '===' | '!==' | '==' | '!=' ) comparison )*
   */
  private equality(): ASTNode {
    let expr = this.comparison();

    while (
      this.peek().type === 'OPERATOR' &&
      ['===', '!==', '==', '!='].includes(this.peek().value)
    ) {
      const op = this.advance().value;
      const right = this.comparison();
      expr = { type: 'BinaryExpression', operator: op, left: expr, right };
    }

    return expr;
  }

  /**
   * comparison -> unary ( ( '>' | '>=' | '<' | '<=' ) unary )*
   */
  private comparison(): ASTNode {
    let expr = this.unary();

    while (
      this.peek().type === 'OPERATOR' &&
      ['>', '>=', '<', '<='].includes(this.peek().value)
    ) {
      const op = this.advance().value;
      const right = this.unary();
      expr = { type: 'BinaryExpression', operator: op, left: expr, right };
    }

    return expr;
  }

  /**
   * unary -> ( '!' ) unary | primary
   */
  private unary(): ASTNode {
    if (this.peek().type === 'OPERATOR' && this.peek().value === '!') {
      const op = this.advance().value as '!';
      const right = this.unary();
      return { type: 'UnaryExpression', operator: op, argument: right };
    }

    return this.primary();
  }

  /**
   * primary -> NUMBER | STRING | BOOLEAN | NULL | UNDEFINED | VARIABLE | '(' expression ')'
   */
  private primary(): ASTNode {
    if (this.match('NUMBER')) {
      return { type: 'Literal', value: Number(this.previous().value) };
    }
    if (this.match('STRING')) {
      return { type: 'Literal', value: this.previous().value };
    }
    if (this.match('BOOLEAN')) {
      return { type: 'Literal', value: this.previous().value === 'true' };
    }
    if (this.match('NULL')) {
      return { type: 'Literal', value: null };
    }
    if (this.match('UNDEFINED')) {
      return { type: 'Literal', value: undefined };
    }
    if (this.match('VARIABLE')) {
      // E.g. "$values.age" or "$values.profile.name"
      // Strip leading "$values" if we want to resolve relative to "values"
      const path = this.previous().value;
      return { type: 'Identifier', path };
    }

    if (this.match('LPAREN')) {
      const expr = this.parse();
      this.consume('RPAREN', "Expect ')' after expression.");
      return expr;
    }

    throw new Error(`Expect expression, found: ${this.peek().value || 'EOF'}`);
  }
}

/**
 * Evaluates an AST Node inside the given variable context
 */
export function evaluateAST(node: ASTNode, context: { values: Record<string, unknown> }): any {
  switch (node.type) {
    case 'Literal':
      return node.value;

    case 'Identifier': {
      // Path begins with "$values" or "$values."
      if (node.path === '$values') return context.values;
      const cleanPath = node.path.substring(8); // Strip "$values." prefix (which is 8 characters)
      return get(context.values, cleanPath);
    }

    case 'UnaryExpression': {
      const argValue = evaluateAST(node.argument, context);
      if (node.operator === '!') {
        return !argValue;
      }
      throw new Error(`Unsupported unary operator: ${node.operator}`);
    }

    case 'BinaryExpression': {
      const leftVal = evaluateAST(node.left, context);

      // Short-circuit evaluation for logical operators
      if (node.operator === '&&') {
        return leftVal && evaluateAST(node.right, context);
      }
      if (node.operator === '||') {
        return leftVal || evaluateAST(node.right, context);
      }

      const rightVal = evaluateAST(node.right, context);

      switch (node.operator) {
        case '===':
          return leftVal === rightVal;
        case '!==':
          return leftVal !== rightVal;
        case '==':
          return leftVal == rightVal; // eslint-disable-line eqeqeq
        case '!=':
          return leftVal != rightVal; // eslint-disable-line eqeqeq
        case '>':
          return (leftVal as any) > (rightVal as any);
        case '>=':
          return (leftVal as any) >= (rightVal as any);
        case '<':
          return (leftVal as any) < (rightVal as any);
        case '<=':
          return (leftVal as any) <= (rightVal as any);
        default:
          throw new Error(`Unsupported binary operator: ${node.operator}`);
      }
    }

    default:
      throw new Error('Unsupported AST node');
  }
}

/**
 * Parse and evaluate an expression in a completely safe, sandbox environment.
 * E.g. evaluateExpression("$values.age > 18", { values: { age: 20 } }) -> true
 */
export function evaluateExpression(expr: string, context: { values: Record<string, unknown> }): boolean {
  if (!expr || typeof expr !== 'string') return false;
  
  // Normalize string: strip surrounding whitespace or $ prefix if it is purely e.g. "$$values.age..."
  const trimmed = expr.trim();
  if (trimmed === '') return false;

  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return !!evaluateAST(ast, context);
  } catch (err) {
    console.error(`Failed to parse/evaluate expression: "${expr}"`, err);
    return false;
  }
}
