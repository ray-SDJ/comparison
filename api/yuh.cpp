# C++ API Tutorial - Complete Guide

## Table of Contents
1. [Setup and Dependencies](#setup-and-dependencies)
2. [Basic API Structure](#basic-api-structure)
3. [Complete Code Example](#complete-code-example)
4. [Line-by-Line Explanation](#line-by-line-explanation)
5. [How to Compile and Run](#how-to-compile-and-run)
6. [Testing Your API](#testing-your-api)
7. [Advanced Features](#advanced-features)

## Setup and Dependencies

### 1. Required Libraries
For this tutorial, we'll use modern C++ with these libraries:
- **cpp-httplib**: Lightweight HTTP server library
- **nlohmann/json**: JSON parsing and generation
- **SQLite3**: Embedded database
- **CMake**: Build system

### 2. CMakeLists.txt
```cmake
cmake_minimum_required(VERSION 3.16)
project(CppApiServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find packages
find_package(PkgConfig REQUIRED)
pkg_check_modules(SQLITE3 REQUIRED sqlite3)

# Add executable
add_executable(api_server
    main.cpp
    user.cpp
    user_service.cpp
    user_controller.cpp
    database.cpp
)

# Link libraries
target_link_libraries(api_server ${SQLITE3_LIBRARIES})
target_include_directories(api_server PRIVATE ${SQLITE3_INCLUDE_DIRS})

# Download and include cpp-httplib
include(FetchContent)
FetchContent_Declare(
    httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG v0.14.0
)
FetchContent_MakeAvailable(httplib)

# Download and include nlohmann/json
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)

target_link_libraries(api_server httplib::httplib nlohmann_json::nlohmann_json)
```

## Complete Code Example

### 1. User Entity (`user.h`)

```cpp
#ifndef USER_H
#define USER_H

#include <string>
#include <optional>
#include <nlohmann/json.hpp>

class User {
private:
    std::optional<int> id;
    std::string name;
    std::string email;
    int age;

public:
    // Constructors
    User() = default;
    User(const std::string& name, const std::string& email, int age);
    User(int id, const std::string& name, const std::string& email, int age);

    // Getters
    std::optional<int> getId() const { return id; }
    const std::string& getName() const { return name; }
    const std::string& getEmail() const { return email; }
    int getAge() const { return age; }

    // Setters
    void setId(int id) { this->id = id; }
    void setName(const std::string& name) { this->name = name; }
    void setEmail(const std::string& email) { this->email = email; }
    void setAge(int age) { this->age = age; }

    // JSON serialization
    nlohmann::json toJson() const;
    static User fromJson(const nlohmann::json& json);

    // Validation
    bool isValid() const;
};

## Detailed Line-by-Line Explanation for User Class Header

### Class Declaration Analysis

```cpp
#ifndef USER_H
#define USER_H
```
**Lines 58-59**: Header guard to prevent multiple inclusion. Ensures this header is only included once per compilation unit, preventing redefinition errors.

```cpp
#include <string>
#include <optional>
#include <nlohmann/json.hpp>
```
**Lines 61-63**: Include statements for required dependencies:
- `<string>`: For std::string class
- `<optional>`: For std::optional template (C++17 feature)
- `<nlohmann/json.hpp>`: Third-party JSON library for serialization

```cpp
class User {
private:
    std::optional<int> id;
    std::string name;
    std::string email;
    int age;
```
**Lines 65-70**: Class definition with private member variables:
- `std::optional<int> id`: Optional ID (can be empty for new users)
- `std::string name`: User's name (managed string)
- `std::string email`: User's email address
- `int age`: User's age (primitive type)

### Constructor Declarations

```cpp
public:
    // Constructors
    User() = default;
```
**Lines 72-74**: Default constructor explicitly requested. `= default` tells compiler to generate the default constructor automatically.

```cpp
User(const std::string& name, const std::string& email, int age);
```
**Line 75**: Constructor for new users (without ID). Takes const references to avoid unnecessary copying of string parameters.

```cpp
User(int id, const std::string& name, const std::string& email, int age);
```
**Line 76**: Constructor for existing users (with database ID). Used when loading users from database.

### Getter Methods Analysis

```cpp
// Getters
std::optional<int> getId() const { return id; }
```
**Line 79**: Inline getter for ID. Returns optional since new users don't have IDs. `const` qualifier ensures method doesn't modify object state.

```cpp
const std::string& getName() const { return name; }
const std::string& getEmail() const { return email; }
```
**Lines 80-81**: String getters returning const references. Avoids copying strings while preventing modification of returned values.

```cpp
int getAge() const { return age; }
```
**Line 82**: Age getter returning by value (int is cheap to copy). `const` method ensures no state modification.

### Setter Methods Analysis

```cpp
// Setters
void setId(int id) { this->id = id; }
```
**Line 85**: ID setter that assigns to the optional. `this->` disambiguates between parameter and member variable.

```cpp
void setName(const std::string& name) { this->name = name; }
void setEmail(const std::string& email) { this->email = email; }
```
**Lines 86-87**: String setters taking const references. Efficient assignment without unnecessary copying.

```cpp
void setAge(int age) { this->age = age; }
```
**Line 88**: Age setter with parameter by value (int is cheap to copy).

### Method Declarations

```cpp
// JSON serialization
nlohmann::json toJson() const;
static User fromJson(const nlohmann::json& json);
```
**Lines 91-92**: JSON serialization methods. `toJson()` is const instance method, `fromJson()` is static factory method.

```cpp
// Validation
bool isValid() const;
```
**Line 95**: Validation method declaration. `const` because validation doesn't modify the object.

```cpp
#endif // USER_H
```
**Line 98**: End of header guard, matching the opening `#ifndef USER_H`.

#endif // USER_H
```

### 2. User Implementation (`user.cpp`)

```cpp
#include "user.h"
#include <regex>

User::User(const std::string& name, const std::string& email, int age)
    : name(name), email(email), age(age) {}

User::User(int id, const std::string& name, const std::string& email, int age)
    : id(id), name(name), email(email), age(age) {}

nlohmann::json User::toJson() const {
    nlohmann::json json;
    if (id.has_value()) {
        json["id"] = id.value();
    }
    json["name"] = name;
    json["email"] = email;
    json["age"] = age;
    return json;
}

User User::fromJson(const nlohmann::json& json) {
    User user;
    if (json.contains("id") && !json["id"].is_null()) {
        user.setId(json["id"]);
    }
    user.setName(json["name"]);
    user.setEmail(json["email"]);
    user.setAge(json["age"]);
    return user;
}

bool User::isValid() const {
    // Name validation
    if (name.empty() || name.length() > 100) {
        return false;
    }

    // Email validation
    std::regex email_regex(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
    if (!std::regex_match(email, email_regex)) {
        return false;
    }

    // Age validation
    if (age < 0 || age > 150) {
        return false;
    }

    return true;
}

## Detailed Line-by-Line Explanation for User Class Implementation

### JSON Serialization Method Analysis

```cpp
nlohmann::json User::toJson() const {
```
**Line 96**: Method declaration with `const` qualifier, meaning this method doesn't modify the User object. Returns `nlohmann::json` object containing serialized user data.

```cpp
nlohmann::json json;
```
**Line 97**: Creates an empty JSON object using the nlohmann/json library. This will be populated with user data and returned.

```cpp
if (id.has_value()) {
    json["id"] = id.value();
}
```
**Lines 98-100**: Checks if the optional ID has a value using `has_value()`. If true, extracts the actual ID value with `value()` and assigns it to the "id" field in JSON. This handles the case where new users don't have IDs yet.

```cpp
json["name"] = name;
json["email"] = email;
json["age"] = age;
```
**Lines 101-103**: Direct assignment of member variables to JSON fields. The nlohmann/json library automatically handles type conversion from C++ types (string, int) to JSON types.

```cpp
return json;
```
**Line 104**: Returns the populated JSON object. The compiler uses move semantics to efficiently return the object without unnecessary copying.

### JSON Deserialization Method Analysis

```cpp
User User::fromJson(const nlohmann::json& json) {
```
**Line 107**: Static method that takes a const reference to JSON object and returns a new User instance. Static because it creates a User rather than modifying an existing one.

```cpp
User user;
```
**Line 108**: Creates a new User object using the default constructor. All fields will be initialized to their default values.

```cpp
if (json.contains("id") && !json["id"].is_null()) {
    user.setId(json["id"]);
}
```
**Lines 109-111**: Safely checks if JSON contains "id" field AND if it's not null. This prevents exceptions when parsing JSON that might not have an ID (for new users). Uses setter method to assign the value.

```cpp
user.setName(json["name"]);
user.setEmail(json["email"]);
user.setAge(json["age"]);
```
**Lines 112-114**: Direct extraction of values from JSON fields. The nlohmann/json library automatically converts JSON types to C++ types. If fields are missing, this will throw an exception.

```cpp
return user;
```
**Line 115**: Returns the populated User object. Move semantics optimize this return operation.

### Input Validation Method Analysis

```cpp
bool User::isValid() const {
```
**Line 118**: Validation method that returns boolean indicating whether the User object contains valid data. `const` because validation doesn't modify the object.

```cpp
// Name validation
if (name.empty() || name.length() > 100) {
    return false;
}
```
**Lines 119-122**: Name validation with two conditions:
- `name.empty()`: Checks if string is empty (length 0)
- `name.length() > 100`: Enforces maximum length constraint
- Returns `false` immediately if either condition fails (early return pattern)

```cpp
// Email validation
std::regex email_regex(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
if (!std::regex_match(email, email_regex)) {
    return false;
}
```
**Lines 124-128**: Email validation using regular expressions:
- `std::regex email_regex(...)`: Creates a regex pattern for valid email format
- `R"(...)"`: Raw string literal to avoid escaping backslashes in regex
- `[a-zA-Z0-9._%+-]+`: Matches username part (one or more allowed characters)
- `@`: Literal @ symbol
- `[a-zA-Z0-9.-]+`: Matches domain name part
- `\.[a-zA-Z]{2,}`: Matches domain extension (dot followed by 2+ letters)
- `std::regex_match()`: Returns true if entire string matches the pattern
- `!`: Negation - returns false if email doesn't match pattern

```cpp
// Age validation
if (age < 0 || age > 150) {
    return false;
}
```
**Lines 130-133**: Age validation with range checking:
- `age < 0`: Prevents negative ages (business rule)
- `age > 150`: Sets reasonable upper limit for human age
- Logical OR (`||`) means either condition triggers validation failure

```cpp
return true;
```
**Line 135**: If all validation checks pass, returns true indicating the User object is valid.

### Key C++ Features Demonstrated

#### 1. Optional Type Handling
```cpp
std::optional<int> id;  // Can be empty or contain an int
if (id.has_value()) {   // Safe checking
    json["id"] = id.value();  // Safe extraction
}
```
**HOW optionals work:**
- `std::optional<T>` can either contain a value of type T or be empty
- `has_value()` safely checks if value is present
- `value()` extracts the contained value (throws if empty)
- Prevents null pointer dereferencing common in C-style code

#### 2. Const Correctness
```cpp
nlohmann::json User::toJson() const {  // Method doesn't modify object
const nlohmann::json& json             // Parameter won't be modified
```
**HOW const correctness works:**
- `const` methods can be called on const objects
- Compiler enforces that const methods don't modify member variables
- `const&` parameters avoid copying and prevent modification
- Enables compiler optimizations and prevents bugs

#### 3. Move Semantics
```cpp
return json;  // Compiler automatically uses move semantics
return user;  // No expensive copying
```
**HOW move semantics work:**
- C++11 feature that transfers ownership instead of copying
- Automatically applied for return values (RVO - Return Value Optimization)
- Dramatically improves performance for expensive-to-copy objects
- `std::move()` can explicitly request move semantics

#### 4. Raw String Literals
```cpp
std::regex email_regex(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
```
**HOW raw strings work:**
- `R"(...)"` syntax avoids escaping backslashes and quotes
- Particularly useful for regex patterns and file paths
- Content between `"(` and `)"` is treated literally
- Makes complex patterns more readable and maintainable

#### 5. Exception Safety
```cpp
User User::fromJson(const nlohmann::json& json) {
    // If any assignment throws, stack unwinding cleans up automatically
    user.setName(json["name"]);  // May throw if "name" key missing
}
```
**HOW exception safety works:**
- RAII ensures automatic cleanup when exceptions occur
- Stack objects automatically destroyed if exception thrown
- No memory leaks even with exceptions
- Strong exception safety guarantee where possible

#### 6. Type Safety and Automatic Conversions
```cpp
json["age"] = age;           // int → JSON number
int age = json["age"];       // JSON number → int
```
**HOW type conversions work:**
- nlohmann/json library provides automatic type conversions
- Compile-time type checking prevents many runtime errors
- Throws exceptions for invalid conversions (e.g., string to int)
- Much safer than C-style casting or manual parsing

This implementation demonstrates modern C++ best practices including type safety, resource management, performance optimization, and defensive programming techniques.

## 🤔 WHY - Design Decisions and Rationale

### Why Use std::optional<int> for ID?

```cpp
std::optional<int> id;
```

**WHY this design choice:**

1. **Represents Reality**: In real applications, new entities don't have database IDs until they're saved
2. **Type Safety**: Prevents using uninitialized or invalid ID values (like -1 or 0)
3. **API Clarity**: Makes it explicit when an ID might not exist
4. **Null Safety**: Eliminates null pointer dereference bugs common with raw pointers
5. **Modern C++**: Uses C++17 features for better expressiveness

**Alternative approaches and why they're inferior:**
- Using `int id = -1`: Magic numbers are unclear and error-prone
- Using `int* id`: Requires manual memory management and null checking
- Using `boost::optional`: Adds external dependency when standard library provides solution

### Why Use const References in Getters?

```cpp
const std::string& getName() const { return name; }
```

**WHY this pattern:**

1. **Performance**: Avoids copying potentially large strings
2. **Memory Efficiency**: No temporary objects created
3. **Immutability**: `const` return prevents accidental modification
4. **Method Const**: Second `const` allows calling on const objects
5. **Compiler Optimization**: Enables better optimization opportunities

**WHY not return by value:**
```cpp
std::string getName() const { return name; }  // Creates unnecessary copy
```
- **Performance Cost**: Every call creates a full string copy
- **Memory Overhead**: Temporary strings consume additional memory
- **Cache Inefficiency**: More memory allocations stress the CPU cache

### Why Use const References in Setters?

```cpp
void setName(const std::string& name) { this->name = name; }
```

**WHY this approach:**

1. **Efficiency**: Avoids copying parameter during function call
2. **Safety**: `const` prevents accidental modification of parameter
3. **Flexibility**: Accepts both lvalues and rvalues
4. **Standard Practice**: Follows established C++ conventions
5. **Assignment Operator**: Relies on std::string's optimized assignment

**WHY not pass by value:**
```cpp
void setName(std::string name) { this->name = name; }  // Unnecessary copy
```
- **Double Copy**: Copy during call + copy during assignment
- **Performance Hit**: Especially bad for large strings
- **Memory Pressure**: Creates unnecessary temporary objects

### Why Static Factory Method for JSON Deserialization?

```cpp
static User fromJson(const nlohmann::json& json);
```

**WHY static instead of constructor:**

1. **Named Constructor**: `fromJson` is more descriptive than `User(json)`
2. **Error Handling**: Can validate JSON before object creation
3. **Flexibility**: Can handle missing or invalid fields gracefully
4. **Single Responsibility**: Separates JSON parsing from object construction
5. **Extensibility**: Easy to add more factory methods (fromXML, fromCSV, etc.)

**WHY not a constructor:**
```cpp
User(const nlohmann::json& json);  // Less clear intent
```
- **Unclear Purpose**: Not obvious it's for JSON parsing
- **Exception Handling**: Harder to provide meaningful error messages
- **Future Conflicts**: What if you need fromXML constructor later?

### Why Regular Expression for Email Validation?

```cpp
std::regex email_regex(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
```

**WHY regex validation:**

1. **Comprehensive**: Handles most valid email formats
2. **Standard Approach**: Industry-standard method for email validation
3. **Maintainable**: Pattern is clearly visible and modifiable
4. **Performance**: Compiled once, used multiple times
5. **Readable**: Raw string literal makes pattern clear

**WHY not simpler checks:**
```cpp
return email.find('@') != std::string::npos;  // Too simple
```
- **Insufficient**: Allows invalid emails like "@" or "a@@b"
- **Security Risk**: Could lead to data corruption or injection attacks
- **User Experience**: Users get confusing error messages

### Why RAII Pattern for Resource Management?

```cpp
class Database {
    sqlite3* db;
public:
    Database() { /* acquire */ }
    ~Database() { /* release */ }
};
```

**WHY RAII (Resource Acquisition Is Initialization):**

1. **Exception Safety**: Resources automatically cleaned up if exceptions occur
2. **Deterministic**: Resources released immediately when object goes out of scope
3. **No Memory Leaks**: Compiler enforces proper cleanup
4. **Thread Safety**: Each thread's stack handles its own cleanup
5. **Maintainable**: No need to remember manual cleanup calls

**WHY not manual management:**
```cpp
Database* db = new Database();
// ... use db
delete db;  // Easy to forget!
```
- **Memory Leaks**: Forgetting `delete` causes resource leaks
- **Exception Unsafe**: Exceptions skip cleanup code
- **Error Prone**: Manual tracking of resource lifetime

### Why Smart Pointers (std::unique_ptr)?

```cpp
std::unique_ptr<Database> database;
```

**WHY unique_ptr:**

1. **Ownership Clarity**: Makes ownership semantics explicit
2. **Automatic Cleanup**: Destructor called automatically
3. **Move Semantics**: Efficient transfer of ownership
4. **Exception Safe**: RAII guarantees cleanup
5. **Performance**: Zero-overhead abstraction over raw pointers

**WHY not raw pointers:**
```cpp
Database* database;  // Who owns this? When to delete?
```
- **Unclear Ownership**: Not obvious who should delete
- **Memory Leaks**: Easy to forget deletion
- **Double Delete**: Deleting twice causes undefined behavior
- **Exception Unsafe**: Cleanup code might be skipped

### Why Layered Architecture?

```
Controller → Service → Repository → Database
```

**WHY this separation:**

1. **Single Responsibility**: Each layer has one clear purpose
2. **Testability**: Can mock dependencies for unit testing
3. **Maintainability**: Changes isolated to specific layers
4. **Reusability**: Business logic can be used by different controllers
5. **Scalability**: Easy to add caching, logging, or other cross-cutting concerns

**WHY not monolithic approach:**
```cpp
class UserController {
    void createUser() {
        // HTTP parsing
        // Business validation
        // Database operations
        // Response generation
    }
};
```
- **Tight Coupling**: Hard to change one aspect without affecting others
- **Untestable**: Difficult to unit test individual pieces
- **Code Duplication**: Same logic repeated across different endpoints
- **Complex**: Single methods become very large and hard to understand

### Why Exception-Based Error Handling?

```cpp
try {
    auto json = nlohmann::json::parse(req.body);
    // ... process
} catch (const std::exception& e) {
    sendErrorResponse(res, 400, "Invalid JSON");
}
```

**WHY exceptions:**

1. **Separation of Concerns**: Normal flow separate from error handling
2. **Automatic Propagation**: Errors bubble up automatically
3. **Resource Safety**: RAII ensures cleanup during stack unwinding
4. **Rich Information**: Exception objects can carry detailed error info
5. **Standard Library**: Integrates well with STL and third-party libraries

**WHY not error codes:**
```cpp
ErrorCode result = parseJson(req.body);
if (result != SUCCESS) {
    // handle error
    return;
}
```
- **Verbose**: Every operation needs explicit error checking
- **Error Prone**: Easy to forget checking return values
- **Complex Flow**: Normal logic mixed with error handling
- **Resource Leaks**: Manual cleanup in error paths

### Why Modern C++ Features (C++17)?

**WHY use modern C++:**

1. **std::optional**: Expressive null safety
2. **Auto keyword**: Reduces verbosity, improves maintainability
3. **Range-based loops**: Cleaner iteration syntax
4. **Smart pointers**: Automatic memory management
5. **Move semantics**: Better performance with fewer copies

**WHY not stick to C++98/03:**
- **Verbose**: Much more boilerplate code required
- **Error Prone**: Manual memory management leads to bugs
- **Performance**: Missing optimizations like move semantics
- **Maintainability**: Code is harder to read and understand
- **Industry Standard**: Modern C++ is expected in professional development

### Why JSON for API Communication?

**WHY JSON over other formats:**

1. **Ubiquitous**: Supported by virtually every programming language
2. **Human Readable**: Easy to debug and understand
3. **Lightweight**: Less verbose than XML
4. **Web Standard**: Native support in JavaScript/browsers
5. **Tooling**: Excellent library support (nlohmann/json)

**WHY not XML:**
- **Verbose**: Much more markup overhead
- **Complex**: Namespaces, schemas add complexity
- **Performance**: Slower to parse and generate
- **Less Popular**: JSON has won the API format wars

**WHY not Binary formats:**
- **Debugging**: Hard to inspect network traffic
- **Tooling**: Limited support in standard tools
- **Versioning**: Schema evolution is more complex
- **Interoperability**: Platform-specific serialization issues

This comprehensive "Why" analysis explains the reasoning behind every major design decision, helping developers understand not just what the code does, but why it's structured this way and what alternatives were considered and rejected.
```

### 3. Database Layer (`database.h`)

```cpp
#ifndef DATABASE_H
#define DATABASE_H

#include <sqlite3.h>
#include <string>
#include <vector>
#include <memory>
#include "user.h"

class Database {
private:
    sqlite3* db;
    std::string dbPath;

public:
    Database(const std::string& path = "users.db");
    ~Database();

    bool initialize();
    void close();

    // User CRUD operations
    bool createUser(User& user);
    std::vector<User> getAllUsers();
    std::optional<User> getUserById(int id);
    std::optional<User> getUserByEmail(const std::string& email);
    bool updateUser(const User& user);
    bool deleteUser(int id);
    bool emailExists(const std::string& email);

private:
    bool createTables();
    static int callback(void* data, int argc, char** argv, char** azColName);
};

#endif // DATABASE_H
```

### 4. Database Implementation (`database.cpp`)

```cpp
#include "database.h"
#include <iostream>
#include <sstream>

Database::Database(const std::string& path) : db(nullptr), dbPath(path) {}

Database::~Database() {
    close();
}

bool Database::initialize() {
    int rc = sqlite3_open(dbPath.c_str(), &db);
    if (rc != SQLITE_OK) {
        std::cerr << "Cannot open database: " << sqlite3_errmsg(db) << std::endl;
        return false;
    }
    return createTables();
}

void Database::close() {
    if (db) {
        sqlite3_close(db);
        db = nullptr;
    }
}

bool Database::createTables() {
    const char* sql = R"(
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            age INTEGER NOT NULL
        );
    )";

    char* errMsg = nullptr;
    int rc = sqlite3_exec(db, sql, nullptr, nullptr, &errMsg);

    if (rc != SQLITE_OK) {
        std::cerr << "SQL error: " << errMsg << std::endl;
        sqlite3_free(errMsg);
        return false;
    }

    return true;
}

bool Database::createUser(User& user) {
    if (!user.isValid()) {
        return false;
    }

    if (emailExists(user.getEmail())) {
        return false;
    }

    const char* sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, user.getName().c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user.getEmail().c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, user.getAge());

    rc = sqlite3_step(stmt);
    if (rc == SQLITE_DONE) {
        user.setId(sqlite3_last_insert_rowid(db));
    }

    sqlite3_finalize(stmt);
    return rc == SQLITE_DONE;
}

std::vector<User> Database::getAllUsers() {
    std::vector<User> users;
    const char* sql = "SELECT id, name, email, age FROM users";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return users;
    }

    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        std::string name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        std::string email = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
        int age = sqlite3_column_int(stmt, 3);

        users.emplace_back(id, name, email, age);
    }

    sqlite3_finalize(stmt);
    return users;
}

std::optional<User> Database::getUserById(int id) {
    const char* sql = "SELECT id, name, email, age FROM users WHERE id = ?";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return std::nullopt;
    }

    sqlite3_bind_int(stmt, 1, id);

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        int userId = sqlite3_column_int(stmt, 0);
        std::string name = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
        std::string email = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 2));
        int age = sqlite3_column_int(stmt, 3);

        sqlite3_finalize(stmt);
        return User(userId, name, email, age);
    }

    sqlite3_finalize(stmt);
    return std::nullopt;
}

