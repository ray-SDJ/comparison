# Java API Tutorial - Complete Guide

## Table of Contents
1. [Setup and Dependencies](#setup-and-dependencies)
2. [Basic API Structure](#basic-api-structure)
3. [Complete Code Example](#complete-code-example)
4. [Line-by-Line Explanation](#line-by-line-explanation)
5. [How to Start the Server](#how-to-start-the-server)
6. [Testing Your API](#testing-your-api)
7. [Advanced Features](#advanced-features)

## Setup and Dependencies

### 1. Create a Maven Project
First, create a new Maven project in VS Code. You'll need a `pom.xml` file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>my-api</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

## Complete Code Example

### 1. Main Application Class (`src/main/java/com/example/ApiApplication.java`)

```java
package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
```

### 2. Entity Class (`src/main/java/com/example/model/User.java`)

```java
package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    private int age;
    
    // Default constructor (required by JPA)
    public User() {}
    
    // Constructor with parameters
    public User(String name, String email, int age) {
        this.name = name;
        this.email = email;
        this.age = age;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
}
```

### 3. Repository Interface (`src/main/java/com/example/repository/UserRepository.java`)

```java
package com.example.repository;

import com.example.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

### 4. Service Class (`src/main/java/com/example/service/UserService.java`)

```java
package com.example.service;

import com.example.model.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
```

### 5. Controller Class (`src/main/java/com/example/controller/UserController.java`)

```java
package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, 
                                         @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
```

### 6. Configuration File (`src/main/resources/application.properties`)

```properties
# H2 Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console (for development)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console

# Server Configuration
server.port=8080
```

## Line-by-Line Explanation

### Main Application Class Analysis

```java
package com.example;
```
**Line 1**: Declares the package name where this class belongs. Java uses packages to organize classes and avoid naming conflicts.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
```
**Lines 3-4**: Import statements that bring in the necessary Spring Boot classes. `SpringApplication` is used to bootstrap the application, and `SpringBootApplication` is an annotation.

```java
@SpringBootApplication
```
**Line 6**: This annotation combines three annotations: `@Configuration`, `@EnableAutoConfiguration`, and `@ComponentScan`. It tells Spring Boot to auto-configure the application based on dependencies found in the classpath.

```java
public class ApiApplication {
```
**Line 7**: Declares the main class. In Java, the class name must match the filename (ApiApplication.java).

```java
public static void main(String[] args) {
```
**Line 8**: The main method - the entry point of any Java application. It's `static` so it can be called without creating an instance of the class.

```java
SpringApplication.run(ApiApplication.class, args);
```
**Line 9**: This starts the Spring Boot application. It takes the main class and command-line arguments as parameters.

### Entity Class Analysis

```java
@Entity
```
**Line 6**: JPA annotation that marks this class as a database entity (table).

```java
@Table(name = "users")
```
**Line 7**: Specifies the table name in the database. Without this, it would default to the class name.

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
```
**Lines 10-12**: `@Id` marks this field as the primary key. `@GeneratedValue` tells JPA to auto-generate the ID value using the database's auto-increment feature.

```java
@Column(nullable = false)
private String name;
```
**Lines 14-15**: `@Column` annotation specifies column properties. `nullable = false` means this field cannot be null in the database.

```java
@Column(nullable = false, unique = true)
private String email;
```
**Lines 17-18**: Email field with both `nullable = false` and `unique = true` constraints.

### Repository Interface Analysis

```java
@Repository
```
**Line 8**: Spring annotation that marks this interface as a repository component (data access layer).

```java
public interface UserRepository extends JpaRepository<User, Long> {
```
**Line 9**: Interface extends `JpaRepository`, which provides built-in CRUD operations. The generic parameters `<User, Long>` specify the entity type and the type of its primary key.

```java
Optional<User> findByEmail(String email);
```
**Line 10**: Spring Data JPA automatically implements this method based on the method name. It finds a user by email and returns an `Optional` (which may or may not contain a user).

```java
boolean existsByEmail(String email);
```
**Line 11**: Another auto-implemented method that checks if a user with the given email exists.

### Service Class Analysis

```java
@Service
```
**Line 11**: Spring annotation that marks this class as a service component (business logic layer).

```java
@Autowired
private UserRepository userRepository;
```
**Lines 13-14**: `@Autowired` tells Spring to inject an instance of `UserRepository` into this field automatically.

```java
public List<User> getAllUsers() {
        return userRepository.findAll();
    }
```
**Lines 16-18**: Method that returns all users by calling the repository's `findAll()` method.

```java
public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
```
**Lines 20-22**: Method that finds a user by ID, returning an `Optional<User>`.

```java
public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
```
**Lines 24-29**: Creates a new user after checking if the email already exists. If it does, throws an exception; otherwise, saves the user.

```java
public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAge(userDetails.getAge());
        
        return userRepository.save(user);
    }
```
**Lines 31-37**: Updates an existing user. First, it retrieves the user by ID. If not found, throws an exception. Otherwise, updates the user's details and saves the user.

```java
public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
```
**Lines 39-43**: Deletes a user by ID. It first retrieves the user, and if found, deletes the user.

## What, Where, How - Complete Explanation

### 🎯 WHAT - Purpose and Components

#### Overall System
- **What it is**: A complete REST API built with Spring Boot for managing user data
- **What it does**: Provides CRUD (Create, Read, Update, Delete) operations for user entities
- **What technology**: Uses Spring Boot framework with embedded database (H2) and JPA for data persistence

#### Key Components
1. **Main Application Class**: Entry point that bootstraps the Spring Boot application
2. **Entity Class (User)**: Represents the data structure and maps to database table
3. **Repository Interface**: Handles database operations and queries
4. **Service Class**: Contains business logic and validation rules
5. **Controller Class**: Handles HTTP requests and responses
6. **Configuration**: Database and server settings

### 📍 WHERE - File Structure and Architecture

#### Project Structure
```
src/
├── main/
│   ├── java/com/example/
│   │   ├── ApiApplication.java          ← Main entry point
│   │   ├── model/User.java              ← Data entity
│   │   ├── repository/UserRepository.java ← Data access layer
│   │   ├── service/UserService.java     ← Business logic layer
│   │   └── controller/UserController.java ← API endpoints
│   └── resources/
│       └── application.properties       ← Configuration
└── pom.xml                             ← Dependencies
```

#### Layered Architecture
```
HTTP Request → Controller → Service → Repository → Database
HTTP Response ← Controller ← Service ← Repository ← Database
```

#### Component Locations in Spring Context
- **@SpringBootApplication**: Scans and configures all components
- **@Entity**: Registered as JPA entity for database mapping
- **@Repository**: Registered as data access component
- **@Service**: Registered as business logic component
- **@RestController**: Registered as web request handler

### ⚙️ HOW - Implementation Details

#### 1. Application Bootstrap Process
```java
@SpringBootApplication
public class ApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
```

**HOW it works:**
1. **Component Scanning**: `@SpringBootApplication` scans package for annotated classes
2. **Auto-Configuration**: Automatically configures beans based on classpath dependencies
3. **Context Creation**: Creates Spring application context with all registered beans
4. **Server Startup**: Launches embedded Tomcat server on configured port
5. **Dependency Injection**: Wires all components together using @Autowired

#### 2. Data Persistence Layer
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
}
```

**HOW database mapping works:**
1. **Entity Registration**: `@Entity` registers class with JPA EntityManager
2. **Table Creation**: `@Table(name = "users")` creates/maps to "users" table
3. **Primary Key**: `@Id` + `@GeneratedValue` creates auto-incrementing primary key
4. **Column Constraints**: `@Column` annotations define database constraints
5. **Schema Generation**: Hibernate creates DDL based on entity annotations

#### 3. Repository Pattern Implementation
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

**HOW Spring Data JPA works:**
1. **Interface Proxy**: Spring creates implementation at runtime
2. **Method Name Parsing**: `findByEmail` → `SELECT * FROM users WHERE email = ?`
3. **Query Generation**: Spring Data generates SQL from method names
4. **Transaction Management**: Automatic transaction handling for CRUD operations
5. **Exception Translation**: Converts database exceptions to Spring exceptions

**Available Built-in Methods:**
- `findAll()` → `SELECT * FROM users`
- `findById(id)` → `SELECT * FROM users WHERE id = ?`
- `save(user)` → `INSERT INTO users ...` or `UPDATE users ...`
- `delete(user)` → `DELETE FROM users WHERE id = ?`
- `count()` → `SELECT COUNT(*) FROM users`

#### 4. Business Logic Layer
```java
@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        return userRepository.save(user);
    }
}
```

**HOW service layer manages business rules:**
1. **Dependency Injection**: `@Autowired` injects repository automatically
2. **Business Validation**: Checks email uniqueness before saving
3. **Exception Handling**: Throws meaningful exceptions for business rule violations
4. **Transaction Coordination**: Methods are transactional by default
5. **Data Transformation**: Can modify data before/after database operations

**Service Layer Benefits:**
- Separates business logic from web layer
- Reusable across different controllers
- Easier unit testing with mocked dependencies
- Centralized transaction management

#### 5. Web Layer (REST API)
```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
```

**HOW HTTP request processing works:**
1. **Request Mapping**: `@RequestMapping("/api/users")` sets base URL
2. **HTTP Method Mapping**: `@PostMapping` maps to HTTP POST requests
3. **Content Negotiation**: `@RequestBody` converts JSON to Java object
4. **Business Processing**: Delegates to service layer for processing
5. **Response Generation**: `ResponseEntity` controls HTTP status and body
6. **Exception Handling**: Try-catch converts exceptions to HTTP error codes

**Complete Request Flow:**
```
1. HTTP POST /api/users → @PostMapping method
2. JSON body → @RequestBody User object
3. Controller → Service validation
4. Service → Repository database save
5. Repository → Database INSERT
6. Database result → Repository
7. Repository → Service
8. Service → Controller
9. Controller → ResponseEntity with HTTP 201
10. ResponseEntity → JSON response to client
```

#### 6. Configuration and Properties
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

**HOW configuration affects application:**
1. **Database Connection**: Creates H2 in-memory database connection
2. **Schema Management**: `ddl-auto=update` creates/updates tables automatically
3. **Server Configuration**: Embedded Tomcat runs on port 8080
4. **JPA Settings**: Hibernate handles ORM mapping and SQL generation

#### 7. Complete CRUD Operations Flow

**CREATE (POST /api/users):**
```
HTTP POST → Controller → Service (validate email) → Repository → Database INSERT
```

**READ (GET /api/users):**
```
HTTP GET → Controller → Service → Repository → Database SELECT → JSON Response
```

**UPDATE (PUT /api/users/1):**
```
HTTP PUT → Controller → Service (find + update) → Repository → Database UPDATE
```

**DELETE (DELETE /api/users/1):**
```
HTTP DELETE → Controller → Service (find + delete) → Repository → Database DELETE
```

#### 8. Error Handling Strategy
```java
try {
    User createdUser = userService.createUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
} catch (RuntimeException e) {
    return ResponseEntity.badRequest().build();
}
```

**HOW error handling works:**
1. **Exception Propagation**: Service throws RuntimeException for business rule violations
2. **Controller Catching**: Controller catches exceptions and converts to HTTP responses
3. **HTTP Status Mapping**: Different exceptions map to different HTTP status codes
4. **Client Communication**: Meaningful HTTP status codes inform client of error type

#### 9. Dependency Injection Flow
```
Application Start → Component Scan → Bean Creation → Dependency Resolution → Application Ready
```

**HOW Spring manages dependencies:**
1. **Bean Registration**: All `@Component`, `@Service`, `@Repository`, `@Controller` classes registered
2. **Dependency Graph**: Spring resolves dependency relationships
3. **Injection Points**: `@Autowired` fields/constructors marked for injection
4. **Bean Instantiation**: Spring creates instances and injects dependencies
5. **Lifecycle Management**: Spring manages bean lifecycle and cleanup

#### 10. Database Integration
```java
@Entity → JPA Entity Manager → Hibernate → JDBC → H2 Database
```

**HOW data persistence works:**
1. **Entity Mapping**: `@Entity` classes mapped to database tables
2. **Query Generation**: Hibernate generates SQL from entity operations
3. **Connection Management**: Spring manages database connections automatically
4. **Transaction Handling**: `@Transactional` methods wrapped in database transactions
5. **Data Conversion**: Automatic conversion between Java objects and database rows

This architecture provides a clean separation of concerns, making the code maintainable, testable, and scalable while following Spring Boot best practices.

### Controller Class Analysis

```java
@RestController
```
**Line 12**: Combines `@Controller` and `@ResponseBody`. It tells Spring this class handles HTTP requests and returns data directly (not view names).

```java
@RequestMapping("/api/users")
```
**Line 13**: Maps all methods in this controller to URLs starting with `/api/users`.

```java
@CrossOrigin(origins = "*")
```
**Line 14**: Allows cross-origin requests from any domain (useful for frontend applications).

```java
@GetMapping
public ResponseEntity<List<User>> getAllUsers() {
```
**Lines 19-20**: `@GetMapping` maps HTTP GET requests to this method. `ResponseEntity` allows you to control the HTTP response status and headers.

```java
@GetMapping("/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
```
**Lines 25-26**: `{id}` is a path variable, and `@PathVariable` extracts it from the URL.

```java
@PostMapping
public ResponseEntity<User> createUser(@RequestBody User user) {
```
**Lines 32-33**: `@PostMapping` handles HTTP POST requests. `@RequestBody` converts the JSON request body into a User object.

```java
return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
```
**Line 36**: Returns HTTP 201 (CREATED) status with the created user in the response body.

```java
@PutMapping("/{id}")
```
**Line 42**: `@PutMapping` handles HTTP PUT requests for updating resources.

```java
@DeleteMapping("/{id}")
```
**Line 52**: `@DeleteMapping` handles HTTP DELETE requests.

```java
return ResponseEntity.noContent().build();
```
**Line 56**: Returns HTTP 204 (NO CONTENT) status for successful deletion.

## How to Start the Server

### Prerequisites
Before starting the server, ensure you have:
1. **Java 17 or higher** installed on your system
2. **Maven** installed (or use the Maven wrapper)
3. **VS Code** with Java Extension Pack installed

### Method 1: Using Maven Command Line

#### Step 1: Open Terminal in VS Code
```bash
# Navigate to your project directory
cd /path/to/your/project
```

#### Step 2: Clean and Compile (Optional but recommended)
```bash
# Clean previous builds and compile the project
mvn clean compile
```
**Line-by-line explanation:**
- `mvn clean`: Removes the target directory and all compiled files
- `compile`: Compiles the source code and creates .class files

#### Step 3: Run the Application
```bash
# Start the Spring Boot application
mvn spring-boot:run
```
**What this does:**
- Downloads all dependencies specified in `pom.xml`
- Compiles the Java source code
- Starts the embedded Tomcat server
- Runs the application on port 8080 (default)

#### Expected Output:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2024-01-15 10:30:45.123  INFO 12345 --- [           main] c.e.ApiApplication       : Started ApiApplication in 3.456 seconds
2024-01-15 10:30:45.125  INFO 12345 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http)
```

### Method 2: Using VS Code Java Extension

#### Step 1: Open Project in VS Code
1. Open VS Code
2. File → Open Folder → Select your project directory
3. VS Code should automatically detect it as a Java project

#### Step 2: Run from VS Code
**Option A: Run Button**
1. Open `ApiApplication.java`
2. Click the "Run" button that appears above the `main` method
3. Or press `F5` to start debugging

**Option B: Command Palette**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type "Java: Run"
3. Select your main class (`ApiApplication`)

#### Step 3: View Output
The output will appear in VS Code's integrated terminal.

### Method 3: Using Maven Wrapper (Recommended)

If your project includes Maven wrapper files (`mvnw` for Unix/Mac, `mvnw.cmd` for Windows):

#### For Windows:
```cmd
# Clean and run
mvnw.cmd clean spring-boot:run
```

#### For Unix/Mac:
```bash
# Make wrapper executable (first time only)
chmod +x mvnw

# Clean and run
./mvnw clean spring-boot:run
```

**Why use Maven Wrapper?**
- Ensures everyone uses the same Maven version
- No need to install Maven separately
- More consistent across different environments

### Method 4: Building and Running JAR File

#### Step 1: Build the JAR
```bash
# Create executable JAR file
mvn clean package
```
**What this does:**
- Compiles the code
- Runs tests
- Creates a JAR file in the `target/` directory

#### Step 2: Run the JAR
```bash
# Run the built JAR file
java -jar target/my-api-1.0.0.jar
```
**Line explanation:**
- `java -jar`: Runs a Java application packaged as a JAR file
- `target/my-api-1.0.0.jar`: Path to the built JAR file

### Method 5: Running with Custom Configuration

#### Custom Port
```bash
# Run on port 9090 instead of default 8080
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=9090"
```

#### Custom Profile
```bash
# Run with 'dev' profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

#### With JVM Options
```bash
# Run with custom memory settings
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xmx512m -Xms256m"
```

### Server Startup Process Explained

#### What happens when you start the server:

1. **Bootstrap Phase**
   ```java
   SpringApplication.run(ApiApplication.class, args);
   ```
   - Spring Boot initializes the application context
   - Scans for `@Component`, `@Service`, `@Repository`, `@Controller` annotations
   - Creates instances of all beans

2. **Auto-Configuration**
   ```java
   @SpringBootApplication
   ```
   - Automatically configures Tomcat server
   - Sets up database connections
   - Configures web MVC components

3. **Database Initialization**
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
   - Creates/updates database tables based on entity classes
   - Initializes H2 in-memory database

4. **Server Start**
   ```
   Tomcat started on port(s): 8080 (http)
   ```
   - Embedded Tomcat server starts
   - Application is ready to accept HTTP requests

### Troubleshooting Common Issues

#### Issue 1: Port Already in Use
```
Port 8080 was already in use.
```
**Solutions:**
```bash
# Option 1: Kill process using port 8080
# On Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:8080 | xargs kill -9

# Option 2: Use different port
mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
```

#### Issue 2: Java Version Mismatch
```
Unsupported major.minor version
```
**Solution:**
```bash
# Check Java version
java -version

# Should be 17 or higher for this tutorial
# Install correct Java version if needed
```

#### Issue 3: Maven Not Found
```
'mvn' is not recognized as an internal or external command
```
**Solutions:**
1. Install Maven: https://maven.apache.org/install.html
2. Use Maven wrapper: `./mvnw` instead of `mvn`
3. Use VS Code's integrated Maven support

#### Issue 4: Dependencies Not Downloading
```bash
# Clear Maven cache and retry
mvn clean
mvn dependency:purge-local-repository
mvn spring-boot:run
```

### Verifying Server is Running

#### Method 1: Check Logs
Look for this line in the output:
```
Tomcat started on port(s): 8080 (http)
```

#### Method 2: Test Endpoint
```bash
# Test the base endpoint
curl http://localhost:8080/api/users
```

#### Method 3: Check H2 Console
Open browser and go to: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave blank)

### Stopping the Server

#### From Command Line:
- Press `Ctrl+C` in the terminal where server is running

#### From VS Code:
- Click the stop button in the terminal
- Or press `Ctrl+C` in the integrated terminal

#### Force Stop (if needed):
```bash
# Windows
taskkill /f /im java.exe

# Mac/Linux
pkill -f "spring-boot:run"
```

### Development Tips

#### Hot Reload (Development Mode)
Add Spring Boot DevTools to your `pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
```

Then restart with:
```bash
mvn spring-boot:run
```
Now changes to your code will automatically reload the application.

#### Background Running
To run the server in the background:
```bash
# Linux/Mac
nohup mvn spring-boot:run &

# Windows (using start command)
start mvn spring-boot:run
```

This comprehensive server startup guide covers all the common scenarios you'll encounter when developing with Java APIs in VS Code!

### 1. Run the Application
```bash
mvn spring-boot:run
```

### 2. Test with cURL commands:

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

## Advanced Features

### 1. Exception Handling
Create a global exception handler:

```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
```

### 2. Validation
Add validation annotations to your User entity:

```java
@NotBlank(message = "Name is required")
private String name;

@Email(message = "Email should be valid")
@NotBlank(message = "Email is required")
private String email;

@Min(value = 0, message = "Age must be positive")
private int age;
```

### 3. Custom Response DTOs
Create Data Transfer Objects for cleaner API responses:

```java
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private int age;
    
    // constructors, getters, setters
}
```

This tutorial covers the fundamentals of creating a REST API in Java using Spring Boot. The API provides full CRUD operations and follows REST conventions for HTTP methods and status codes.