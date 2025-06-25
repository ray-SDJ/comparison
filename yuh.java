// 1. Interface - Top level contract
interface MathOperations {
    double performOperation(double a, double b);  // Abstract by default
    String getOperationName();                    // Must be implemented
}

// 2. Abstract Class - Partial implementation
abstract class AbstractCalculator {
    // Protected member - accessible to subclasses
    protected String calculatorType;
    
    // Constructor
    public AbstractCalculator(String type) {
        this.calculatorType = type;
    }
    
    // Abstract method - must be implemented by subclasses
    abstract double getResult();
}

// 3. Concrete Class - Full implementation
class Calculator extends AbstractCalculator implements MathOperations {
    // Private fields - encapsulation
    private double result;
    private int operationsPerformed;
    private String operationName;

    // Constructor chain using super()
    public Calculator() {
        super("Basic Calculator");  // Call parent constructor
        this.result = 0;
        this.operationsPerformed = 0;
    }

    // Implementation of abstract method from parent class
    @Override
    double getResult() {
        return this.result;
    }

    // Implementation of interface methods
    @Override
    public double performOperation(double a, double b) {
        return add(a, b);
    }

    @Override
    public String getOperationName() {
        return this.operationName;
    }

    // Getter method - part of encapsulation to safely access private members
    public int getOperationsPerformed() {
        return operationsPerformed;
    }

    // Instance methods - define the behavior of Calculator objects
    public double add(double a, double b) {
        result = a + b;
        operationsPerformed++;
        operationName = "Addition";
        return result;
    }

    public double subtract(double a, double b) {
        result = a - b;
        operationsPerformed++;
        operationName = "Subtraction";
        return result;
    }

    public double multiply(double a, double b) {
        result = a * b;
        operationsPerformed++;
        operationName = "Multiplication";
        return result;
    }

    public String divide(double a, double b) {
        operationsPerformed++;
        operationName = "Division";
        if (b == 0) {
            return "Error: Cannot divide by zero";
        }
        result = a / b;
        return String.valueOf(result);
    }
}

/* 
 * OOP Concepts Demonstrated:
 * 
 * 1. Classes:
 *    - Blueprint for objects (Calculator class)
 *    - Abstract classes (AbstractCalculator)
 *    - Can implement interfaces and extend other classes
 * 
 * 2. Objects:
 *    - Instances of classes
 *    - Created using constructor (new Calculator())
 *    - Have state (fields) and behavior (methods)
 * 
 * 3. Encapsulation:
 *    - Private fields (result, operationsPerformed)
 *    - Public methods to access private fields (getters/setters)
 *    - Protects data from outside interference
 * 
 * 4. Inheritance:
 *    - Calculator extends AbstractCalculator
 *    - Inherits fields and methods from parent
 *    - Can override parent methods
 * 
 * 5. Abstraction:
 *    - Abstract class AbstractCalculator
 *    - Abstract methods define contract
 *    - Hide implementation details
 * 
 * 6. Interfaces:
 *    - MathOperations interface
 *    - Define contract for classes
 *    - Enable polymorphism
 * 
 * 7. Access Modifiers:
 *    - private: only within class
 *    - protected: class and subclasses
 *    - public: accessible everywhere
 *    - default (no modifier): package-level access
 * 
 * 8. Method Types:
 *    - Constructor methods
 *    - Instance methods
 *    - Override methods
 *    - Abstract methods
 */

// A simple calculator program to demonstrate Java program structure
import java.util.Scanner;