bool Database::updateUser(const User& user) {
    if (!user.getId().has_value() || !user.isValid()) {
        return false;
    }

    const char* sql = "UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, user.getName().c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_text(stmt, 2, user.getEmail().c_str(), -1, SQLITE_STATIC);
    sqlite3_bind_int(stmt, 3, user.getAge());
    sqlite3_bind_int(stmt, 4, user.getId().value());

    rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    return rc == SQLITE_DONE;
}

bool Database::deleteUser(int id) {
    const char* sql = "DELETE FROM users WHERE id = ?";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_int(stmt, 1, id);
    rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);

    return rc == SQLITE_DONE;
}

bool Database::emailExists(const std::string& email) {
    const char* sql = "SELECT COUNT(*) FROM users WHERE email = ?";
    sqlite3_stmt* stmt;

    int rc = sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        return false;
    }

    sqlite3_bind_text(stmt, 1, email.c_str(), -1, SQLITE_STATIC);

    bool exists = false;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        exists = sqlite3_column_int(stmt, 0) > 0;
    }

    sqlite3_finalize(stmt);
    return exists;
}
```

### 5. Service Layer (`user_service.h`)

```cpp
#ifndef USER_SERVICE_H
#define USER_SERVICE_H

#include "user.h"
#include "database.h"
#include <memory>
#include <vector>

