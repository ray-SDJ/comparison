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

if __name__ == "__main__":
    main()

Python Methods Cheatsheet for Strings, Lists, and Objects
String Methods
text = "Hello, World!"




Method
Description
Example



len()
Returns length of string
len(text) → 13


lower()
Converts to lowercase
text.lower() → "hello, world!"


upper()
Converts to uppercase
text.upper() → "HELLO, WORLD!"


strip()
Removes leading/trailing whitespace
"  hi  ".strip() → "hi"


lstrip()
Removes leading whitespace
"  hi".lstrip() → "hi"


rstrip()
Removes trailing whitespace
"hi  ".rstrip() → "hi"


replace(old, new)
Replaces all occurrences of old with new
text.replace("World", "Python") → "Hello, Python!"


split(sep)
Splits string into list based on separator
text.split(", ") → ["Hello", "World!"]


join(iterable)
Joins elements with string as separator
", ".join(["a", "b"]) → "a, b"


startswith(prefix)
Checks if string starts with prefix
text.startswith("Hello") → True


endswith(suffix)
Checks if string ends with suffix
text.endswith("!") → True


find(sub)
Returns lowest index of substring (or -1)
text.find("World") → 7


rfind(sub)
Returns highest index of substring (or -1)
text.rfind("o") → 8


index(sub)
Like find(), but raises ValueError if not found
text.index("World") → 7


count(sub)
Counts occurrences of substring
text.count("l") → 3


isalnum()
Checks if all characters are alphanumeric
"Hello123".isalnum() → True


isalpha()
Checks if all characters are alphabetic
"Hello".isalpha() → True


isdigit()
Checks if all characters are digits
"123".isdigit() → True


title()
Capitalizes first letter of each word
"hello world".title() → "Hello World"


capitalize()
Capitalizes first letter, lowers rest
"hello".capitalize() → "Hello"


List Methods
my_list = [1, 2, 3, 4]




Method
Description
Example



len()
Returns length of list
len(my_list) → 4


append(item)
Adds item to end of list
my_list.append(5) → [1, 2, 3, 4, 5]


extend(iterable)
Adds elements from iterable to list
my_list.extend([6, 7]) → [1, 2, 3, 4, 5, 6, 7]


insert(index, item)
Inserts item at index
my_list.insert(1, 1.5) → [1, 1.5, 2, 3, 4]


pop([index])
Removes and returns item at index (default: last)
my_list.pop() → 4, my_list → [1, 2, 3]


remove(item)
Removes first occurrence of item
my_list.remove(2) → [1, 3]


clear()
Removes all items
my_list.clear() → []


index(item)
Returns index of first occurrence of item
[1, 2, 3].index(2) → 1


count(item)
Counts occurrences of item
[1, 2, 2, 3].count(2) → 2


sort()
Sorts list in place
[3, 1, 2].sort() → [1, 2, 3]


reverse()
Reverses list in place
[1, 2, 3].reverse() → [3, 2, 1]


copy()
Returns shallow copy of list
my_list.copy() → [1, 2, 3, 4]


Additional List Operations

Slicing: my_list[start:end:step] → e.g., my_list[1:3] → [2, 3]
List Comprehension: [x*2 for x in my_list] → [2, 4, 6, 8]
Built-in Functions:
sorted(my_list): Returns sorted copy
min(my_list), max(my_list): Returns min/max value
sum(my_list): Sums numeric elements



Object Methods
All Python objects inherit from object. Key methods:
obj = object()




Method
Description
Example



__str__()
Returns string representation (human-readable)
str(obj) → "<object object at ...>"


__repr__()
Returns detailed string representation (developer)
repr(obj) → "<object object at ...>"


__eq__(other)
Defines equality comparison (==)
obj == obj → True


__hash__()
Returns hash value for object
hash(obj) → int


__init__(self, ...)
Constructor for custom classes
def __init__(self): ...


__len__()
Defines behavior for len()
Custom: len(obj) → int


__getitem__(key)
Defines behavior for indexing (obj[key])
Custom: obj[0] → value


__setitem__(key, value)
Defines behavior for assignment (obj[key] = value)
Custom: obj[0] = value


__delitem__(key)
Defines behavior for deletion (del obj[key])
Custom: del obj[0]


__iter__()
Makes object iterable
Custom: for x in obj: ...


Special Notes

Override these methods in custom classes for specific behavior.
__str__ is used by print(); __repr__ is used in interactive shells.
Use isinstance(obj, type) to check object type.

Best Practices

Strings: Use join() for concatenation; prefer f-strings for formatting.
Lists: Use list comprehensions for concise transformations; prefer copy() for safe copying.
Objects: Define __str__ and __repr__ for debugging; implement __eq__ and __hash__ together for hashable objects.

Example Usage
# String
text = "Hello, World!"
print(text.upper())  # HELLO, WORLD!
print(text.split(", "))  # ['Hello', 'World!']

# List
my_list = [1, 2, 3]
my_list.append(4)
print(my_list)  # [1, 2, 3, 4]
print(my_list[1:3])  # [2, 3]

# Custom Object
class MyClass:
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return f"MyClass({self.value})"

obj = MyClass(42)
print(obj)  # MyClass(42)
print(isinstance(obj, MyClass))  # True

