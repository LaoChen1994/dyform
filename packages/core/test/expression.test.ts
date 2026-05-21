import { describe, it, expect } from 'vitest';
import { evaluateExpression, tokenize } from '../src/expression';

describe('Safe Expression AST Evaluator', () => {
  const context = {
    values: {
      age: 20,
      role: 'admin',
      isSuspended: false,
      profile: {
        active: true,
        points: 95,
      },
      contacts: [
        { name: 'Alice', active: true },
        { name: 'Bob', active: false },
      ],
      emptyValue: null,
    },
  };

  it('correctly tokenizes valid strings', () => {
    const tokens = tokenize('$values.age >= 18 && $values.role === \'admin\'');
    expect(tokens.map(t => t.type)).toEqual([
      'VARIABLE', 'OPERATOR', 'NUMBER', 'OPERATOR', 'VARIABLE', 'OPERATOR', 'STRING', 'EOF'
    ]);
  });

  it('evaluates basic comparison rules', () => {
    expect(evaluateExpression('$values.age > 18', context)).toBe(true);
    expect(evaluateExpression('$values.age < 18', context)).toBe(false);
    expect(evaluateExpression('$values.age >= 20', context)).toBe(true);
    expect(evaluateExpression('$values.age <= 20', context)).toBe(true);
    expect(evaluateExpression('$values.role === "admin"', context)).toBe(true);
    expect(evaluateExpression('$values.role !== "admin"', context)).toBe(false);
  });

  it('evaluates nested properties', () => {
    expect(evaluateExpression('$values.profile.active === true', context)).toBe(true);
    expect(evaluateExpression('$values.profile.points > 90', context)).toBe(true);
    expect(evaluateExpression('$values.contacts[0].name === "Alice"', context)).toBe(true);
    expect(evaluateExpression('$values.contacts[1].active === false', context)).toBe(true);
  });

  it('evaluates unary negate and values correctly', () => {
    expect(evaluateExpression('!$values.isSuspended', context)).toBe(true);
    expect(evaluateExpression('!$values.profile.active', context)).toBe(false);
  });

  it('evaluates logical operations with proper priority', () => {
    // && has higher precedence than ||
    // false || true && false -> false || (true && false) -> false
    expect(evaluateExpression('$values.age < 10 || $values.role === "admin" && $values.profile.points < 50', context)).toBe(false);
    // (false || true) && false -> true && false -> false
    expect(evaluateExpression('($values.age < 10 || $values.role === "admin") && $values.profile.points < 50', context)).toBe(false);
    // true || true && false -> true || false -> true
    expect(evaluateExpression('$values.age > 10 || $values.role === "admin" && $values.profile.points < 50', context)).toBe(true);
  });

  it('handles parentheses and grouping', () => {
    expect(evaluateExpression('($values.age > 18 && $values.role === "admin") || $values.isSuspended', context)).toBe(true);
    expect(evaluateExpression('!($values.age < 18 || $values.isSuspended)', context)).toBe(true);
  });

  it('handles null, undefined and boolean literal values', () => {
    expect(evaluateExpression('$values.emptyValue === null', context)).toBe(true);
    expect(evaluateExpression('$values.nonExistent === undefined', context)).toBe(true);
    expect(evaluateExpression('$values.profile.active === true', context)).toBe(true);
  });

  it('handles syntax errors gracefully', () => {
    // Missing parenthesis
    expect(evaluateExpression('($values.age > 18', context)).toBe(false);
    // Unexpected character
    expect(evaluateExpression('$values.age @ 18', context)).toBe(false);
    // Empty expression
    expect(evaluateExpression('', context)).toBe(false);
  });
});
