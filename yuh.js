// File Handling Tutorial in JavaScript (Node.js)
const fs = require("fs");

// Writing to a file
fs.writeFileSync("example.txt", "Hello, world!\n");

// Reading from a file
const content = fs.readFileSync("example.txt", "utf8");
console.log("File content:", content);

// Interface-like contract (JavaScript doesn't have true interfaces)
// We can use JSDoc to document expected methods
/**
 * @interface
 */
class MathOperations {
  performOperation(a, b) {
    throw new Error("Must implement performOperation");
  }
  getOperationName() {
    throw new Error("Must implement getOperationName");
  }
}

// Abstract base class - using ES6+ classes
class AbstractCalculator {
  // Protected members can be simulated using symbols or naming conventions
  // Prefix with _ to indicate "private" (by convention)
  constructor(type) {
    if (this.constructor === AbstractCalculator) {
      throw new Error("Abstract classes cannot be instantiated");
    }
    this._calculatorType = type;
  }

  // Abstract method
  getResult() {
    throw new Error("Method getResult() must be implemented");
  }
}

// Main Calculator class implementing inheritance
class Calculator extends AbstractCalculator {
  // Private fields (ES2022+)
  #result;
  #operationsPerformed;
  #operationName;

  constructor() {
    // Call parent constructor
    super("Basic Calculator");
    this.#result = 0;
    this.#operationsPerformed = 0;
  }

  // Implementing abstract method
  getResult() {
    return this.#result;
  }

  // Getter - part of encapsulation
  get operationsPerformed() {
    return this.#operationsPerformed;
  }

  // Instance methods
  add(a, b) {
    this.#result = a + b;
    this.#operationsPerformed++;
    this.#operationName = "Addition";
    return this.#result;
  }

  subtract(a, b) {
    this.#result = a - b;
    this.#operationsPerformed++;
    this.#operationName = "Subtraction";
    return this.#result;
  }

  multiply(a, b) {
    this.#result = a * b;
    this.#operationsPerformed++;
    this.#operationName = "Multiplication";
    return this.#result;
  }

  divide(a, b) {
    this.#operationsPerformed++;
    this.#operationName = "Division";
    if (b === 0) {
      return "Error: Cannot divide by zero";
    }
    this.#result = a / b;
    return this.#result;
  }
}

/*
 * JavaScript OOP Concepts Demonstrated:
 *
 * 1. Classes (ES6+)
 *    - Blueprint for objects
 *    - Introduced in ES6 as syntactic sugar over prototypes
 *    - Constructor method for initialization
 *
 * 2. Private Fields (#)
 *    - Truly private properties (ES2022+)
 *    - Only accessible within the class
 *    - Denoted by # prefix
 *
 * 3. Inheritance
 *    - Using 'extends' keyword
 *    - 'super' to call parent constructor
 *    - Single inheritance only
 *
 * 4. Encapsulation
 *    - Private fields (#property)
 *    - Getters/Setters
 *    - Method privacy
 *
 * 5. Abstraction
 *    - Abstract base class
 *    - Method contracts
 *    - Implementation hiding
 *
 * 6. Interface-like Patterns
 *    - No true interfaces in JavaScript
 *    - Can use classes or JSDoc for contracts
 *
 * 7. Method Types
 *    - Constructor methods
 *    - Instance methods
 *    - Getter/Setter methods
 *    - Static methods (not shown)
 *
 * Key Differences from Traditional OOP:
 * - Prototypal inheritance vs Classical inheritance
 * - No true interfaces
 * - Private fields are a recent addition
 * - 'this' binding can be tricky
 */

// Example usage:
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.operationsPerformed); // 1
// console.log(calc.#result);        // Error: Private field

// Calculator functions
//here is how we import the readline module in node.js
// const readline = require('readline');
//or
// from readline import createInterface
// import { createInterface } from 'readline';
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    return "Error: Cannot divide by zero";
  }
  return a / b;
}

function printMenu() {
  console.log("\nCalculator Menu:");
  console.log("1. Add");
  console.log("2. Subtract");
  console.log("3. Multiply");
  console.log("4. Divide");
  console.log("5. Exit");
}

async function main() {
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => {
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
        console.log(`Result: ${add(num1, num2)}`);
        break;
      case "2":
        console.log(`Result: ${subtract(num1, num2)}`);
        break;
      case "3":
        console.log(`Result: ${multiply(num1, num2)}`);
        break;
      case "4":
        console.log(`Result: ${divide(num1, num2)}`);
        break;
      default:
        console.log("Invalid choice!");
    }
  }
}

