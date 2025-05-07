#include <iostream>
#include <string>

class Calculator {
private:
    double result;

public:
    Calculator() : result(0) {}

    double add(double a, double b) {
        return a + b;
    }

    double subtract(double a, double b) {
        return a - b;
    }

    double multiply(double a, double b) {
        return a * b;
    }

    std::string divide(double a, double b) {
        if (b == 0) {
            return "Error: Cannot divide by zero";
        }
        return std::to_string(a / b);
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
        printMenu();
        std::cout << "Enter your choice (1-5): ";
        std::getline(std::cin, choice);

        if (choice == "5") {
            std::cout << "Goodbye!" << std::endl;
            break;
        }

        std::cout << "Enter first number: ";
        std::cin >> num1;
        std::cout << "Enter second number: ";
        std::cin >> num2;
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
            std::cout << "Result: " << calc.divide(num1, num2) << std::endl;
        }
        else {
            std::cout << "Invalid choice!" << std::endl;
        }
    }

    return 0;
}


C++ Methods Cheatsheet for Strings, Arrays, and Objects
String Methods (std::string)
#include <string>
std::string str = "Hello, World!";




Method
Description
Example



length() / size()
Returns length of string
str.length() → 13


empty()
Checks if string is empty
str.empty() → false


clear()
Removes all characters
str.clear() → ""


append(str)
Appends string
str.append("!") → "Hello, World!!"


push_back(char)
Appends single character
str.push_back('!') → "Hello, World!!"


pop_back()
Removes last character
str.pop_back() → "Hello, World"


substr(pos, len)
Returns substring
str.substr(7, 5) → "World"


find(str)
Returns index of first occurrence (or string::npos)
str.find("World") → 7


rfind(str)
Returns index of last occurrence (or string::npos)
str.rfind("o") → 8


replace(pos, len, str)
Replaces portion with new string
str.replace(7, 5, "C++") → "Hello, C++!"


at(index)
Accesses character at index (with bounds checking)
str.at(0) → 'H'


operator[]
Accesses character at index (no bounds checking)
str[0] → 'H'


c_str()
Returns C-style string (const char*)
str.c_str() → "Hello, World!"


compare(str)
Compares strings (0 if equal)
str.compare("Hello, World!") → 0


erase(pos, len)
Removes characters
str.erase(5, 2) → "HelloWorld!"


insert(pos, str)
Inserts string at position
str.insert(5, ",") → "Hello,, World!"


Array/Vector Methods (std::vector for dynamic arrays)
#include <vector>
std::vector<int> vec = {1, 2, 3, 4};




Method
Description
Example



size()
Returns number of elements
vec.size() → 4


empty()
Checks if vector is empty
vec.empty() → false


push_back(item)
Adds element to end
vec.push_back(5) → {1, 2, 3, 4, 5}


pop_back()
Removes last element
vec.pop_back() → {1, 2, 3}


front()
Returns reference to first element
vec.front() → 1


back()
Returns reference to last element
vec.back() → 3


at(index)
Accesses element with bounds checking
vec.at(1) → 2


operator[]
Accesses element (no bounds checking)
vec[1] → 2


clear()
Removes all elements
vec.clear() → {}


insert(iterator, value)
Inserts element at iterator position
vec.insert(vec.begin() + 1, 1.5) → {1, 1.5, 2, 3, 4}


erase(iterator)
Removes element at iterator
vec.erase(vec.begin()) → {2, 3, 4}


resize(n)
Changes size (adds/removes elements)
vec.resize(2) → {1, 2}


reserve(n)
Reserves capacity for n elements
vec.reserve(10) → capacity ≥ 10


capacity()
Returns current capacity
vec.capacity() → int


Static Array (std::array for fixed-size arrays)
#include <array>
std::array<int, 4> arr = {1, 2, 3, 4};




Method
Description
Example



size()
Returns number of elements
arr.size() → 4


empty()
Checks if array is empty
arr.empty() → false


front()
Returns reference to first element
arr.front() → 1


back()
Returns reference to last element
arr.back() → 4


at(index)
Accesses element with bounds checking
arr.at(1) → 2


operator[]
Accesses element (no bounds checking)
arr[1] → 2


fill(value)
Fills array with value
arr.fill(0) → {0, 0, 0, 0}


Algorithm Library (for arrays/vectors)
#include <algorithm>


std::sort(vec.begin(), vec.end()): Sorts vector
std::find(vec.begin(), vec.end(), value): Finds element
std::reverse(vec.begin(), vec.end()): Reverses vector
std::copy(src.begin(), src.end(), dest.begin()): Copies elements

Object Methods
C++ objects are instances of classes/structs. Common methods are user-defined, but all objects can use:
class MyClass {
public:
    int value;
    MyClass(int v) : value(v) {}
};
MyClass obj(42);




Feature
Description
Example



Constructor
Initializes object
MyClass obj(42);


Destructor
Cleans up object
~MyClass() {}


Member Functions
Custom methods
int getValue() { return value; }


Operator Overloading
Customizes operators
bool operator==(const MyClass& other) { return value == other.value; }


this Pointer
Refers to current object
this->value → 42


Standard Object Methods (via inheritance or overloading)

Copy Constructor: MyClass(const MyClass& other)
Move Constructor: MyClass(MyClass&& other)
Assignment Operator: MyClass& operator=(const MyClass& other)
Comparison Operators: operator==, operator<, etc.
to_string(): Often user-defined for string representation

Best Practices

Strings: Use std::string over C-style strings; prefer at() for safe access.
Arrays/Vectors: Use std::vector for dynamic arrays; std::array for fixed-size; check bounds with at().
Objects: Define copy/move constructors and assignment operators for resource management; use const for methods that don’t modify state.

Example Usage
#include <iostream>
#include <string>
#include <vector>
#include <array>

int main() {
    // String
    std::string str = "Hello, World!";
    std::cout << str.substr(7) << std::endl; // World!
    str.replace(7, 5, "C++");
    std::cout << str << std::endl; // Hello, C++!

    // Vector
    std::vector<int> vec = {5, 2, 3};
    vec.push_back(4);
    std::sort(vec.begin(), vec.end());
    for (int x : vec) std::cout << x << " "; // 2 3 4 5
    std::cout << std::endl;

    // Array
    std::array<int, 3> arr = {1, 2, 3};
    arr.fill(0);
    std::cout << arr[0] << std::endl; // 0

    // Object
    class MyClass {
    public:
        int value;
        MyClass(int v) : value(v) {}
        std::string to_string() const { return std::to_string(value); }
    };
    MyClass obj(42);
    std::cout << obj.to_string() << std::endl; // 42

    return 0;
}