public class yuh {
    private static void printMenu() {
        System.out.println("\nCalculator Menu:");
        System.out.println("1. Add");
        System.out.println("2. Subtract");
        System.out.println("3. Multiply");
        System.out.println("4. Divide");
        System.out.println("5. Exit");
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        Scanner scanner = new Scanner(System.in);

        while (true) {
            try {
                printMenu();
                System.out.print("Enter your choice (1-5): ");
                String choice = scanner.nextLine();

                if (choice.equals("5")) {
                    System.out.println("Goodbye!");
                    break;
                }

                System.out.print("Enter first number: ");
                double num1 = Double.parseDouble(scanner.nextLine());
                System.out.print("Enter second number: ");
                double num2 = Double.parseDouble(scanner.nextLine());

                switch (choice) {
                    case "1":
                        System.out.println("Result: " + calc.add(num1, num2));
                        break;
                    case "2":
                        System.out.println("Result: " + calc.subtract(num1, num2));
                        break;
                    case "3":
                        System.out.println("Result: " + calc.multiply(num1, num2));
                        break;
                    case "4":
                        System.out.println("Result: " + calc.divide(num1, num2));
                        break;
                    default:
                        System.out.println("Invalid choice!");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error: Please enter valid numbers. " + e.getMessage());
            } catch (Exception e) {
                System.out.println("An unexpected error occurred: " + e.getMessage());
            }
        }
        scanner.close();
    }
}

/*
 * JAVA ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED
 * 
 * WHAT ARE EXCEPTIONS?
 * Exceptions are unexpected events that occur during program execution that disrupt
 * the normal flow of instructions. They represent error conditions that a program
 * can potentially recover from, unlike system errors which usually terminate the program.
 * 
 * WHY USE EXCEPTION HANDLING?
 * 1. Separate error handling code from normal program flow
 * 2. Propagate errors up the call stack to appropriate handlers
 * 3. Group related error types together
 * 4. Provide meaningful error information to users and developers
 * 5. Enable graceful recovery from error conditions
 * 6. Ensure resource cleanup even when errors occur
 * 
 * JAVA'S EXCEPTION HANDLING PHILOSOPHY:
 * Java uses a "try-catch-finally" approach where:
 * - You "try" to execute risky code
 * - You "catch" specific types of exceptions that might occur
 * - You "finally" execute cleanup code regardless of success or failure
 * 
 * CHECKED vs UNCHECKED EXCEPTIONS:
 * 
 * CHECKED EXCEPTIONS (Compile-time enforcement):
 * - Must be either caught or declared in method signature
 * - Represent recoverable conditions (file not found, network timeout)
 * - Examples: IOException, SQLException, ClassNotFoundException
 * - Compiler forces you to handle them
 * 
 * UNCHECKED EXCEPTIONS (Runtime exceptions):
 * - Don't need to be explicitly caught or declared
 * - Represent programming errors that should be fixed in code
 * - Examples: NullPointerException, ArrayIndexOutOfBoundsException
 * - Can be caught but typically indicate bugs in the code
 * 
 * Java has a robust exception handling system using try-catch-finally blocks
 * and a hierarchy of exception classes.
 * 
 * Exception Hierarchy:
 * - Throwable (top-level)
 *   ├── Error (system errors, usually not caught)
 *   └── Exception
 *       ├── RuntimeException (unchecked exceptions)
 *       │   ├── NullPointerException
 *       │   ├── ArrayIndexOutOfBoundsException
 *       │   ├── NumberFormatException
 *       │   └── IllegalArgumentException
 *       └── Checked Exceptions (must be handled)
 *           ├── IOException
 *           ├── SQLException
 *           └── ClassNotFoundException
 * 
 * 1. TRY-CATCH-FINALLY EXPLAINED:
 * 
 * TRY BLOCK: Contains code that might throw an exception
 * CATCH BLOCK: Handles specific types of exceptions
 * FINALLY BLOCK: Always executes, used for cleanup (optional)
 * 
 * Flow of execution:
 * 1. Code in try block executes normally
 * 2. If exception occurs, execution jumps to appropriate catch block
 * 3. Finally block executes regardless of whether exception occurred
 * 4. Program continues after the try-catch-finally structure
 */
class ExceptionHandlingExample {
    /*
     * BASIC EXCEPTION HANDLING EXPLANATION:
     * 
     * The try-catch-finally structure allows you to:
     * 1. Attempt risky operations in the try block
     * 2. Handle specific errors in catch blocks
     * 3. Perform cleanup in the finally block (always runs)
     * 
     * This prevents your program from crashing and allows graceful error handling.
     */
    public void demonstrateExceptionHandling() {
        try {
            // Code that might throw an exception
            int result = 10 / 0;  // ArithmeticException
        } catch (ArithmeticException e) {
            // Handle specific exception
            System.out.println("Cannot divide by zero: " + e.getMessage());
        } catch (Exception e) {
            // Handle any other exception (catch-all)
            System.out.println("General error: " + e.getMessage());
        } finally {
            // Always executes (cleanup code)
            System.out.println("Cleanup operations");
        }
    }

    /*
     * MULTIPLE CATCH BLOCKS EXPLANATION:
     * 
     * You can have multiple catch blocks to handle different types of exceptions
     * differently. Java checks catch blocks in order from top to bottom, so:
     * 1. Put more specific exceptions first
     * 2. Put general exceptions last
     * 3. Each catch block handles a different error scenario
     */
    public void multipleExceptions() {
        try {
            String str = null;
            int length = str.length();  // NullPointerException
            int[] arr = new int[5];
            arr[10] = 1;  // ArrayIndexOutOfBoundsException
        } catch (NullPointerException e) {
            System.out.println("Null pointer error: " + e.getMessage());
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Other error: " + e.getMessage());
        }
    }

    /*
     * MULTI-CATCH EXPLANATION (Java 7+):
     * 
     * When you want to handle multiple exception types the same way,
     * you can use the pipe (|) operator to catch multiple exceptions
     * in a single catch block. This reduces code duplication.
     */
    public void multiCatch() {
        try {
            // Some risky code
            performRiskyOperation();
        } catch (IOException | SQLException e) {
            // Handle multiple exception types the same way
            System.out.println("IO or SQL error: " + e.getMessage());
        }
    }

