#include <iostream>
#include <string>
#include <exception>
#include <stdexcept>
#include <limits>
#include <memory>
#include <vector>
#include <fstream>

// Interface-like abstract class (pure virtual class in C++)
#include <fstream>

// File Handling Tutorial in C++
int main() {
    // Writing to a file
    ofstream outfile("example.txt");
    outfile << "Hello, world!\n";
    outfile.close();

    // Reading from a file
    ifstream infile("example.txt");
    string content;
    getline(infile, content);
    cout << "File content: " << content << endl;
    infile.close();
    return 0;
}
class MathOperations {
public:
    virtual double performOperation(double a, double b) = 0;
    virtual std::string getOperationName() const = 0;
    virtual ~MathOperations() = default;  // Virtual destructor for interface
};

// Abstract base class
class AbstractCalculator {
protected:
    // Protected member
    const std::string calculatorType;

public:
    // Constructor
    explicit AbstractCalculator(std::string type) 
        : calculatorType(std::move(type)) {}
    
    // Pure virtual method
    virtual double getResult() const = 0;
    
    // Virtual destructor
    virtual ~AbstractCalculator() = default;
};

// Main Calculator class implementing inheritance
class Calculator : public AbstractCalculator, public MathOperations {
private:
    // Private members demonstrating encapsulation
    double result;
    int operationsPerformed;
    std::string operationName;

public:
    // Constructor with initializer list
    Calculator() 
        : AbstractCalculator("Basic Calculator")
        , result(0)
        , operationsPerformed(0)
        , operationName("") {}

    // Implementation of abstract methods
    double getResult() const override {
        return result;
    }

    double performOperation(double a, double b) override {
        return add(a, b);
    }

    std::string getOperationName() const override {
        return operationName;
    }

    // Getter method (const member function)
    int getOperationsPerformed() const {
        return operationsPerformed;
    }

    // Instance methods
    double add(double a, double b) {
        result = a + b;
        operationName = "Addition";
        operationsPerformed++;
        return result;
    }

    double subtract(double a, double b) {
        result = a - b;
        operationName = "Subtraction";
        operationsPerformed++;
        return result;
    }

    double multiply(double a, double b) {
        result = a * b;
        operationName = "Multiplication";
        operationsPerformed++;
        return result;
    }

    std::string divide(double a, double b) {
        if (b == 0) {
            return "Error: Cannot divide by zero";
        }
        result = a / b;
        operationName = "Division";
        operationsPerformed++;
        return std::to_string(result);
    }
};

void printMenu() {
    std::cout << "\nCalculator Menu:" << std::endl;
    std::cout << "1. Add" << std::endl;
    std::cout << "2. Subtract" << std::endl;
    std::cout << "3. Multiply" << std::endl;
    std::cout << "4. Divide" << std::endl;
    std::cout << "5. Exit" << std::endl;
}

int main() {
    Calculator calc;
    std::string choice;
    double num1, num2;

    while (true) {
        try {
            printMenu();
            std::cout << "Enter your choice (1-5): ";
            std::getline(std::cin, choice);

            if (choice == "5") {
                std::cout << "Goodbye!" << std::endl;
                break;
            }

            if (choice != "1" && choice != "2" && choice != "3" && choice != "4") {
                throw std::invalid_argument("Invalid choice. Please enter 1-5.");
            }

            std::cout << "Enter first number: ";
            if (!(std::cin >> num1)) {
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                throw std::invalid_argument("Invalid input for first number");
            }
            
            std::cout << "Enter second number: ";
            if (!(std::cin >> num2)) {
                std::cin.clear();
                std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
                throw std::invalid_argument("Invalid input for second number");
            }
            std::cin.ignore();

            if (choice == "1") {
                std::cout << "Result: " << calc.add(num1, num2) << std::endl;
            }
            else if (choice == "2") {
                std::cout << "Result: " << calc.subtract(num1, num2) << std::endl;
            }
            else if (choice == "3") {
                std::cout << "Result: " << calc.multiply(num1, num2) << std::endl;
            }
            else if (choice == "4") {
                if (num2 == 0) {
                    throw std::runtime_error("Division by zero is not allowed");
                }
                std::cout << "Result: " << calc.divide(num1, num2) << std::endl;
            }
        }
        catch (const std::invalid_argument& e) {
            std::cerr << "Input Error: " << e.what() << std::endl;
        }
        catch (const std::runtime_error& e) {
            std::cerr << "Runtime Error: " << e.what() << std::endl;
        }
        catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << std::endl;
        }
        catch (...) {
            std::cerr << "Unknown error occurred" << std::endl;
        }
    }

    return 0;
}

