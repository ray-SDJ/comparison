# File Handling Tutorial in Python
# Writing to a file
with open('example.txt', 'w') as f:
    f.write('Hello, world!\n')

# Reading from a file
with open('example.txt', 'r') as f:
    content = f.read()
    print('File content:', content)

# A simple calculator program to demonstrate Python program structure
# here is how we import the modules
import math
from abc import ABC, abstractmethod

# Interface-like abstract class (Python uses ABC for interfaces)
class MathOperations(ABC):
    @abstractmethod
    def perform_operation(self, a: float, b: float) -> float:
        """Abstract method that must be implemented by subclasses"""
        pass

    @abstractmethod
    def get_operation_name(self) -> str:
        """Abstract method that must be implemented by subclasses"""
        pass

# Abstract base class
class AbstractCalculator(ABC):
    def __init__(self, calc_type: str):
        """
        Protected member (_calc_type) - by convention, single underscore
        indicates protected access
        """
        self._calc_type = calc_type
        
    @abstractmethod
    def get_result(self) -> float:
        """Abstract method that must be implemented by subclasses"""
        pass

# Main Calculator class implementing inheritance and interfaces
class Calculator(AbstractCalculator, MathOperations):
    def __init__(self):
        """
        Private members (double underscore) - name mangling in Python
        provides weak privacy
        """
        super().__init__("Basic Calculator")
        self.__result = 0
        self.__operations_performed = 0
        self.__operation_name = ""

    # Implementation of abstract method
    def get_result(self) -> float:
        return self.__result

    # Implementation of interface methods
    def perform_operation(self, a: float, b: float) -> float:
        return self.add(a, b)

    def get_operation_name(self) -> str:
        return self.__operation_name

    # Property decorator - Pythonic way of implementing getters
    @property
    def operations_performed(self) -> int:
        return self.__operations_performed

    # Instance methods
    def add(self, a: float, b: float) -> float:
        self.__result = a + b
        self.__operations_performed += 1
        self.__operation_name = "Addition"
        return self.__result

    def subtract(self, a: float, b: float) -> float:
        self.__result = a - b
        self.__operations_performed += 1
        self.__operation_name = "Subtraction"
        return self.__result

    def multiply(self, a: float, b: float) -> float:
        self.__result = a * b
        self.__operations_performed += 1
        self.__operation_name = "Multiplication"
        return self.__result

    def divide(self, a: float, b: float) -> str:
        self.__operations_performed += 1
        self.__operation_name = "Division"
        if b == 0:
            return "Error: Cannot divide by zero"
        self.__result = a / b
        return str(self.__result)

"""
Python OOP Concepts Demonstrated:

1. Classes:
   - Blueprint for objects (Calculator class)
   - Abstract base classes (AbstractCalculator)
   - Multiple inheritance supported

2. Objects:
   - Instances of classes
   - Created using constructor (__init__)
   - Have attributes and methods

3. Encapsulation:
   - Private attributes (__result)
   - Protected attributes (_calc_type)
   - Properties (@property)
   - Method encapsulation

4. Inheritance:
   - Using class Parent(Base)
   - Multiple inheritance
   - super() for parent class access

5. Abstraction:
   - ABC (Abstract Base Classes)
   - @abstractmethod decorator
   - Interface-like contracts

6. Access Modifiers:
   - Private (double underscore)
   - Protected (single underscore)
   - Public (no underscore)

7. Special Methods:
   - __init__ constructor
   - Properties
   - Type hints

Key Python-Specific Features:
- Duck typing
- Multiple inheritance
- Name mangling for privacy
- Decorators for properties
- Type hints for clarity
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 
            print("3. Multiply")
            print("4. Divide")
            print("5. Exit")
            
            choice = input("Enter your choice (1-5): ")
            
            if choice == "5":
                print("Goodbye!")
                break
                
            if choice not in ["1", "2", "3", "4"]:
                raise ValueError("Invalid choice. Please enter 1-5.")
            
            num1 = float(input("Enter first number: "))
            num2 = float(input("Enter second number: "))
            
            if choice == "1":
                result = calc.add(num1, num2)
            elif choice == "2":
                result = calc.subtract(num1, num2)
            elif choice == "3":
                result = calc.multiply(num1, num2)
            elif choice == "4":
                if num2 == 0:
                    raise ZeroDivisionError("Cannot divide by zero")
                result = calc.divide(num1, num2)
            
            print(f"Result: {result}")
            
        except ValueError as e:
            print(f"Input Error: {e}")
        except ZeroDivisionError as e:
            print(f"Math Error: {e}")
        except KeyboardInterrupt:
            print("\nOperation cancelled by user")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()

"""
PYTHON ERROR AND EXCEPTION HANDLING - CONCEPTS EXPLAINED

