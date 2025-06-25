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
    try {
      printMenu();
      const choice = await question("Enter your choice (1-5): ");

      if (choice === "5") {
        console.log("Goodbye!");
        readline.close();
        break;
      }

      if (!["1", "2", "3", "4"].includes(choice)) {
        throw new ValidationError(
          "Invalid choice. Please enter 1-5.",
          "choice"
        );
      }

      const num1Input = await question("Enter first number: ");
      const num2Input = await question("Enter second number: ");

      const num1 = parseFloat(num1Input);
      const num2 = parseFloat(num2Input);

      if (isNaN(num1) || isNaN(num2)) {
        throw new ValidationError("Please enter valid numbers.", "input");
      }

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
          const divisionResult = calc.divide(num1, num2);
          console.log(`Result: ${divisionResult}`);
          break;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`Validation Error: ${error.message}`);
      } else if (error instanceof CalculatorError) {
        console.error(`Calculator Error: ${error.message}`);
      } else {
        console.error(`Unexpected Error: ${error}`);
      }
    }
  }
}

main().catch(console.error);

/*
 * TYPESCRIPT ERROR AND EXCEPTION HANDLING
 *
 * TypeScript enhances JavaScript's error handling with static type checking
 * and better tooling support. It uses the same runtime error handling as
 * JavaScript but provides compile-time safety and better error messages.
 *
 * Key Features:
 * - Static type checking prevents many runtime errors
 * - Union types for error handling patterns
 * - Generic error types
 * - Better IDE support and IntelliSense
 * - Compile-time error detection
 */

// 1. BASIC ERROR TYPES WITH TYPESCRIPT:
interface ErrorWithCode {
  message: string;
  code: number;
  timestamp: Date;
}

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// 2. CUSTOM ERROR CLASSES WITH TYPES:
class ValidationError extends Error {
  readonly name = "ValidationError";

  constructor(
    message: string,
    public readonly field: string,
    public readonly code: number = 400
  ) {
    super(message);
  }
}

class CalculatorError extends Error {
  readonly name = "CalculatorError";

  constructor(
    message: string,
    public readonly operation: string,
    public readonly inputs: number[]
  ) {
    super(message);
  }
}

class NetworkError extends Error {
  readonly name = "NetworkError";

  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly url?: string
  ) {
    super(message);
  }
}

// 3. RESULT TYPE PATTERN (Railway Oriented Programming):
function safeParseNumber(input: string): Result<number> {
  const parsed = parseFloat(input);

  if (isNaN(parsed)) {
    return {
      success: false,
      error: new ValidationError("Invalid number format", "input"),
    };
  }

  return { success: true, data: parsed };
}

function safeDivide(a: number, b: number): Result<number, CalculatorError> {
  if (b === 0) {
    return {
      success: false,
      error: new CalculatorError("Division by zero", "divide", [a, b]),
    };
  }

  return { success: true, data: a / b };
}

// 4. UNION TYPES FOR ERROR HANDLING:
type ApiResponse<T> = T | { error: string; statusCode: number };

async function fetchUser(
  id: number
): Promise<ApiResponse<{ name: string; email: string }>> {
  try {
    // Simulate API call
    if (id <= 0) {
      return { error: "Invalid user ID", statusCode: 400 };
    }

    return { name: "John Doe", email: "john@example.com" };
  } catch (error) {
    return { error: "Internal server error", statusCode: 500 };
  }
}

// 5. OPTIONAL AND NULLABLE TYPES:
interface UserProfile {
  id: number;
  name: string;
  email?: string; // Optional
  avatar: string | null; // Nullable
}

function processUserProfile(profile: UserProfile): void {
  // TypeScript ensures null checks
  if (profile.email) {
    console.log(`Email: ${profile.email}`);
  }

  if (profile.avatar !== null) {
    console.log(`Avatar: ${profile.avatar}`);
  }
}

// 6. GENERIC ERROR HANDLING:
class ErrorHandler<T extends Error> {
  private handlers = new Map<string, (error: T) => void>();

  register(errorType: string, handler: (error: T) => void): void {
    this.handlers.set(errorType, handler);
  }

  handle(error: T): void {
    const handler = this.handlers.get(error.name);
    if (handler) {
      handler(error);
    } else {
      console.error("Unhandled error:", error);
    }
  }
}

// 7. ASYNC ERROR HANDLING WITH TYPES:
async function typedAsyncOperation(): Promise<
  Result<string, NetworkError | ValidationError>
> {
  try {
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    const randomSuccess = Math.random() > 0.3;
    if (!randomSuccess) {
      return {
        success: false,
        error: new NetworkError("Network timeout", 408),
      };
    }

    return { success: true, data: "Operation completed" };
  } catch (error) {
    return {
      success: false,
      error: new ValidationError("Invalid operation", "general"),
    };
  }
}

// 8. SAFE CALCULATOR WITH TYPESCRIPT:
class SafeCalculator extends Calculator {
  validateInputs(a: number, b: number): void {
    if (typeof a !== "number" || typeof b !== "number") {
      throw new ValidationError("Inputs must be numbers", "input");
    }

    if (isNaN(a) || isNaN(b)) {
      throw new ValidationError("NaN values are not allowed", "input");
    }

    if (!isFinite(a) || !isFinite(b)) {
      throw new ValidationError("Infinite values are not allowed", "input");
    }
  }