    /*
     * THROWS DECLARATION EXPLANATION:
     * 
     * When a method might throw a checked exception but doesn't want to handle it,
     * it can declare that it "throws" the exception. This means:
     * 1. The method passes the responsibility to its caller
     * 2. The caller must either catch the exception or declare throws as well
     * 3. This creates a chain of responsibility up the call stack
     */
    public void methodThatThrows() throws IOException, SQLException {
        // Method declares it might throw these exceptions
        // Caller must handle or declare throws
    }

    /*
     * THROW STATEMENT EXPLANATION:
     * 
     * You can manually throw exceptions when you detect error conditions.
     * This is useful for:
     * 1. Input validation
     * 2. Business logic validation
     * 3. Converting between exception types
     * 4. Adding context to existing exceptions
     */
    public void validateAge(int age) {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative: " + age);
        }
        if (age > 150) {
            throw new IllegalArgumentException("Age seems unrealistic: " + age);
        }
    }

    /*
     * CUSTOM EXCEPTIONS EXPLANATION:
     * 
     * You can create your own exception classes by extending Exception
     * or RuntimeException. Custom exceptions are useful for:
     * 1. Domain-specific error conditions
     * 2. Adding additional error information
     * 3. Creating a hierarchy of related errors
     * 4. Making error handling more specific to your application
     */
    public static class CustomCalculatorException extends Exception {
        public CustomCalculatorException(String message) {
            super(message);
        }
    }

    public double safeDivide(double a, double b) throws CustomCalculatorException {
        if (b == 0) {
            throw new CustomCalculatorException("Division by zero is not allowed");
        }
        return a / b;
    }

    /*
     * TRY-WITH-RESOURCES EXPLANATION (Java 7+):
     * 
     * This is a special form of try statement that automatically manages resources.
     * Resources declared in the try parentheses are automatically closed when:
     * 1. The try block completes successfully
     * 2. An exception occurs
     * 3. The resource implements AutoCloseable interface
     * 
     * This prevents resource leaks and eliminates the need for manual cleanup.
     */
    public void tryWithResources() {
        // Automatically closes resources
        try (Scanner scanner = new Scanner(System.in);
             FileWriter writer = new FileWriter("output.txt")) {
            
            String input = scanner.nextLine();
            writer.write(input);
            
        } catch (IOException e) {
            System.out.println("IO Error: " + e.getMessage());
        }
        // Resources are automatically closed
    }

    /*
     * EXCEPTION CHAINING EXPLANATION:
     * 
     * Sometimes you want to catch an exception and throw a different one,
     * but you don't want to lose the original error information. Exception
     * chaining allows you to:
     * 1. Wrap low-level exceptions in high-level ones
     * 2. Preserve the original stack trace
     * 3. Add context while maintaining the root cause
     */
    public void exceptionChaining() {
        try {
            methodThatFails();
        } catch (Exception e) {
            // Wrap and re-throw with more context
            throw new RuntimeException("Failed in main operation", e);
        }
    }

    private void methodThatFails() throws Exception {
        throw new Exception("Original failure");
    }

    private void performRiskyOperation() throws IOException, SQLException {
        // Implementation details
    }
}

/*
 * KEY CONCEPTS EXPLAINED:
 * 
 * 1. EXCEPTION OBJECTS: When an error occurs, Java creates an exception object
 *    containing information about the error (message, stack trace, cause)
 * 
 * 2. STACK UNWINDING: When an exception is thrown, Java unwinds the call stack
 *    looking for a matching catch block, calling finally blocks along the way
 * 
 * 3. EXCEPTION PROPAGATION: If no catch block handles an exception, it propagates
 *    up the call stack until handled or the program terminates
 * 
 * 4. RESOURCE MANAGEMENT: Use try-with-resources or finally blocks to ensure
 *    resources (files, connections) are properly closed even if errors occur
 * 
 * 5. CHECKED vs UNCHECKED: Checked exceptions must be handled (compiler enforced),
 *    unchecked exceptions are optional but indicate programming errors
 * 
 * BEST PRACTICES:
 * 
 * 1. Catch specific exceptions before general ones
 * 2. Use finally for cleanup code
 * 3. Don't catch and ignore exceptions
 * 4. Use try-with-resources for automatic resource management
 * 5. Create meaningful exception messages
 * 6. Log exceptions for debugging
 * 7. Don't use exceptions for control flow
 * 8. Prefer unchecked exceptions for programming errors
 * 9. Use checked exceptions for recoverable conditions
 * 10. Clean up resources in finally or use try-with-resources
 * 
 * COMMON EXCEPTIONS:
 * - NullPointerException: Accessing null reference
 * - ArrayIndexOutOfBoundsException: Invalid array index
 * - NumberFormatException: Invalid number format
 * - IllegalArgumentException: Invalid method argument
 * - IOException: Input/output operations
 * - SQLException: Database operations
 * - ClassNotFoundException: Class loading issues
 * - ConcurrentModificationException: Concurrent collection modification
 */

