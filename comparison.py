# comparing Python, Javascript, Typescript, C++, Java, Bash

# VARIABLES
# Python
a = 5
# JavaScript
let a = 5;
# TypeScript
let a: number = 5;
# C++
int a = 5;
# Java
int a = 5;
# Bash
a=5

# PRINTING
# Python
print(a)
# JavaScript
console.log(a);
# TypeScript
console.log(a);
# C++
std::cout << a << "\n";
# Java
System.out.println(a);
# Bash
echo $a

# STRINGS
# Python
text = "hello world"
# JavaScript
const text = "hello world";
# TypeScript
const text: string = "hello world";
# C++
std::string text = "hello world";
# Java
String text = "hello world";
# Bash
text="hello world"

# DATA TYPES
# TypeScript
let num: number = 5;
let isTrue: boolean = true;
let anything: any = "hello world";
let decimal: number = 5.5;

# Java
int num = 5;
boolean isTrue = true;
String text = "hello world";
double decimal = 5.5;
char yuh = 'y';

# C++
int num = 5;
bool isTrue = true;
std::string text = "hello world";
double decimal = 5.5;

# Bash
num=5
isTrue=true
text="hello world"
decimal=5.5

# CONDITIONALS
# Python
if a == 5:
    print("a is 5")

# JavaScript/TypeScript
if (a === 5) {
    console.log("a is 5");
}

# C++
if (a == 5) {
    std::cout << "a is 5" << std::endl;
}

# Java
if (a == 5) {
    System.out.println("a is 5");
}

# Bash
if [ "$a" -eq 5 ]; then
    echo "a is 5"
fi

# LOOPS
# Python
for i in range(5):
    print(i)

# JavaScript/TypeScript
for (let i = 0; i < 5; i++) {
    console.log(i);
}

# C++
for (int i = 0; i < 5; i++) {
    std::cout << i << std::endl;
}

# Java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}

# Bash
for ((i=0; i<5; i++)); do
    echo "$i"
done

# ARRAYS/LISTS 
# Python
arr = [1, 2, 3, 4, 5]

# JavaScript
const arr = [1, 2, 3, 4, 5];

# TypeScript
const arr: number[] = [1, 2, 3, 4, 5];

# C++
std::vector<int> arr = {1, 2, 3, 4, 5};

# Java
int[] arr = {1, 2, 3, 4, 5};
List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

# Bash
arr=(1 2 3 4 5)

# ARRAY OPERATIONS
# Python
arr.append(6)
arr.pop(1)
arr.sort()
arr.reverse()

# JavaScript/TypeScript
arr.push(6);
arr.splice(1, 1);
arr.sort();
arr.reverse();

# C++
arr.push_back(6);
arr.erase(arr.begin() + 1);
std::sort(arr.begin(), arr.end());
std::reverse(arr.begin(), arr.end());

# Java
list.add(6);
list.remove(1);
Collections.sort(list);
Collections.reverse(list);


