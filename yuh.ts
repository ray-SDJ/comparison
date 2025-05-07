//here is how we import the required modules
// const readline = require('readline');
//or
// from readline import createInterface
// import { createInterface } from 'readline';
import { createRequire } from "module";

class Calculator {
  private result: number = 0;

  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number | string {
    if (b === 0) {
      return "Error: Cannot divide by zero";
    }
    return a / b;
  }
}

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