  safeAdd(a: number, b: number): Result<number, ValidationError> {
    try {
      this.validateInputs(a, b);
      return { success: true, data: super.add(a, b) };
    } catch (error) {
      if (error instanceof ValidationError) {
        return { success: false, error };
      }
      return {
        success: false,
        error: new ValidationError("Unknown error in addition", "operation"),
      };
    }
  }

  safeDivide(
    a: number,
    b: number
  ): Result<number, ValidationError | CalculatorError> {
    try {
      this.validateInputs(a, b);

      if (b === 0) {
        return {
          success: false,
          error: new CalculatorError("Division by zero", "divide", [a, b]),
        };
      }

      const result = super.divide(a, b);
      return {
        success: true,
        data: typeof result === "string" ? parseFloat(result) : result,
      };
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof CalculatorError
      ) {
        return { success: false, error };
      }
      return {
        success: false,
        error: new ValidationError("Unknown error in division", "operation"),
      };
    }
  }
}

// 9. ERROR BOUNDARY FUNCTION WITH TYPES:
function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => R,
  errorHandler?: (error: Error) => R
): (...args: T) => R {
  return (...args: T): R => {
    try {
      return fn(...args);
    } catch (error) {
      if (errorHandler) {
        return errorHandler(error as Error);
      }
      throw error;
    }
  };
}

// 10. RETRY MECHANISM WITH TYPES:
interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff?: "fixed" | "exponential";
}

async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === options.maxAttempts) {
        throw new Error(
          `Operation failed after ${options.maxAttempts} attempts: ${lastError.message}`
        );
      }

      const delay =
        options.backoff === "exponential"
          ? options.delay * Math.pow(2, attempt - 1)
          : options.delay;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// 11. TYPE GUARDS FOR ERROR CHECKING:
function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

function isCalculatorError(error: unknown): error is CalculatorError {
  return error instanceof CalculatorError;
}

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

// 12. EXHAUSTIVE ERROR HANDLING:
type AppError = ValidationError | CalculatorError | NetworkError;

function handleAppError(error: AppError): string {
  switch (error.name) {
    case "ValidationError":
      return `Validation failed for ${error.field}: ${error.message}`;
    case "CalculatorError":
      return `Calculator error in ${error.operation}: ${error.message}`;
    case "NetworkError":
      return `Network error (${error.statusCode}): ${error.message}`;
    default:
      // TypeScript ensures this is never reached
      const _exhaustiveCheck: never = error;
      return "Unknown error";
  }
}

// 13. LOGGER WITH TYPES:
interface LogContext {
  userId?: string;
  requestId?: string;
  timestamp: Date;
  level: "info" | "warn" | "error";
}

class TypedLogger {
  static logError(error: Error, context: Partial<LogContext> = {}): void {
    const logEntry: LogContext = {
      timestamp: new Date(),
      level: "error",
      ...context,
    };

    console.error("Error logged:", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context: logEntry,
    });
  }
}

// 14. EXAMPLE USAGE WITH TYPES:
async function demonstrateTypedErrorHandling(): Promise<void> {
  const safeCalc = new SafeCalculator();

  // Using Result type pattern
  const addResult = safeCalc.safeAdd(10, 5);
  if (addResult.success) {
    console.log("Addition result:", addResult.data);
  } else {
    console.error("Addition failed:", addResult.error.message);
  }

  // Using union type pattern
  const userResponse = await fetchUser(1);
  if ("error" in userResponse) {
    console.error("Fetch failed:", userResponse.error);
  } else {
    console.log("User:", userResponse.name);
  }

  // Using retry mechanism
  try {
    const result = await retry(() => typedAsyncOperation(), {
      maxAttempts: 3,
      delay: 1000,
      backoff: "exponential",
    });

    if (result.success) {
      console.log("Async operation succeeded:", result.data);
    } else {
      console.error("Async operation failed:", result.error.message);
    }
  } catch (error) {
    TypedLogger.logError(error as Error, { userId: "user123" });
  }
}

/*
 * TYPESCRIPT-SPECIFIC BEST PRACTICES:
 *
 * 1. Use union types for error states
 * 2. Implement Result<T, E> pattern for explicit error handling
 * 3. Use type guards for error identification
 * 4. Leverage strict null checks (strictNullChecks: true)
 * 5. Create custom error classes with typed properties
 * 6. Use generic types for reusable error handling
 * 7. Implement exhaustive error handling with switch statements
 * 8. Use readonly properties for immutable error data
 * 9. Type your async operations properly
 * 10. Use interface segregation for error contracts
 *
 * COMPILE-TIME SAFETY:
 * - Null and undefined checks
 * - Type mismatches
 * - Missing properties
 * - Invalid method calls
 * - Unreachable code detection
 *
 * RUNTIME ERROR PATTERNS:
 * - Result<T, E> for explicit error handling
 * - Union types for multiple possible outcomes
 * - Type guards for runtime type checking
 * - Generic error handlers
 * - Strongly typed custom exceptions
 */

// Example usage
const calculator = new Calculator();
console.log(calculator.add(5, 3)); // 8
console.log(calculator.operationsPerformed); // 1
// console.log(calculator.#result);       // Error: Private field
