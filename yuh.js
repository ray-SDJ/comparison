// Interface-like contract (JavaScript doesn't have true interfaces)
// We can use JSDoc to document expected methods
/**
 * @interface
 */
class MathOperations {
    performOperation(a, b) { throw new Error('Must implement performOperation'); }
    getOperationName() { throw new Error('Must implement getOperationName'); }
}

// Abstract base class - using ES6+ classes
class AbstractCalculator {
    // Protected members can be simulated using symbols or naming conventions
    // Prefix with _ to indicate "private" (by convention)
    constructor(type) {
        if (this.constructor === AbstractCalculator) {
            throw new Error('Abstract classes cannot be instantiated');
        }
        this._calculatorType = type;
    }

    // Abstract method
    getResult() {
        throw new Error('Method getResult() must be implemented');
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
        super('Basic Calculator');
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
        this.#operationName = 'Addition';
        return this.#result;
    }

    subtract(a, b) {
        this.#result = a - b;
        this.#operationsPerformed++;
        this.#operationName = 'Subtraction';
        return this.#result;
    }

    multiply(a, b) {
        this.#result = a * b;
        this.#operationsPerformed++;
        this.#operationName = 'Multiplication';
        return this.#result;
    }

    divide(a, b) {
        this.#operationsPerformed++;
        this.#operationName = 'Division';
        if (b === 0) {
            return 'Error: Cannot divide by zero';
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
console.log(calc.add(5, 3));        // 8
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


JavaScript Methods Cheatsheet for Strings, Arrays, and Objects
String Methods
let str = "Hello, World!";




Method
Description
Example



length
Returns length of string
str.length → 13


toLowerCase()
Converts to lowercase
str.toLowerCase() → "hello, world!"


toUpperCase()
Converts to uppercase
str.toUpperCase() → "HELLO, WORLD!"


trim()
Removes leading/trailing whitespace
"  hi  ".trim() → "hi"


trimStart()
Removes leading whitespace
"  hi".trimStart() → "hi"


trimEnd()
Removes trailing whitespace
"hi  ".trimEnd() → "hi"


slice(start, end)
Extracts substring
str.slice(7, 12) → "World"


substring(start, end)
Extracts substring (end not included)
str.substring(7, 12) → "World"


replace(search, replacement)
Replaces first match
str.replace("World", "JS") → "Hello, JS!"


replaceAll(search, replacement)
Replaces all matches
str.replaceAll("l", "p") → "Heppo, Worpd!"


split(separator)
Splits string into array
str.split(", ") → ["Hello", "World!"]


includes(search)
Checks if string contains search
str.includes("World") → true


startsWith(search)
Checks if string starts with search
str.startsWith("Hello") → true


endsWith(search)
Checks if string ends with search
str.endsWith("!") → true


indexOf(search)
Returns index of first match (or -1)
str.indexOf("World") → 7


lastIndexOf(search)
Returns index of last match (or -1)
str.lastIndexOf("o") → 8


charAt(index)
Returns character at index
str.charAt(0) → "H"


match(regex)
Returns array of regex matches
str.match(/o/g) → ["o", "o"]


repeat(count)
Repeats string count times
str.repeat(2) → "Hello, World!Hello, World!"


padStart(targetLength, padString)
Pads start with string
"5".padStart(2, "0") → "05"


padEnd(targetLength, padString)
Pads end with string
"5".padEnd(2, "0") → "50"


Array Methods
let arr = [1, 2, 3, 4];




Method
Description
Example



length
Returns number of elements
arr.length → 4


push(...items)
Adds items to end
arr.push(5) → [1, 2, 3, 4, 5]


pop()
Removes and returns last item
arr.pop() → 4, arr → [1, 2, 3]


shift()
Removes and returns first item
arr.shift() → 1, arr → [2, 3]


unshift(...items)
Adds items to start
arr.unshift(0) → [0, 1, 2, 3]


slice(start, end)
Returns copy of portion
arr.slice(1, 3) → [2, 3]


splice(start, deleteCount, ...items)
Removes/adds elements
arr.splice(1, 1, 1.5) → [2], arr → [1, 1.5, 3, 4]


concat(...arrays)
Merges arrays
arr.concat([5, 6]) → [1, 2, 3, 4, 5, 6]


join(separator)
Joins elements into string
arr.join(", ") → "1, 2, 3, 4"


includes(item)
Checks if array contains item
arr.includes(2) → true


indexOf(item)
Returns index of first occurrence (or -1)
arr.indexOf(2) → 1


lastIndexOf(item)
Returns index of last occurrence (or -1)
arr.lastIndexOf(2) → 1


forEach(callback)
Executes callback for each element
arr.forEach(x => console.log(x)) → logs 1, 2, 3, 4


map(callback)
Creates new array with callback results
arr.map(x => x * 2) → [2, 4, 6, 8]


filter(callback)
Creates new array with elements passing test
arr.filter(x => x > 2) → [3, 4]


reduce(callback, initialValue)
Reduces array to single value
arr.reduce((sum, x) => sum + x, 0) → 10


find(callback)
Returns first element passing test
arr.find(x => x > 2) → 3


findIndex(callback)
Returns index of first element passing test
arr.findIndex(x => x > 2) → 2


sort([compareFn])
Sorts array in place
arr.sort((a, b) => a - b) → [1, 2, 3, 4]


reverse()
Reverses array in place
arr.reverse() → [4, 3, 2, 1]


every(callback)
Checks if all elements pass test
arr.every(x => x > 0) → true


some(callback)
Checks if any element passes test
arr.some(x => x > 3) → true


Object Methods
JavaScript objects are key-value pairs. Common methods and properties:
let obj = { name: "Alice", age: 25 };




Method/Property
Description
Example



Object.keys(obj)
Returns array of keys
Object.keys(obj) → ["name", "age"]


Object.values(obj)
Returns array of values
Object.values(obj) → ["Alice", 25]


Object.entries(obj)
Returns array of [key, value] pairs
Object.entries(obj) → [["name", "Alice"], ["age", 25]]


Object.assign(target, ...sources)
Copies properties to target
Object.assign({}, obj, { age: 26 }) → { name: "Alice", age: 26 }


Object.hasOwnProperty(prop)
Checks if object has own property
obj.hasOwnProperty("name") → true


Object.defineProperty(obj, prop, descriptor)
Defines property
Object.defineProperty(obj, "id", { value: 1 }) → adds id: 1


Object.freeze(obj)
Prevents modifications
Object.freeze(obj) → obj is immutable


Object.seal(obj)
Prevents adding/removing properties
Object.seal(obj) → properties can be modified, but not added/removed


toString()
Returns string representation
obj.toString() → "[object Object]"


__proto__
Accesses prototype (use with caution)
obj.__proto__ → Object.prototype


Prototype Methods
Objects inherit