main().catch(console.error);

/*
 * JAVASCRIPT ERROR AND EXCEPTION HANDLING
 *
 * JavaScript uses try-catch-finally blocks for error handling.
 * Errors in JavaScript are objects that inherit from the Error constructor.
 *
 * Error Types:
 * - Error (base error type)
 * - SyntaxError (code syntax issues)
 * - ReferenceError (undefined variables)
 * - TypeError (wrong data type operations)
 * - RangeError (number out of range)
 * - URIError (URI encoding/decoding)
 * - EvalError (eval() function errors)
 * - AggregateError (multiple errors)
 */

// 1. BASIC TRY-CATCH:
function basicErrorHandling() {
  try {
    let result = 10 / 0; // Not an error in JS (returns Infinity)
    let obj = null;
    console.log(obj.property); // TypeError
  } catch (error) {
    console.log("Error caught:", error.message);
    console.log("Error type:", error.name);
    console.log("Stack trace:", error.stack);
  }
}

// 2. SPECIFIC ERROR TYPES:
function specificErrorHandling() {
  try {
    JSON.parse("invalid json"); // SyntaxError
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("JSON parsing error:", error.message);
    } else if (error instanceof TypeError) {
      console.log("Type error:", error.message);
    } else if (error instanceof ReferenceError) {
      console.log("Reference error:", error.message);
    } else {
      console.log("Unknown error:", error.message);
    }
  }
}

// 3. TRY-CATCH-FINALLY:
function completeErrorHandling() {
  let resource = null;
  try {
    resource = acquireResource();
    performOperation(resource);
  } catch (error) {
    console.log("Operation failed:", error.message);
    return null;
  } finally {
    // Always runs - cleanup code
    if (resource) {
      releaseResource(resource);
    }
    console.log("Cleanup completed");
  }
}

// 4. THROWING CUSTOM ERRORS:
function throwCustomError(value) {
  if (value < 0) {
    throw new Error("Value cannot be negative");
  }
  if (typeof value !== "number") {
    throw new TypeError("Value must be a number");
  }
  if (value > 100) {
    throw new RangeError("Value must be between 0 and 100");
  }
  return value * 2;
}

// 5. CUSTOM ERROR CLASSES:
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

function validateUser(user) {
  if (!user.name) {
    throw new ValidationError("Name is required", "name");
  }
  if (!user.email) {
    throw new ValidationError("Email is required", "email");
  }
  if (user.age < 0) {
    throw new ValidationError("Age must be positive", "age");
  }
}

// 6. ASYNC/AWAIT ERROR HANDLING:
async function asyncErrorHandling() {
  try {
    const data = await fetchDataFromAPI();
    const processed = await processData(data);
    return processed;
  } catch (error) {
    if (error instanceof NetworkError) {
      console.log("Network issue:", error.message);
      console.log("Status code:", error.statusCode);
    } else {
      console.log("Processing error:", error.message);
    }
    throw error; // Re-throw if needed
  }
}

// 7. PROMISE ERROR HANDLING:
function promiseErrorHandling() {
  fetchDataFromAPI()
    .then((data) => processData(data))
    .then((result) => console.log("Success:", result))
    .catch((error) => {
      console.log("Promise chain error:", error.message);
    })
    .finally(() => {
      console.log("Promise chain completed");
    });
}

// 8. MULTIPLE ASYNC OPERATIONS:
async function multipleAsyncOperations() {
  try {
    // Sequential operations
    const user = await fetchUser();
    const profile = await fetchProfile(user.id);

    // Parallel operations with error handling
    const [posts, friends] = await Promise.allSettled([
      fetchPosts(user.id),
      fetchFriends(user.id),
    ]);

    // Check individual results
    if (posts.status === "rejected") {
      console.log("Posts failed:", posts.reason);
    }
    if (friends.status === "rejected") {
      console.log("Friends failed:", friends.reason);
    }

    return { user, profile, posts: posts.value, friends: friends.value };
  } catch (error) {
    console.log("Main operation failed:", error.message);
    throw error;
  }
}

// 9. ERROR BOUNDARIES FOR FUNCTIONS:
function withErrorBoundary(fn, fallback) {
  return function (...args) {
    try {
      return fn.apply(this, args);
    } catch (error) {
      console.log("Function error caught:", error.message);
      return fallback;
    }
  };
}

const safeOperation = withErrorBoundary((x, y) => x / y, "Operation failed");

