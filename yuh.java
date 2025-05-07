// A simple calculator program to demonstrate Java program structure
import java.util.Scanner;

class Calculator {
    private double result;

    public Calculator() {
        this.result = 0;
    }

    public double add(double a, double b) {
        return a + b;
    }

    public double subtract(double a, double b) {
        return a - b;
    }

    public double multiply(double a, double b) {
        return a * b;
    }

    public String divide(double a, double b) {
        if (b == 0) {
            return "Error: Cannot divide by zero";
        }
        return String.valueOf(a / b);
    }
}

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
        }
        scanner.close();
    }
}

Java Methods Cheatsheet for Strings, Arrays, and Objects
String Methods
String str = "Hello, World!";




Method
Description
Example



length()
Returns the length of the string
str.length() → 13


charAt(int index)
Returns the character at the specified index
str.charAt(0) → 'H'


substring(int begin)
Returns a substring from begin index to end
str.substring(7) → "World!"


substring(int begin, int end)
Returns a substring from begin to end index
str.substring(0, 5) → "Hello"


toLowerCase()
Converts string to lowercase
str.toLowerCase() → "hello, world!"


toUpperCase()
Converts string to uppercase
str.toUpperCase() → "HELLO, WORLD!"


trim()
Removes leading/trailing whitespace
"  hi  ".trim() → "hi"


replace(char old, char new)
Replaces all occurrences of old char with new
str.replace('l', 'p') → "Heppo, Worpd!"


replaceAll(String regex, String replacement)
Replaces matches of regex with replacement
str.replaceAll("World", "Java") → "Hello, Java!"


contains(CharSequence s)
Checks if string contains the specified sequence
str.contains("World") → true


startsWith(String prefix)
Checks if string starts with prefix
str.startsWith("Hello") → true


endsWith(String suffix)
Checks if string ends with suffix
str.endsWith("!") → true


indexOf(String str)
Returns index of first occurrence of str
str.indexOf("o") → 4


lastIndexOf(String str)
Returns index of last occurrence of str
str.lastIndexOf("o") → 8


split(String regex)
Splits string into array based on regex
str.split(", ")[0] → "Hello"


equals(Object obj)
Compares string with another for equality
str.equals("Hello, World!") → true


equalsIgnoreCase(String another)
Case-insensitive comparison
str.equalsIgnoreCase("hello, world!") → true


isEmpty()
Checks if string is empty
str.isEmpty() → false


Array Methods
int[] arr = {1, 2, 3, 4, 5};




Method/Operation
Description
Example



length
Returns the size of the array
arr.length → 5


Arrays.toString(arr)
Converts array to string
Arrays.toString(arr) → "[1, 2, 3, 4, 5]"


Arrays.sort(arr)
Sorts array in ascending order
Arrays.sort(arr) → [1, 2, 3, 4, 5]


Arrays.binarySearch(arr, key)
Searches for key in sorted array
Arrays.binarySearch(arr, 3) → 2


Arrays.copyOf(arr, newLength)
Copies array to new length
Arrays.copyOf(arr, 3) → [1, 2, 3]


Arrays.copyOfRange(arr, from, to)
Copies range of array
Arrays.copyOfRange(arr, 1, 4) → [2, 3, 4]


Arrays.fill(arr, value)
Fills array with specified value
Arrays.fill(arr, 0) → [0, 0, 0, 0, 0]


Arrays.equals(arr1, arr2)
Compares two arrays for equality
Arrays.equals(arr, new int[]{1,2,3,4,5}) → true


System.arraycopy(src, srcPos, dest, destPos, length)
Copies elements from one array to another
System.arraycopy(arr, 0, newArr, 0, 3) → [1, 2, 3]


ArrayList Methods (java.util.ArrayList)
ArrayList<Integer> list = new ArrayList<>();




Method
Description
Example



add(E element)
Adds element to list
list.add(1) → [1]


add(int index, E element)
Adds element at index
list.add(0, 2) → [2, 1]


get(int index)
Returns element at index
list.get(0) → 2


set(int index, E element)
Replaces element at index
list.set(0, 3) → [3, 1]


remove(int index)
Removes element at index
list.remove(0) → [1]


size()
Returns list size
list.size() → 1


clear()
Removes all elements
list.clear() → []


contains(Object o)
Checks if list contains element
list.contains(1) → true


toArray()
Converts list to array
list.toArray() → [1]


Object Methods
All classes inherit from java.lang.Object. Key methods:
Object obj = new Object();




Method
Description
Example



toString()
Returns string representation of object
obj.toString() → "java.lang.Object@..."


equals(Object obj)
Compares object with another for equality
obj.equals(new Object()) → false


hashCode()
Returns hash code of object
obj.hashCode() → int value


getClass()
Returns runtime class of object
obj.getClass() → class java.lang.Object


clone()
Creates a copy of object (if Cloneable)
obj.clone() → new Object (if implemented)


finalize()
Called by garbage collector (deprecated)
Rarely used


wait()
Causes thread to wait until notified
obj.wait() → pauses thread


notify()
Wakes up a single waiting thread
obj.notify() → resumes thread


notifyAll()
Wakes up all waiting threads
obj.notifyAll() → resumes all threads


Best Practices

Strings: Use StringBuilder for heavy string manipulation; prefer equals() over ==.
Arrays: Use Arrays utility class for common operations; consider ArrayList for dynamic sizing.
Objects: Override toString(), equals(), and hashCode() for custom classes; use getClass() for type checking.

Example Usage
public class Example {
    public static void main(String[] args) {
        // String
        String str = "Hello, World!";
        System.out.println(str.toUpperCase()); // HELLO, WORLD!
        System.out.println(str.substring(7)); // World!

        // Array
        int[] arr = {5, 2, 8, 1};
        Arrays.sort(arr);
        System.out.println(Arrays.toString(arr)); // [1, 2, 5, 8]

        // ArrayList
        ArrayList<String> list = new ArrayList<>();
        list.add("Java");
        list.add("Python");
        System.out.println(list.get(0)); // Java

        // Object
        Object obj = new Object();
        System.out.println(obj.toString()); // java.lang.Object@...
    }
}