class UserService {
private:
    std::unique_ptr<Database> database;

public:
    UserService();
    ~UserService() = default;

    bool initialize();

    // Business logic methods
    std::vector<User> getAllUsers();
    std::optional<User> getUserById(int id);
    bool createUser(User& user);
    bool updateUser(int id, const User& userDetails);
    bool deleteUser(int id);

private:
    bool validateUser(const User& user);
};

#endif // USER_SERVICE_H
```

### 6. Service Implementation (`user_service.cpp`)

```cpp
#include "user_service.h"
#include <iostream>

UserService::UserService() : database(std::make_unique<Database>()) {}

bool UserService::initialize() {
    return database->initialize();
}

std::vector<User> UserService::getAllUsers() {
    return database->getAllUsers();
}

std::optional<User> UserService::getUserById(int id) {
    if (id <= 0) {
        return std::nullopt;
    }
    return database->getUserById(id);
}

bool UserService::createUser(User& user) {
    if (!validateUser(user)) {
        return false;
    }

    return database->createUser(user);
}

bool UserService::updateUser(int id, const User& userDetails) {
    if (id <= 0 || !validateUser(userDetails)) {
        return false;
    }

    // Check if user exists
    auto existingUser = database->getUserById(id);
    if (!existingUser.has_value()) {
        return false;
    }

    // Create updated user
    User updatedUser = userDetails;
    updatedUser.setId(id);

    return database->updateUser(updatedUser);
}