# Bash
arr+=("6")
unset 'arr[1]'
IFS=$'\n' sorted=($(sort <<<"${arr[*]}"))
arr=($(for ((i=${#arr[@]}-1; i>=0; i--)); do echo "${arr[i]}"; done))

# FUNCTIONS
# Python
def greet(name):
    print(f"Hello, {name}")

# JavaScript/TypeScript
function greet(name) {
    console.log(`Hello, ${name}`);
}

# C++
void greet(std::string name) {
    std::cout << "Hello, " << name << std::endl;
}

# Java
public void greet(String name) {
    System.out.println("Hello, " + name);
}

# Bash
greet() {
    echo "Hello, $1"
}

# DICTIONARIES/OBJECTS
# Python
person = {"name": "John", "age": 30}

# JavaScript
const person = {name: "John", age: 30};

# TypeScript
interface Person {
    name: string;
    age: number;
}
const person: Person = {name: "John", age: 30};

# C++
std::map<std::string, std::variant<std::string, int>> person = {
    {"name", "John"},
    {"age", 30}
};

# Java
Map<String, Object> person = new HashMap<>();
person.put("name", "John");
person.put("age", 30);

# Bash
declare -A person
person=([name]="John" [age]=30)

# CLASSES
# Python
class Person:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
    
    def greet(self):
        print(f"Hello, my name is {self.name}")

# JavaScript/TypeScript
class Person {
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hello, my name is ${this.name}`);
    }
}

# C++
class Person {
private:
    std::string name;
    int age;

public:
    Person(std::string name, int age) : name(name), age(age) {}
    
    void greet() {
        std::cout << "Hello, my name is " << name << std::endl;
    }
};

# Java
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

# Bash
# Note: Bash doesn't support true OOP, but you can simulate it
Person() {
    local name=$1
    local age=$2
    echo "function greet() { echo 'Hello, my name is $name'; }"
}

# STRING CONCATENATION
# Python
str1 = "Hello"
str2 = "World"
result = str1 + " " + str2        # Basic concatenation
result = f"{str1} {str2}"         # f-string (Python 3.6+)
result = "{} {}".format(str1, str2)  # format method
result = "%s %s" % (str1, str2)   # %-formatting (older style)

# JavaScript/TypeScript
let str1 = "Hello";
let str2 = "World";
result = str1 + " " + str2;       # Basic concatenation
result = `${str1} ${str2}`;       # Template literal
result = [str1, str2].join(" ");  # Array join method

# Java
String str1 = "Hello";
String str2 = "World";
result = str1 + " " + str2;                     # Basic concatenation
result = String.format("%s %s", str1, str2);    # String.format
result = str1.concat(" ").concat(str2);         # concat method
result = new StringBuilder()                    # StringBuilder
    .append(str1)
    .append(" ")
    .append(str2)
    .toString();

int a = 5; // Example of a variable in Java
int b = 10; // Example of a variable in Java
String result = "the results are: " + (a + b); //if you are adding two variables together in Java, you can use the + operator to concatenate the string with the result of the addition,if the variables are numbers if you have to put parenthesis around the,
// This will output: "the results are: 15"


# C++
std::string str1 = "Hello";
std::string str2 = "World";
result = str1 + " " + str2;                    # Basic concatenation
result = str1.append(" ").append(str2);        # append method
std::stringstream ss;                          # stringstream
ss << str1 << " " << str2;
result = ss.str();

# Bash
str1="Hello"
str2="World"
result="$str1 $str2"              # Variable expansion
result="${str1} ${str2}"          # Parameter expansion
result=$str1" "$str2              # Basic concatenation
printf -v result "%s %s" "$str1" "$str2"  # printf with -v flag

# STRING METHODS
# Python
text = "Hello World"
length = len(text)                # Get length
upper = text.upper()              # Convert to uppercase
lower = text.lower()              # Convert to lowercase
stripped = text.strip()           # Remove whitespace
replaced = text.replace("o", "x") # Replace characters
split_text = text.split(" ")      # Split into list
found = text.find("World")        # Find substring (returns index)
contains = "Hello" in text        # Check if contains
sub = text[0:5]                   # Substring (slice)

# JavaScript/TypeScript
let text = "Hello World";
length = text.length;             // Get length
upper = text.toUpperCase();       // Convert to uppercase
lower = text.toLowerCase();       // Convert to lowercase
trimmed = text.trim();           // Remove whitespace
replaced = text.replace("o", "x"); // Replace characters
split_text = text.split(" ");     // Split into array
found = text.indexOf("World");    // Find substring (returns index)
contains = text.includes("Hello"); // Check if contains
sub = text.substring(0, 5);       // Substring

# Java
String text = "Hello World";
char = text.charAt(0);         // Get character at index 0
length = text.length();           // Get length
upper = text.toUpperCase();       // Convert to uppercase
lower = text.toLowerCase();       // Convert to lowercase
trimmed = text.trim();           // Remove whitespace
replaced = text.replace("o", "x"); // Replace characters
split_text = text.split(" ");     // Split into array
found = text.indexOf("World");    // Find substring (returns index)
contains = text.contains("Hello"); // Check if contains
sub = text.substring(0, 5);       // Substring
contains = text.contains("Hello"); // Check if contains

# C++
std::string text = "Hello World";
length = text.length();           // Get length
// Need algorithm header for these
std::transform(text.begin(), text.end(), text.begin(), ::toupper); // Uppercase
std::transform(text.begin(), text.end(), text.begin(), ::tolower); // Lowercase
// Need regex for trim
replaced = std::regex_replace(text, std::regex("o"), "x"); // Replace
found = text.find("World");      // Find substring (returns position)
contains = text.find("Hello") != std::string::npos; // Check if contains
sub = text.substr(0, 5);         // Substring

# Bash
text="Hello World"
length=${#text}                   # Get length
upper=${text^^}                  # Convert to uppercase
lower=${text,,}                  # Convert to lowercase
trimmed="${text#"${text%%[![:space:]]*}"}" # Remove leading whitespace
trimmed="${trimmed%"${trimmed##*[![:space:]]}"}" # Remove trailing whitespace
replaced=${text//o/x}            # Replace characters
IFS=' ' read -ra split_text <<< "$text" # Split into array
[[ $text == *"Hello"* ]]        # Check if contains
sub=${text:0:5}                 # Substring

# OPERATORS
# Arithmetic Operators (same in Python, JavaScript/TypeScript, Java, C++)
# Python, JavaScript/TypeScript, Java, C++
a + b    # Addition
a - b    # Subtraction
a * b    # Multiplication
a / b    # Division
a % b    # Modulus
a ** b   # Exponentiation (Python, JavaScript)
a // b   # Floor Division (Python only)
pow(a,b) # Power (Java, C++)

# Bash Arithmetic
((a + b))   # Addition
((a - b))   # Subtraction
((a * b))   # Multiplication
((a / b))   # Division (integer)
((a % b))   # Modulus
((a ** b))  # Exponentiation
$((a / b))  # Command substitution form

# Comparison Operators
# Python
==    # Equal to
!=    # Not equal to
>     # Greater than
<     # Less than
>=    # Greater than or equal to
<=    # Less than or equal to

# JavaScript/TypeScript
===   # Strict equal to
!==   # Strict not equal to
==    # Equal to (loose)
!=    # Not equal to (loose)
>     # Greater than
<     # Less than
>=    # Greater than or equal to
<=    # Less than or equal to

# Java/C++
==    # Equal to
!=    # Not equal to
>     # Greater than
<     # Less than
>=    # Greater than or equal to
<=    # Less than or equal to

# Bash
-eq   # Equal to
-ne   # Not equal to
-gt   # Greater than
-lt   # Less than
-ge   # Greater than or equal to
-le   # Less than or equal to
==    # String equal to
!=    # String not equal to

# Logical Operators
# Python
and    # Logical AND
or     # Logical OR
not    # Logical NOT

# JavaScript/TypeScript/Java/C++
&&     # Logical AND
||     # Logical OR
!      # Logical NOT

# Bash
&&     # Logical AND
||     # Logical OR
!      # Logical NOT
-a     # AND in test conditions
-o     # OR in test conditions

# Assignment Operators
# Python, JavaScript/TypeScript, Java, C++
=      # Simple assignment
+=     # Add and assign
-=     # Subtract and assign
*=     # Multiply and assign
/=     # Divide and assign
%=     # Modulus and assign

# Bash
=      # Simple assignment
((a += b))  # Add and assign
((a -= b))  # Subtract and assign
((a *= b))  # Multiply and assign
((a /= b))  # Divide and assign
((a %= b))  # Modulus and assign

# Bitwise Operators (Python, JavaScript/TypeScript, Java, C++)
&      # Bitwise AND
|      # Bitwise OR
^      # Bitwise XOR
~      # Bitwise NOT
<<     # Left shift
>>     # Right shift

# Bash Bitwise
((a & b))   # Bitwise AND
((a | b))   # Bitwise OR
((a ^ b))   # Bitwise XOR
((~a))      # Bitwise NOT
((a << b))  # Left shift
((a >> b))  # Right shift