WHAT ARE EXCEPTIONS IN PYTHON?
Exceptions are events that occur during program execution that disrupt the normal
flow of the program. In Python, when an error occurs, an exception object is created
and the normal flow of the program is interrupted.

WHY USE EXCEPTION HANDLING?
1. Prevent program crashes from unexpected errors
2. Provide meaningful error messages to users
3. Allow programs to recover from error conditions
4. Separate error handling logic from main program logic
5. Enable graceful cleanup of resources
6. Make debugging easier by providing error context

PYTHON'S EXCEPTION HANDLING PHILOSOPHY:
Python follows the EAFP principle: "Easier to Ask for Forgiveness than Permission"
This means it's often better to try an operation and handle exceptions than to
check if the operation is valid beforehand.

EAFP vs LBYL (Look Before You Leap):
EAFP (Pythonic): try/except blocks
LBYL (Non-Pythonic): if/else checks before operations

EXCEPTION HIERARCHY IN PYTHON:
All exceptions inherit from BaseException. The common base class for most
exceptions is Exception. Here's the hierarchy:

BaseException
 ├── SystemExit (sys.exit() calls)
 ├── KeyboardInterrupt (Ctrl+C)
 ├── GeneratorExit (generator/coroutine cleanup)
 └── Exception (most user-defined exceptions inherit from this)
     ├── ArithmeticError
     │   ├── ZeroDivisionError
     │   ├── OverflowError
     │   └── FloatingPointError
     ├── LookupError
     │   ├── IndexError (list index out of range)
     │   └── KeyError (dictionary key not found)
     ├── ValueError (right type, wrong value)
     ├── TypeError (wrong type)
     ├── AttributeError (object has no attribute)
     ├── NameError (name not defined)
     ├── ImportError (module import failed)
     ├── IOError/OSError (input/output operations)
     └── RuntimeError (general runtime error)

TRY-EXCEPT-ELSE-FINALLY STRUCTURE EXPLAINED:

TRY BLOCK: Contains code that might raise an exception
EXCEPT BLOCK: Handles specific types of exceptions
ELSE BLOCK: Runs only if no exception occurred in try block
FINALLY BLOCK: Always runs, used for cleanup

Flow of execution:
1. Code in try block executes
2. If exception occurs, jump to matching except block
3. If no exception, else block executes (if present)
4. Finally block always executes
5. Program continues after the structure

Python uses try-except-else-finally blocks for exception handling.
All exceptions inherit from BaseException, with Exception being the
most common base class for user-defined exceptions.
"""

# Example usage
def main():
    calc = Calculator()
    print(calc.add(5, 3))        # 8
    print(calc.operations_performed)  # 1
    # print(calc.__result)       # AttributeError - private attribute

# Example usage with error handling
def main():
    calc = Calculator()
    
    try:
        print(calc.add(5, 3))        # 8
        print(calc.operations_performed)  # 1
        # Demonstrate error handling
        result = calc.divide(10, 0)
        print(result)
    except Exception as e:
        print(f"Error occurred: {e}")

# Enhanced calculator with error handling
def calculator_with_error_handling():
    calc = Calculator()
    
    while True:
        try:
            print("\nCalculator Menu:")
            print("1. Add")
            print("2. Subtract") 