bool UserService::deleteUser(int id) {
    if (id <= 0) {
        return false;
    }

    // Check if user exists
    auto existingUser = database->getUserById(id);
    if (!existingUser.has_value()) {
        return false;
    }

    return database->deleteUser(id);
}

bool UserService::validateUser(const User& user) {
    return user.isValid();
}
```

### 7. Controller Layer (`user_controller.h`)

```cpp
#ifndef USER_CONTROLLER_H
#define USER_CONTROLLER_H

#include <httplib.h>
#include "user_service.h"
#include <memory>

class UserController {
private:
    std::unique_ptr<UserService> userService;

public:
    UserController();
    ~UserController() = default;

    bool initialize();
    void setupRoutes(httplib::Server& server);

private:
    // Route handlers
    void getAllUsers(const httplib::Request& req, httplib::Response& res);
    void getUserById(const httplib::Request& req, httplib::Response& res);
    void createUser(const httplib::Request& req, httplib::Response& res);
    void updateUser(const httplib::Request& req, httplib::Response& res);
    void deleteUser(const httplib::Request& req, httplib::Response& res);

    // Helper methods
    void sendJsonResponse(httplib::Response& res, int status, const nlohmann::json& json);
    void sendErrorResponse(httplib::Response& res, int status, const std::string& message);
};

