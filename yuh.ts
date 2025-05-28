//here is how we import the required modules
// const readline = require('readline');
//or
// from readline import createInterface
// import { createInterface } from 'readline';
import { createRequire } from "module";

// Interface definition
interface MathOperations {
  performOperation(a: number, b: number): number;
  getOperationName(): string;
}

// Abstract base class
abstract class AbstractCalculator {
  // Protected member
  protected readonly calculatorType: string;

  constructor(type: string) {
    this.calculatorType = type;
  }

  // Abstract method
  abstract getResult(): number;
}

// Main Calculator class implementing inheritance and interface
class Calculator extends AbstractCalculator implements MathOperations {
  // Private members with TypeScript access modifiers
  #result: number;
  #operationsPerformed: number;
  #operationName: string;

  constructor() {
    super("Basic Calculator");
    this.#result = 0;
    this.#operationsPerformed = 0;
    this.#operationName = "";
  }

  // Implementation of abstract method
  getResult(): number {
    return this.#result;
  }

  // Implementation of interface methods
  performOperation(a: number, b: number): number {
    return this.add(a, b);
  }

  getOperationName(): string {
    return this.#operationName;
  }

  // Getter property
  get operationsPerformed(): number {
    return this.#operationsPerformed;
  }

  // Instance methods with type annotations
  add(a: number, b: number): number {
    this.#result = a + b;
    this.#operationsPerformed++;
    this.#operationName = "Addition";
    return this.#result;
  }

  subtract(a: number, b: number): number {
    this.#result = a - b;
    this.#operationsPerformed++;
    this.#operationName = "Subtraction";
    return this.#result;
  }

  multiply(a: number, b: number): number {
    this.#result = a * b;
    this.#operationsPerformed++;
    this.#operationName = "Multiplication";
    return this.#result;
  }

  divide(a: number, b: number): number | string {
    this.#operationsPerformed++;
    this.#operationName = "Division";
    if (b === 0) {
      return "Error: Cannot divide by zero";
    }
    this.#result = a / b;
    return this.#result;
  }
}

/**
 * TypeScript OOP Concepts Demonstrated:
 *
 * 1. Interfaces
 *    - Strict contract definition
 *    - Type checking at compile time
 *    - Method signatures
 *
 * 2. Classes
 *    - Strong typing
 *    - Access modifiers
 *    - Abstract classes
 *
 * 3. Encapsulation
 *    - Private fields (#)
 *    - Protected members
 *    - Getter properties
 *
 * 4. Inheritance
 *    - extends keyword
 *    - implements for interfaces
 *    - Abstract class implementation
 *
 * 5. Type System
 *    - Static type checking
 *    - Union types (number | string)
 *    - Return type annotations
 *
 * 6. Access Modifiers
 *    - private (#)
 *    - protected
 *    - public (default)
 *    - readonly
 *
 * 7. ECMAScript Private Fields
 *    - True private fields with #
 *    - TypeScript enforcement
 */

function printMenu(): void {
  console.log("\nCalculator Menu:");
  console.log("1. Add");
  console.log("2. Subtract");
  console.log("3. Multiply");
  console.log("4. Divide");
  console.log("5. Exit");
}

async function main(): Promise<void> {
  const calc = new Calculator();
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
      readline.question(query, resolve);
    });
  };

  while (true) {
    printMenu();
    const choice = await question("Enter your choice (1-5): ");

    if (choice === "5") {
      console.log("Goodbye!");
      readline.close();
      break;
    }

    const num1 = parseFloat(await question("Enter first number: "));
    const num2 = parseFloat(await question("Enter second number: "));

    switch (choice) {
      case "1":
        console.log(`Result: ${calc.add(num1, num2)}`);
        break;
      case "2":
        console.log(`Result: ${calc.subtract(num1, num2)}`);
        break;
      case "3":
        console.log(`Result: ${calc.multiply(num1, num2)}`);
        break;
      case "4":
        console.log(`Result: ${calc.divide(num1, num2)}`);
        break;
      default:
        console.log("Invalid choice!");
    }
  }
}

main().catch(console.error);

// Example usage
const calculator = new Calculator();
console.log(calculator.add(5, 3)); // 8
console.log(calculator.operationsPerformed); // 1
// console.log(calculator.#result);       // Error: Private field