/*
 * C++ ERROR AND EXCEPTION HANDLING
 * 
 * C++ provides exception handling through try-catch-throw mechanisms.
 * The standard library includes a hierarchy of exception classes.
 * 
 * Exception Hierarchy:
 * std::exception (base class)
 * ├── std::logic_error
 * │   ├── std::invalid_argument
 * │   ├── std::domain_error
 * │   ├── std::length_error
 * │   └── std::out_of_range
 * ├── std::runtime_error
 * │   ├── std::range_error
 * │   ├── std::overflow_error
 * │   └── std::underflow_error
 * ├── std::bad_alloc (memory allocation)
 * ├── std::bad_cast (dynamic_cast)
 * └── std::bad_typeid (typeid)
 * 
 * Required headers:
 * #include <exception>
 * #include <stdexcept>
 * #include <limits>
 */

// 1. BASIC TRY-CATCH-THROW:
class ExceptionExample {
public:
    void basicExceptionHandling() {
        try {
            // Code that might throw an exception
            throw std::runtime_error("Something went wrong");
        }
        catch (const std::runtime_error& e) {
            std::cout << "Runtime error: " << e.what() << std::endl;
        }
        catch (const std::exception& e) {
            std::cout << "Standard exception: " << e.what() << std::endl;
        }
        catch (...) {
            std::cout << "Unknown exception caught" << std::endl;
        }
    }

    // 2. MULTIPLE EXCEPTION TYPES:
    void multipleExceptions() {
        try {
            std::vector<int> vec{1, 2, 3};
            vec.at(10); // throws std::out_of_range
        }
        catch (const std::out_of_range& e) {
            std::cout << "Out of range: " << e.what() << std::endl;
        }
        catch (const std::invalid_argument& e) {
            std::cout << "Invalid argument: " << e.what() << std::endl;
        }
        catch (const std::logic_error& e) {
            std::cout << "Logic error: " << e.what() << std::endl;
        }
        catch (const std::exception& e) {
            std::cout << "Standard exception: " << e.what() << std::endl;
        }
    }

    // 3. FUNCTION THAT THROWS EXCEPTIONS:
    double safeDivide(double a, double b) {
        if (b == 0.0) {
            throw std::invalid_argument("Division by zero");
        }
        return a / b;
    }

    // 4. EXCEPTION SPECIFICATIONS (deprecated in C++17):
    // void oldStyleFunction() throw(std::runtime_error) {
    //     throw std::runtime_error("Error");
    // }

    // Modern C++: use noexcept
    void noThrowFunction() noexcept {
        // This function promises not to throw
        // If it does throw, std::terminate is called
    }
};

// 5. CUSTOM EXCEPTION CLASSES:
class CalculatorException : public std::exception {
private:
    std::string message_;
    
public:
    explicit CalculatorException(const std::string& message) 
        : message_(message) {}
    
    const char* what() const noexcept override {
        return message_.c_str();
    }
};

class DivisionByZeroException : public CalculatorException {
public:
    DivisionByZeroException() 
        : CalculatorException("Division by zero is not allowed") {}
};

class InvalidInputException : public CalculatorException {
public:
    explicit InvalidInputException(const std::string& details) 
        : CalculatorException("Invalid input: " + details) {}
};

// 6. ENHANCED CALCULATOR WITH EXCEPTION HANDLING:
class SafeCalculator : public Calculator {
public:
    void validateInputs(double a, double b) const {
        if (std::isnan(a) || std::isnan(b)) {
            throw InvalidInputException("NaN values are not allowed");
        }
        if (std::isinf(a) || std::isinf(b)) {
            throw InvalidInputException("Infinite values are not allowed");
        }
    }