#endif // USER_CONTROLLER_H
```

### 8. Controller Implementation (`user_controller.cpp`)

```cpp
#include "user_controller.h"
#include <nlohmann/json.hpp>
#include <iostream>

UserController::UserController() : userService(std::make_unique<UserService>()) {}

bool UserController::initialize() {
    return userService->initialize();
}

void UserController::setupRoutes(httplib::Server& server) {
    // CORS middleware
    server.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
        res.set_header("Access-Control-Allow-Origin", "*");
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        return httplib::Server::HandlerResponse::Unhandled;
    });

    // Handle OPTIONS requests for CORS
    server.Options("/api/users.*", [](const httplib::Request&, httplib::Response& res) {
        return;
    });

    // User routes
    server.Get("/api/users", [this](const httplib::Request& req, httplib::Response& res) {
        getAllUsers(req, res);
    });

    server.Get(R"(/api/users/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        getUserById(req, res);
    });

    server.Post("/api/users", [this](const httplib::Request& req, httplib::Response& res) {
        createUser(req, res);
    });

    server.Put(R"(/api/users/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        updateUser(req, res);
    });

    server.Delete(R"(/api/users/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
        deleteUser(req, res);
    });
}

void UserController::getAllUsers(const httplib::Request& req, httplib::Response& res) {
    try {
        auto users = userService->getAllUsers();
        nlohmann::json jsonArray = nlohmann::json::array();

        for (const auto& user : users) {
            jsonArray.push_back(user.toJson());
        }

        sendJsonResponse(res, 200, jsonArray);
    } catch (const std::exception& e) {
        sendErrorResponse(res, 500, "Internal server error");
    }
}

void UserController::getUserById(const httplib::Request& req, httplib::Response& res) {
    try {
        int id = std::stoi(req.matches[1]);
        auto user = userService->getUserById(id);

        if (user.has_value()) {
            sendJsonResponse(res, 200, user.value().toJson());
        } else {
            sendErrorResponse(res, 404, "User not found");
        }
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid user ID");
    }
}

void UserController::createUser(const httplib::Request& req, httplib::Response& res) {
    try {
        auto json = nlohmann::json::parse(req.body);
        User user = User::fromJson(json);

        if (userService->createUser(user)) {
            sendJsonResponse(res, 201, user.toJson());
        } else {
            sendErrorResponse(res, 400, "Failed to create user or email already exists");
        }
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid JSON or user data");
    }
}