// 10. RETRY MECHANISM:
async function retryOperation(operation, maxRetries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error(
          `Operation failed after ${maxRetries} attempts: ${error.message}`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

// 11. ERROR LOGGING:
class Logger {
  static logError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
    };

    console.error("Error logged:", JSON.stringify(errorInfo, null, 2));

    // In production, send to logging service
    // sendToLoggingService(errorInfo);
  }
}

// 12. GLOBAL ERROR HANDLING:
// For unhandled errors
window.addEventListener("error", (event) => {
  console.log("Global error:", event.error);
  Logger.logError(event.error, { type: "global" });
});

// For unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  console.log("Unhandled promise rejection:", event.reason);
  Logger.logError(event.reason, { type: "unhandled-promise" });
  // Prevent default browser behavior
  event.preventDefault();
});

// 13. ENHANCED CALCULATOR WITH ERROR HANDLING:
class SafeCalculator extends Calculator {
  safeAdd(a, b) {
    try {
      this.validateNumbers(a, b);
      return super.add(a, b);
    } catch (error) {
      Logger.logError(error, { operation: "add", a, b });
      throw error;
    }
  }

  safeDivide(a, b) {
    try {
      this.validateNumbers(a, b);
      if (b === 0) {
        throw new Error("Division by zero is not allowed");
      }
      return super.divide(a, b);
    } catch (error) {
      Logger.logError(error, { operation: "divide", a, b });
      throw error;
    }
  }

  validateNumbers(...numbers) {
    for (const num of numbers) {
      if (typeof num !== "number") {
        throw new TypeError(`Expected number, got ${typeof num}`);
      }
      if (isNaN(num)) {
        throw new Error("NaN values are not allowed");
      }
      if (!isFinite(num)) {
        throw new RangeError("Infinite values are not allowed");
      }
    }
  }
}

// 14. ASYNC CALCULATOR EXAMPLE:
async function calculatorWithAsyncValidation() {
  const calc = new SafeCalculator();

  try {
    // Simulate async validation
    await validateUserPermissions();

    const result = calc.safeAdd(10, 5);
    console.log("Result:", result);

    const divisionResult = calc.safeDivide(10, 2);
    console.log("Division result:", divisionResult);
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("Validation error:", error.message);
    } else if (error instanceof TypeError) {
      console.log("Type error:", error.message);
    } else {
      console.log("Unexpected error:", error.message);
    }
  }
}

// Helper functions for examples
function acquireResource() {
  return { id: 1, name: "resource" };
}

function releaseResource(resource) {
  console.log("Released resource:", resource.id);
}

function performOperation(resource) {
  // Simulate operation
}

async function fetchDataFromAPI() {
  // Simulate API call
  const success = Math.random() > 0.3;
  if (!success) {
    throw new NetworkError("API request failed", 500);
  }
  return { data: "sample data" };
}

async function processData(data) {
  if (!data) {
    throw new Error("No data to process");
  }
  return { processed: true, ...data };
}

async function fetchUser() {
  return { id: 1, name: "John" };
}

async function fetchProfile(userId) {
  return { userId, bio: "User bio" };
}

async function fetchPosts(userId) {
  return [{ id: 1, title: "Post 1" }];
}

async function fetchFriends(userId) {
  return [{ id: 2, name: "Friend 1" }];
}

async function validateUserPermissions() {
  // Simulate permission check
  return true;
}

/*
 * BEST PRACTICES:
 *
 * 1. Use specific error types for different scenarios
 * 2. Provide meaningful error messages
 * 3. Log errors with context information
 * 4. Handle async errors properly with try-catch in async functions
 * 5. Use Promise.allSettled() for handling multiple async operations
 * 6. Implement retry mechanisms for transient failures
 * 7. Use error boundaries to contain errors
 * 8. Don't swallow errors silently
 * 9. Clean up resources in finally blocks
 * 10. Use global error handlers for unexpected errors
 *
 * COMMON ERROR PATTERNS:
 * - TypeError: null/undefined access, wrong type operations
 * - ReferenceError: undefined variables
 * - SyntaxError: invalid JSON, eval errors
 * - RangeError: array length, number precision
 * - Network errors: fetch failures, timeout
 * - Validation errors: user input validation
 *
 * ASYNC ERROR HANDLING:
 * - Use try-catch with async/await
 * - Use .catch() with Promises
 * - Handle unhandled promise rejections
 * - Use Promise.allSettled() for multiple operations
 * - Implement timeout mechanisms
 */
