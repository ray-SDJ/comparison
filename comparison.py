# comparing Python, Javascript, Typescript, C++, Java, Bash

################################
# PYTHON CHEATSHEET
################################
# Variables and Data Types
a = 5
num = 5
isTrue = True
text = "hello world"
decimal = 5.5

# Output
print(a)

# Strings and String Operations
str1 = "Hello"
str2 = "World"
result = str1 + " " + str2        # Basic concatenation
result = f"{str1} {str2}"         # f-string
result = "{} {}".format(str1, str2)  # format method

# String Methods
text = "Hello World"
length = len(text)
upper = text.upper()
lower = text.lower()
stripped = text.strip()
split_text = text.split(" ")
found = text.find("World")
contains = "Hello" in text

# Lists and Operations
arr = [1, 2, 3, 4, 5]
arr.append(6)
arr.pop(1)
arr.sort()
arr.reverse()

# Dictionaries
person = {"name": "John", "age": 30}

# Control Flow
if a == 5:
    print("a is 5")

for i in range(5):
    print(i)

match value:  # Python 3.10+
    case 1:
        print("One")
    case _:
        print("Other")

# Functions
def greet(name):
    print(f"Hello, {name}")

# Classes
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
    
    def greet(self):
        print(f"Hello, my name is {self.name}")

################################
# JAVASCRIPT/TYPESCRIPT CHEATSHEET
################################
# Variables and Data Types
let a = 5;
let num: number = 5;              // TypeScript
let isTrue: boolean = true;
const text: string = "hello world";
let decimal: number = 5.5;

# Output
console.log(a);

# Strings and String Operations
let str1 = "Hello";
let str2 = "World";
result = str1 + " " + str2;
result = `${str1} ${str2}`;       // Template literal

# Arrays and Operations
const arr: number[] = [1, 2, 3, 4, 5];
arr.push(6);
arr.splice(1, 1);
arr.sort();
arr.reverse();

# Objects/Interfaces
interface Person {
    name: string;
    age: number;
}
const person: Person = {name: "John", age: 30};

# Control Flow
if (a === 5) {
    console.log("a is 5");
}

for (let i = 0; i < 5; i++) {
    console.log(i);
}

switch (value) {
    case 1:
        console.log("One");
        break;
    default:
        console.log("Other");
}

# Functions
function greet(name: string) {
    console.log(`Hello, ${name}`);
}

# Classes
class Person {
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

################################
# JAVA CHEATSHEET
################################
# Variables and Data Types
int a = 5;
boolean isTrue = true;
String text = "hello world";
double decimal = 5.5;
char ch = 'a';

# Output
System.out.println(a);

# Strings and String Operations
String str1 = "Hello";
String str2 = "World";
String result = str1 + " " + str2;                 // Basic concatenation
result = String.format("%s %s", str1, str2);       // String.format
result = str1.concat(" ").concat(str2);            // concat method
result = new StringBuilder()                       // StringBuilder
    .append(str1)
    .append(" ")
    .append(str2)
    .toString();

# String Methods
String text = "Hello World";
char ch = text.charAt(0);                          // Get character at index
int length = text.length();                        // Get length
String upper = text.toUpperCase();                 // To uppercase
String lower = text.toLowerCase();                 // To lowercase
String trimmed = text.trim();                      // Remove whitespace
String[] split = text.split(" ");                  // Split into array
int found = text.indexOf("World");                 // Find substring
boolean contains = text.contains("Hello");         // Check if contains
String sub = text.substring(0, 5);                 // Substring

# Arrays and Operations
int[] arr = {1, 2, 3, 4, 5};
List<Integer> list = new ArrayList<>();
list.add(6);                                       // Add element
list.remove(1);                                    // Remove at index
Collections.sort(list);                            // Sort
Collections.reverse(list);                         // Reverse

# Control Flow
if (a == 5) {
    System.out.println("a is 5");
}

for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

# Functions
public void greet(String name) {
    System.out.println("Hello, " + name);
}

# Classes
public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void greet() {
        System.out.println("Hello, my name is " + name);
    }
}

################################
# C++ CHEATSHEET
################################
# Variables and Data Types
int a = 5;
bool isTrue = true;
std::string text = "hello world";
double decimal = 5.5;
char ch = 'a';

# Output
std::cout << a << std::endl;

# Strings and String Operations
std::string str1 = "Hello";
std::string str2 = "World";
std::string result = str1 + " " + str2;           // Basic concatenation
result = str1.append(" ").append(str2);           // append method

# String Methods
std::string text = "Hello World";
size_t length = text.length();                    // Get length
std::transform(text.begin(), text.end(),          // To uppercase
              text.begin(), ::toupper);
std::string sub = text.substr(0, 5);              // Substring
size_t found = text.find("World");                // Find substring

# Arrays and Vectors
std::vector<int> vec = {1, 2, 3, 4, 5};
vec.push_back(6);                                 // Add element
vec.erase(vec.begin() + 1);                       // Remove at index
std::sort(vec.begin(), vec.end());                // Sort
std::reverse(vec.begin(), vec.end());             // Reverse

# Control Flow
if (a == 5) {
    std::cout << "a is 5" << std::endl;
}

for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}

# Functions
void greet(std::string name) {
    std::cout << "Hello, " << name << std::endl;
}

# Classes
class Person {
private:
    std::string name;
    int age;
    
public:
    Person(std::string n, int a) : name(n), age(a) {}
    
    void greet() {
        std::cout << "Hello, my name is " << name << std::endl;
    }
};

################################
# BASH CHEATSHEET
################################
# Variables and Data Types
name="John"
age=30
decimal=5.5

# Output
echo $name
printf "%s is %d years old\n" "$name" "$age"

# Strings and String Operations
str1="Hello"
str2="World"
result="$str1 $str2"                              # Variable expansion
result="${str1} ${str2}"                          # Parameter expansion

# String Methods
text="Hello World"
length=${#text}                                   # Get length
upper=${text^^}                                   # To uppercase
lower=${text,,}                                   # To lowercase
sub=${text:0:5}                                   # Substring

# Arrays
arr=(1 2 3 4 5)
arr+=("6")                                        # Add element
unset 'arr[1]'                                    # Remove element
arr=($(for i in "${arr[@]}"; do echo $i; done | sort))  # Sort

# Control Flow
if [ "$age" -eq 30 ]; then
    echo "Age is 30"
fi

for i in {0..4}; do
    echo "$i"
done

# Functions
greet() {
    local name="$1"
    echo "Hello, $name"
}