void UserController::updateUser(const httplib::Request& req, httplib::Response& res) {
    try {
        int id = std::stoi(req.matches[1]);
        auto json = nlohmann::json::parse(req.body);
        User userDetails = User::fromJson(json);

        if (userService->updateUser(id, userDetails)) {
            auto updatedUser = userService->getUserById(id);
            if (updatedUser.has_value()) {
                sendJsonResponse(res, 200, updatedUser.value().toJson());
            }
        } else {
            sendErrorResponse(res, 404, "User not found or invalid data");
        }
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid request data");
    }
}

void UserController::deleteUser(const httplib::Request& req, httplib::Response& res) {
    try {
        int id = std::stoi(req.matches[1]);

        if (userService->deleteUser(id)) {
            res.status = 204; // No Content
        } else {
            sendErrorResponse(res, 404, "User not found");
        }
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid user ID");
    }
}

void UserController::sendJsonResponse(httplib::Response& res, int status, const nlohmann::json& json) {
    res.status = status;
    res.set_content(json.dump(), "application/json");
}

void UserController::sendErrorResponse(httplib::Response& res, int status, const std::string& message) {
    nlohmann::json error = {{"error", message}};
    sendJsonResponse(res, status, error);
}
```

### 9. Main Application (`main.cpp`)

```cpp
#include <httplib.h>
#include <iostream>
#include <signal.h>
#include "user_controller.h"

// Global server instance for signal handling
httplib::Server* globalServer = nullptr;

void signalHandler(int signal) {
    if (globalServer) {
        std::cout << "\nShutting down server..." << std::endl;
        globalServer->stop();
    }
}