    double safeAdd(double a, double b) {
        try {
            validateInputs(a, b);
            return add(a, b);
        }
        catch (const InvalidInputException&) {
            throw; // Re-throw
        }
        catch (...) {
            throw std::runtime_error("Unknown error in addition");
        }
    }

    double safeDivide(double a, double b) {
        validateInputs(a, b);
        if (b == 0.0) {
            throw DivisionByZeroException();
        }
        
        double result = a / b;
        if (std::isinf(result)) {
            throw std::overflow_error("Division result is infinite");
        }
        return result;
    }
};

// 7. RESOURCE MANAGEMENT WITH EXCEPTIONS (RAII):
class FileHandler {
private:
    std::ifstream file_;
    std::string filename_;

public:
    explicit FileHandler(const std::string& filename) 
        : filename_(filename) {
        file_.open(filename);
        if (!file_.is_open()) {
            throw std::runtime_error("Could not open file: " + filename);
        }
    }
    
    // Destructor automatically closes file (RAII)
    ~FileHandler() {
        if (file_.is_open()) {
            file_.close();
        }
    }
    
    std::string readLine() {
        std::string line;
        if (!std::getline(file_, line)) {
            throw std::runtime_error("Could not read from file: " + filename_);
        }
        return line;
    }
};

// 8. SMART POINTERS AND EXCEPTION SAFETY:
class MemoryExample {
public:
    void unsafeMemoryHandling() {
        int* ptr = new int(42);
        try {
            // Some operation that might throw
            riskyOperation();
            delete ptr; // This might not be called if exception is thrown
        }
        catch (...) {
            delete ptr; // Need to manually clean up
            throw;
        }
    }
    
    void safeMemoryHandling() {
        std::unique_ptr<int> ptr = std::make_unique<int>(42);
        try {
            // Some operation that might throw
            riskyOperation();
            // ptr automatically cleaned up
        }
        catch (...) {
            // ptr automatically cleaned up even if exception occurs
            throw;
        }
    }

private:
    void riskyOperation() {
        throw std::runtime_error("Something went wrong");
    }
};

// 9. EXCEPTION SAFETY LEVELS:
class ExceptionSafetyExample {
public:
    // Basic exception safety: no resource leaks
    void basicSafety() {
        std::vector<int> vec;
        try {
            vec.push_back(1);
            riskyOperation();
            vec.push_back(2);
        }
        catch (...) {
            // Vector is in valid but unspecified state
            // No resource leaks
        }
    }
    
    // Strong exception safety: commit or rollback
    void strongSafety() {
        std::vector<int> original = data_;
        try {
            data_.push_back(1);
            riskyOperation();
            data_.push_back(2);
        }
        catch (...) {
            data_ = original; // Rollback to original state
            throw;
        }
    }
    
    // No-throw guarantee
    void noThrowOperation() noexcept {
        // This function guarantees it won't throw
        try {
            // Even if this throws, we catch it
            riskyOperation();
        }
        catch (...) {
            // Handle error without throwing
        }
    }

private:
    std::vector<int> data_;
    
    void riskyOperation() {
        throw std::runtime_error("Error");
    }
};

// 10. NESTED EXCEPTION HANDLING:
void nestedExceptionExample() {
    try {
        try {
            throw std::runtime_error("Inner exception");
        }
        catch (const std::runtime_error& e) {
            std::cout << "Caught inner: " << e.what() << std::endl;
            throw std::logic_error("Outer exception");
        }
    }
    catch (const std::logic_error& e) {
        std::cout << "Caught outer: " << e.what() << std::endl;
    }
}

// 11. FUNCTION TRY BLOCKS (for constructors):
class ConstructorExceptionExample {
private:
    std::unique_ptr<int> data_;
    
public:
    ConstructorExceptionExample(int value) 
    try : data_(std::make_unique<int>(value)) {
        if (value < 0) {
            throw std::invalid_argument("Negative values not allowed");
        }
    }
    catch (const std::bad_alloc&) {
        // Handle memory allocation failure
        throw std::runtime_error("Could not allocate memory");
    }
    catch (const std::invalid_argument&) {
        // Handle invalid argument
        throw; // Re-throw
    }
};