int main() {
    // Setup signal handling for graceful shutdown
    signal(SIGINT, signalHandler);
    signal(SIGTERM, signalHandler);

    // Create HTTP server
    httplib::Server server;
    globalServer = &server;

    // Initialize controller
    UserController controller;
    if (!controller.initialize()) {
        std::cerr << "Failed to initialize user controller" << std::endl;
        return 1;
    }

    // Setup routes
    controller.setupRoutes(server);

    // Add a health check endpoint
    server.Get("/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("{\"status\":\"OK\"}", "application/json");
    });

    // Server configuration
    server.set_logger([](const httplib::Request& req, const httplib::Response& res) {
        std::cout << req.method << " " << req.path << " - " << res.status << std::endl;
    });

    // Start server
    std::cout << "Starting C++ API Server on http://localhost:8080" << std::endl;
    std::cout << "Press Ctrl+C to stop the server" << std::endl;

    if (!server.listen("localhost", 8080)) {
        std::cerr << "Failed to start server on port 8080" << std::endl;
        return 1;
    }

    std::cout << "Server stopped" << std::endl;
    return 0;
}
```

## Line-by-Line Explanation

### Main Application Analysis

```cpp
#include <httplib.h>
#include <iostream>
#include <signal.h>
#include "user_controller.h"
```
**Lines 1-4**: Include necessary headers. `httplib.h` provides HTTP server functionality, `signal.h` for graceful shutdown handling, and our custom controller.

```cpp
httplib::Server* globalServer = nullptr;
```
**Line 7**: Global server pointer for signal handling. This allows us to stop the server gracefully when receiving interrupt signals.

```cpp
void signalHandler(int signal) {
    if (globalServer) {
        std::cout << "\nShutting down server..." << std::endl;
        globalServer->stop();
    }
}
```
**Lines 9-14**: Signal handler function that stops the server when Ctrl+C is pressed. This ensures proper cleanup and graceful shutdown.

```cpp
httplib::Server server;
globalServer = &server;
```
**Lines 21-22**: Creates the HTTP server instance and assigns it to the global pointer for signal handling.

```cpp
UserController controller;
if (!controller.initialize()) {
    std::cerr << "Failed to initialize user controller" << std::endl;
    return 1;
}
```
**Lines 25-29**: Creates and initializes the user controller. If initialization fails (e.g., database connection issues), the program exits with error code 1.

### User Entity Analysis

```cpp
class User {
private:
    std::optional<int> id;
    std::string name;
    std::string email;
    int age;
```
**Lines 9-13**: Class definition with private member variables. `std::optional<int>` for ID allows handling of users without assigned IDs (before database insertion).

```cpp
User(const std::string& name, const std::string& email, int age);
User(int id, const std::string& name, const std::string& email, int age);
```
**Lines 17-18**: Two constructors - one for new users (without ID) and one for existing users (with ID from database).

```cpp
std::optional<int> getId() const { return id; }
const std::string& getName() const { return name; }
```
**Lines 21-22**: Getter methods. `getId()` returns optional since new users don't have IDs yet. `const` reference for string to avoid unnecessary copying.

```cpp
nlohmann::json toJson() const;
static User fromJson(const nlohmann::json& json);
```
**Lines 29-30**: JSON serialization methods. `toJson()` converts User to JSON, `fromJson()` is static method that creates User from JSON.

### Database Layer Analysis

```cpp
class Database {
private:
    sqlite3* db;
    std::string dbPath;
```
**Lines 11-13**: Database class with SQLite connection pointer and database file path.

```cpp
bool createUser(User& user);
std::vector<User> getAllUsers();
std::optional<User> getUserById(int id);
```
**Lines 20-22**: CRUD operation methods. `createUser` takes non-const reference to set the generated ID. Returns optional for operations that might not find data.

```cpp
const char* sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
sqlite3_stmt* stmt;
```
**Lines 68-69**: Prepared statement SQL. Using `?` placeholders prevents SQL injection attacks. `sqlite3_stmt*` is the prepared statement handle.

```cpp
sqlite3_bind_text(stmt, 1, user.getName().c_str(), -1, SQLITE_STATIC);
sqlite3_bind_int(stmt, 3, user.getAge());
```
**Lines 75-77**: Binds parameters to prepared statement. Index starts at 1. `SQLITE_STATIC` means SQLite won't copy the string data.

### Service Layer Analysis

```cpp
class UserService {
private:
    std::unique_ptr<Database> database;
```
**Lines 11-12**: Service class with unique_ptr to Database. This provides automatic memory management and exclusive ownership.

```cpp
bool createUser(User& user) {
    if (!validateUser(user)) {
        return false;
    }
    return database->createUser(user);
}
```
**Lines 31-36**: Business logic layer. Validates user data before delegating to database layer. This separation allows for complex business rules.

### Controller Layer Analysis

```cpp
server.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return httplib::Server::HandlerResponse::Unhandled;
});
```
**Lines 18-23**: CORS (Cross-Origin Resource Sharing) middleware. Lambda function that adds CORS headers to all responses, allowing frontend applications to access the API.

```cpp
server.Get("/api/users", [this](const httplib::Request& req, httplib::Response& res) {
    getAllUsers(req, res);
});
```
**Lines 30-32**: Route registration using lambda function. `[this]` captures the controller instance to call member methods.

```cpp
server.Get(R"(/api/users/(\d+))", [this](const httplib::Request& req, httplib::Response& res) {
    getUserById(req, res);
});
```
**Lines 34-36**: Route with regex pattern. `(\d+)` captures numeric ID from URL. Raw string literal `R"()"` avoids escaping backslashes.

```cpp
auto json = nlohmann::json::parse(req.body);
User user = User::fromJson(json);
```
**Lines 87-88**: Parses JSON from request body and converts to User object. Can throw exceptions if JSON is malformed.

```cpp
try {
    // ... operation
} catch (const std::exception& e) {
    sendErrorResponse(res, 400, "Invalid request data");
}
```
**Lines 85, 95**: Exception handling converts C++ exceptions to appropriate HTTP error responses.

## What, Where, How - Complete Explanation

### 🎯 WHAT - Purpose and Components

#### Overall System
- **What it is**: A high-performance REST API built with modern C++ for managing user data
- **What it does**: Provides CRUD operations through HTTP endpoints with JSON request/response
- **What technology**: Uses cpp-httplib for HTTP server, SQLite for database, nlohmann/json for JSON handling

#### Key Components
1. **Main Application**: Entry point that starts HTTP server and handles signals
2. **User Entity**: Data model representing user with validation and JSON serialization
3. **Database Layer**: SQLite integration with prepared statements and CRUD operations
4. **Service Layer**: Business logic and validation rules
5. **Controller Layer**: HTTP request handling and routing
6. **Build System**: CMake configuration with dependency management

### 📍 WHERE - File Structure and Architecture

#### Project Structure
```
project/
├── CMakeLists.txt              ← Build configuration
├── main.cpp                    ← Application entry point
├── user.h/.cpp                 ← User entity definition
├── database.h/.cpp             ← Database access layer
├── user_service.h/.cpp         ← Business logic layer
├── user_controller.h/.cpp      ← HTTP request handling
└── build/                      ← Generated build files
    ├── api_server              ← Compiled executable
    └── users.db                ← SQLite database file
```

#### Layered Architecture
```
HTTP Request → Controller → Service → Database → SQLite
HTTP Response ← Controller ← Service ← Database ← SQLite
```

#### Memory Management
- **Smart Pointers**: `std::unique_ptr` for automatic resource management
- **RAII**: Constructors/destructors handle resource acquisition/release
- **Stack Allocation**: Local objects automatically cleaned up
- **Database Connections**: Proper cleanup in destructors

### ⚙️ HOW - Implementation Details

#### 1. Application Bootstrap Process
```cpp
int main() {
    signal(SIGINT, signalHandler);
    httplib::Server server;
    UserController controller;
    controller.initialize();
    controller.setupRoutes(server);
    server.listen("localhost", 8080);
}
```

**HOW it works:**
1. **Signal Setup**: Registers signal handlers for graceful shutdown
2. **Server Creation**: Creates HTTP server instance on stack
3. **Controller Initialization**: Initializes database connection and creates tables
4. **Route Registration**: Maps HTTP endpoints to handler functions
5. **Server Start**: Begins listening on port 8080 in blocking mode

#### 2. Memory and Resource Management
```cpp
class UserService {
private:
    std::unique_ptr<Database> database;  // Automatic cleanup
public:
    UserService() : database(std::make_unique<Database>()) {}
};
```

**HOW resource management works:**
1. **RAII Pattern**: Resources acquired in constructor, released in destructor
2. **Smart Pointers**: `unique_ptr` provides automatic memory management
3. **Exception Safety**: RAII ensures cleanup even when exceptions occur
4. **No Memory Leaks**: Compiler enforces proper resource management

#### 3. Database Integration with SQLite
```cpp
bool Database::createUser(User& user) {
    const char* sql = "INSERT INTO users (name, email, age) VALUES (?, ?, ?)";
    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db, sql, -1, &stmt, nullptr);
    sqlite3_bind_text(stmt, 1, user.getName().c_str(), -1, SQLITE_STATIC);
    // ... bind other parameters
    int rc = sqlite3_step(stmt);
    sqlite3_finalize(stmt);
    return rc == SQLITE_DONE;
}
```

**HOW database operations work:**
1. **Prepared Statements**: SQL compiled once, executed multiple times
2. **Parameter Binding**: Prevents SQL injection attacks
3. **Error Handling**: Return codes indicate success/failure
4. **Resource Cleanup**: `sqlite3_finalize()` releases statement resources
5. **Transaction Safety**: Each operation is atomic

#### 4. HTTP Request Processing Flow
```cpp
server.Post("/api/users", [this](const httplib::Request& req, httplib::Response& res) {
    try {
        auto json = nlohmann::json::parse(req.body);
        User user = User::fromJson(json);
        if (userService->createUser(user)) {
            sendJsonResponse(res, 201, user.toJson());
        } else {
            sendErrorResponse(res, 400, "Failed to create user");
        }
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid JSON");
    }
});
```

**HOW request processing works:**
1. **Route Matching**: Server matches URL pattern and HTTP method
2. **Lambda Execution**: Captured controller instance handles request
3. **JSON Parsing**: Request body parsed into C++ objects
4. **Business Logic**: Service layer processes the request
5. **Response Generation**: Result serialized to JSON and sent back
6. **Exception Handling**: Errors converted to appropriate HTTP status codes

#### 5. JSON Serialization
```cpp
nlohmann::json User::toJson() const {
    nlohmann::json json;
    if (id.has_value()) {
        json["id"] = id.value();
    }
    json["name"] = name;
    json["email"] = email;
    json["age"] = age;
    return json;
}
```

**HOW JSON handling works:**
1. **Serialization**: C++ objects converted to JSON using nlohmann/json
2. **Deserialization**: JSON strings parsed into C++ objects
3. **Optional Handling**: `std::optional` fields handled conditionally
4. **Type Safety**: Compile-time type checking for JSON operations
5. **Performance**: Efficient parsing with minimal allocations

#### 6. Error Handling Strategy
```cpp
void UserController::createUser(const httplib::Request& req, httplib::Response& res) {
    try {
        // ... operation
    } catch (const std::exception& e) {
        sendErrorResponse(res, 400, "Invalid request data");
    }
}
```

**HOW error handling works:**
1. **Exception Propagation**: C++ exceptions bubble up from lower layers
2. **Controller Catching**: Controllers catch exceptions and convert to HTTP responses
3. **Error Codes**: Different exceptions map to different HTTP status codes
4. **Client Communication**: JSON error responses with meaningful messages
5. **Resource Safety**: RAII ensures cleanup even when exceptions occur

#### 7. Complete CRUD Operations Flow

**CREATE (POST /api/users):**
```
HTTP POST → Lambda Handler → JSON Parse → User::fromJson() → 
UserService::createUser() → Database::createUser() → SQLite INSERT → 
Response JSON → HTTP 201
```

**READ (GET /api/users):**
```
HTTP GET → Lambda Handler → UserService::getAllUsers() → 
Database::getAllUsers() → SQLite SELECT → Vector<User> → 
JSON Array → HTTP 200
```

**UPDATE (PUT /api/users/1):**
```
HTTP PUT → Regex Match ID → JSON Parse → UserService::updateUser() → 
Database::updateUser() → SQLite UPDATE → Response JSON → HTTP 200
```

**DELETE (DELETE /api/users/1):**
```
HTTP DELETE → Regex Match ID → UserService::deleteUser() → 
Database::deleteUser() → SQLite DELETE → HTTP 204
```

#### 8. Build System and Dependencies
```cmake
find_package(PkgConfig REQUIRED)
pkg_check_modules(SQLITE3 REQUIRED sqlite3)

FetchContent_Declare(httplib GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git)
FetchContent_MakeAvailable(httplib)

target_link_libraries(api_server httplib::httplib nlohmann_json::nlohmann_json)
```

**HOW build system works:**
1. **CMake Configuration**: Modern CMake with target-based linking
2. **Dependency Management**: FetchContent downloads and builds dependencies
3. **Package Finding**: pkg-config locates system libraries like SQLite
4. **Linking**: All libraries linked to final executable
5. **Cross-Platform**: Works on Windows, Linux, and macOS

#### 9. Performance Characteristics
```cpp
// Stack allocation for small objects
User user("John", "john@email.com", 30);

// Move semantics for efficient transfers
return std::move(users);

// Reference parameters to avoid copying
bool updateUser(int id, const User& userDetails);
```

**HOW performance is optimized:**
1. **Stack Allocation**: Prefer stack over heap for small objects
2. **Move Semantics**: C++11 move semantics reduce copying
3. **Const References**: Pass large objects by const reference
4. **Prepared Statements**: Database queries compiled once, executed multiple times
5. **Memory Pooling**: SQLite manages memory efficiently

This C++ API provides high performance, type safety, and efficient resource management while maintaining clean separation of concerns and modern C++ best practices.

## How to Compile and Run

### Prerequisites
1. **C++17 compatible compiler** (GCC 8+, Clang 7+, MSVC 2017+)
2. **CMake 3.16+**
3. **SQLite3 development libraries**
4. **pkg-config** (Linux/macOS)

### Windows (Visual Studio)
```cmd
# Install dependencies using vcpkg
vcpkg install sqlite3 httplib nlohmann-json

# Configure and build
mkdir build
cd build
cmake .. -DCMAKE_TOOLCHAIN_FILE=[vcpkg-root]/scripts/buildsystems/vcpkg.cmake
cmake --build . --config Release

# Run the server
.\Release\api_server.exe
```

### Linux/macOS
```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get install libsqlite3-dev pkg-config cmake build-essential

# Or on macOS with Homebrew
brew install sqlite3 cmake pkg-config

# Build
mkdir build && cd build
cmake ..
make -j$(nproc)

# Run the server
./api_server
```

### Expected Output
```
Starting C++ API Server on http://localhost:8080
Press Ctrl+C to stop the server
GET /api/users - 200
POST /api/users - 201
```

## Testing Your API

### Using cURL
```bash
# Get all users
curl -X GET http://localhost:8080/api/users

# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'

# Get user by ID
curl -X GET http://localhost:8080/api/users/1

# Update user
curl -X PUT http://localhost:8080/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","age":25}'

# Delete user
curl -X DELETE http://localhost:8080/api/users/1
```

### Using a REST Client
- **Postman**: Import the endpoint collection
- **Insomnia**: Create requests for each endpoint
- **VS Code REST Client**: Use .http files

## Advanced Features

### 1. Authentication Middleware
```cpp
server.set_pre_routing_handler([](const httplib::Request& req, httplib::Response& res) {
    if (req.path.find("/api/") == 0 && req.path != "/api/auth/login") {
        auto auth_header = req.get_header_value("Authorization");
        if (auth_header.empty() || !validateToken(auth_header)) {
            res.status = 401;
            res.set_content("{\"error\":\"Unauthorized\"}", "application/json");
            return httplib::Server::HandlerResponse::Handled;
        }
    }
    return httplib::Server::HandlerResponse::Unhandled;
});
```

### 2. Input Validation
```cpp
bool User::isValid() const {
    if (name.empty() || name.length() > 100) return false;
    
    std::regex email_regex(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
    if (!std::regex_match(email, email_regex)) return false;
    
    if (age < 0 || age > 150) return false;
    
    return true;
}
```

### 3. Logging
```cpp
#include <spdlog/spdlog.h>

server.set_logger([](const httplib::Request& req, const httplib::Response& res) {
    spdlog::info("{} {} - {} ({}ms)", req.method, req.path, res.status, 
                 std::chrono::duration_cast<std::chrono::milliseconds>(
                     std::chrono::steady_clock::now() - start_time).count());
});
```

This C++ API tutorial demonstrates modern C++ practices including RAII, smart pointers, move semantics, and proper error handling while providing a high-performance REST API server.