// 12. EXCEPTION HANDLING IN DESTRUCTORS:
class DestructorExample {
public:
    ~DestructorExample() {
        try {
            // Cleanup operations
            performCleanup();
        }
        catch (...) {
            // Never let exceptions escape from destructors
            // Log error but don't throw
            std::cerr << "Error during cleanup" << std::endl;
        }
    }

private:
    void performCleanup() {
        // Cleanup code that might throw
    }
};

// 13. STACK UNWINDING DEMONSTRATION:
class StackUnwindingExample {
public:
    StackUnwindingExample(const std::string& name) : name_(name) {
        std::cout << "Constructing " << name_ << std::endl;
    }
    
    ~StackUnwindingExample() {
        std::cout << "Destructing " << name_ << std::endl;
    }

private:
    std::string name_;
};

void demonstrateStackUnwinding() {
    try {
        StackUnwindingExample obj1("Object1");
        StackUnwindingExample obj2("Object2");
        
        throw std::runtime_error("Exception thrown");
        
        StackUnwindingExample obj3("Object3"); // Never constructed
    }
    catch (const std::exception& e) {
        std::cout << "Caught: " << e.what() << std::endl;
        // obj2 and obj1 destructors called during stack unwinding
    }
}

// 14. ERROR HANDLING UTILITY FUNCTIONS:
template<typename T>
class Result {
private:
    bool success_;
    T value_;
    std::string error_;

public:
    Result(T value) : success_(true), value_(std::move(value)) {}
    Result(std::string error) : success_(false), error_(std::move(error)) {}
    
    bool isSuccess() const { return success_; }
    const T& getValue() const { 
        if (!success_) throw std::runtime_error("No value in error result");
        return value_; 
    }
    const std::string& getError() const { return error_; }
};

Result<double> safeCalculation(double a, double b, char op) {
    try {
        switch (op) {
            case '+': return Result<double>(a + b);
            case '-': return Result<double>(a - b);
            case '*': return Result<double>(a * b);
            case '/': 
                if (b == 0) return Result<double>("Division by zero");
                return Result<double>(a / b);
            default: 
                return Result<double>("Unknown operation");
        }
    }
    catch (const std::exception& e) {
        return Result<double>(std::string("Error: ") + e.what());
    }
}

/*
 * C++ EXCEPTION HANDLING BEST PRACTICES:
 * 
 * 1. Use RAII for resource management
 * 2. Catch exceptions by const reference
 * 3. Use specific exception types
 * 4. Don't throw exceptions from destructors
 * 5. Use noexcept for functions that don't throw
 * 6. Prefer smart pointers for automatic cleanup
 * 7. Implement proper exception safety levels
 * 8. Use standard exception classes when appropriate
 * 9. Provide strong exception safety when possible
 * 10. Handle exceptions at appropriate levels
 * 
 * EXCEPTION SAFETY LEVELS:
 * 1. No-throw guarantee: Function never throws
 * 2. Strong guarantee: Commit or rollback semantics
 * 3. Basic guarantee: No resource leaks, valid state
 * 4. No guarantee: Anything can happen
 * 
 * COMMON STANDARD EXCEPTIONS:
 * - std::invalid_argument: Invalid function argument
 * - std::out_of_range: Index out of bounds
 * - std::runtime_error: Runtime condition error
 * - std::logic_error: Programming logic error
 * - std::bad_alloc: Memory allocation failure
 * - std::overflow_error: Arithmetic overflow
 * - std::underflow_error: Arithmetic underflow
 * 
 * MEMORY MANAGEMENT:
 * - Use smart pointers (unique_ptr, shared_ptr)
 * - Follow RAII principles
 * - Avoid raw pointers for ownership
 * - Use containers instead of raw arrays
 * - Implement proper copy/move semantics
 */

