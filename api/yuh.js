/*
==============================================================================
                    JAVASCRIPT APIs & REST APIs TUTORIAL
                     Line-by-Line Explanations (What, Why, How, Where)
==============================================================================

WHAT: This tutorial covers APIs (Application Programming Interfaces) and REST APIs in JavaScript
WHY: Understanding APIs is crucial for modern web development and data exchange
HOW: We'll explore different methods to work with APIs using native JavaScript and popular libraries
WHERE: This applies to both frontend (browser) and backend (Node.js) JavaScript environments

TABLE OF CONTENTS:
1. API Fundamentals
2. Making HTTP Requests (Fetch API)
3. Working with JSON Data
4. Error Handling
5. Async/Await vs Promises
6. REST API CRUD Operations
7. Authentication & Headers
8. Real-world Examples
9. Best Practices
10. Creating API Servers (Node.js)
*/

// ==============================================================================
// 1. API FUNDAMENTALS
// ==============================================================================

/*
WHAT: API stands for Application Programming Interface
WHY: APIs allow different software systems to communicate with each other
HOW: They define a set of rules and protocols for accessing data or functionality
WHERE: Used everywhere - web services, databases, operating systems, libraries
*/

// WHAT: A simple API endpoint URL
// WHY: This is where we send requests to get or send data
// HOW: URLs follow a specific structure: protocol://domain/path
// WHERE: This example uses JSONPlaceholder, a free testing API
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

/*
WHAT: HTTP Methods (REST API verbs)
WHY: Different methods serve different purposes in REST architecture
HOW: Each method has a specific meaning and expected behavior
WHERE: Used in all REST API communications
*/
const HTTP_METHODS = {
  GET: "GET", // WHAT: Retrieve data, WHY: Read-only operations, HOW: No request body needed
  POST: "POST", // WHAT: Create new data, WHY: Add new resources, HOW: Data sent in request body
  PUT: "PUT", // WHAT: Update entire resource, WHY: Replace existing data, HOW: Full object in body
  PATCH: "PATCH", // WHAT: Partial update, WHY: Modify specific fields, HOW: Only changed fields in body
  DELETE: "DELETE", // WHAT: Remove data, WHY: Delete resources, HOW: Usually just needs ID in URL
};

// ==============================================================================
// 2. MAKING HTTP REQUESTS (FETCH API)
// ==============================================================================

/*
WHAT: The Fetch API is modern JavaScript's built-in way to make HTTP requests
WHY: It's promise-based, more powerful than XMLHttpRequest, and widely supported
HOW: fetch() returns a Promise that resolves to the Response object
WHERE: Available in modern browsers and Node.js (with polyfill for older versions)
*/

// WHAT: Basic GET request using fetch
// WHY: GET is the most common operation - retrieving data from an API
// HOW: fetch() with just a URL performs a GET request by default
// WHERE: This gets a list of users from the API
async function getAllUsers() {
  try {
    // WHAT: Making the HTTP request
    // WHY: We need to contact the server to get data
    // HOW: fetch() returns a Promise that resolves when response is received
    // WHERE: The request goes to the specified endpoint
    const response = await fetch(`${API_BASE_URL}/users`);

    // WHAT: Check if the request was successful
    // WHY: HTTP requests can fail (404, 500, etc.) and we need to handle this
    // HOW: response.ok is true for status codes 200-299
    // WHERE: This check happens after receiving the response
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // WHAT: Parse the JSON response
    // WHY: APIs typically return data in JSON format
    // HOW: .json() method parses the response body as JSON
    // WHERE: This converts the response stream into a JavaScript object
    const users = await response.json();

    // WHAT: Return the parsed data
    // WHY: The calling code needs access to the user data
    // HOW: Return statement passes the data back to the caller
    // WHERE: This data can now be used in the application
    return users;
  } catch (error) {
    // WHAT: Error handling for failed requests
    // WHY: Network issues, server errors, or parsing errors can occur
    // HOW: try-catch block catches any errors in the async operation
    // WHERE: This runs when any part of the request process fails
    console.error("Error fetching users:", error);
    throw error; // Re-throw to let caller handle it
  }
}

// WHAT: GET request for a specific resource
// WHY: Often we need just one item instead of a list
// HOW: Include the resource ID in the URL path
// WHERE: This gets details for a specific user
async function getUserById(userId) {
  try {
    // WHAT: Template literal to build URL with parameter
    // WHY: We need to specify which user we want
    // HOW: ${userId} inserts the parameter value into the URL
    // WHERE: Creates a URL like /users/1, /users/2, etc.
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);

    if (!response.ok) {
      throw new Error(`User not found! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
}

// ==============================================================================
// 3. WORKING WITH JSON DATA
// ==============================================================================

/*
WHAT: JSON (JavaScript Object Notation) is the standard data format for APIs
WHY: It's lightweight, human-readable, and natively supported by JavaScript
HOW: JSON represents data as key-value pairs, arrays, and nested objects
WHERE: Used in request bodies, response bodies, and configuration files
*/

// WHAT: Creating data to send to an API
// WHY: When creating or updating resources, we need to send data
// HOW: Define a JavaScript object with the required properties
// WHERE: This object will be converted to JSON and sent in the request body
function createUserData(name, email, username) {
  // WHAT: User object structure
  // WHY: APIs expect data in a specific format
  // HOW: Object properties match the API's expected schema
  // WHERE: This structure is defined by the API documentation
  return {
    name: name, // WHAT: Full name, WHY: Human identification
    email: email, // WHAT: Email address, WHY: Contact and unique identifier
    username: username, // WHAT: Unique username, WHY: Login identifier
    address: {
      // WHAT: Nested object, WHY: Organize related data
      street: "123 Main St",
      city: "Anytown",
      zipcode: "12345",
    },
    phone: "555-0123", // WHAT: Contact number, WHY: Additional contact method
    website: "example.com", // WHAT: Personal website, WHY: Professional information
  };
}

// WHAT: POST request to create new data
// WHY: We need to add new resources to the API
// HOW: Send JSON data in the request body with POST method
// WHERE: This creates a new user on the server
async function createUser(userData) {
  try {
    // WHAT: Fetch with configuration object
    // WHY: POST requests need additional configuration
    // HOW: Second parameter to fetch() is an options object
    // WHERE: This sends data to the server for creation
    const response = await fetch(`${API_BASE_URL}/users`, {
      // WHAT: HTTP method specification
      // WHY: POST tells the server we want to create new data
      // HOW: method property sets the HTTP verb
      // WHERE: Server routes handle different methods differently
      method: "POST",

      // WHAT: Request headers
      // WHY: Server needs to know what type of data we're sending
      // HOW: Headers object specifies content type and other metadata
      // WHERE: These are sent with the HTTP request
      headers: {
        // WHAT: Content-Type header
        // WHY: Tells server to expect JSON data
        // HOW: application/json is the MIME type for JSON
        // WHERE: Server uses this to parse the request body correctly
        "Content-Type": "application/json",

        // WHAT: Accept header
        // WHY: Tells server what response format we prefer
        // HOW: Specifies MIME types we can handle
        // WHERE: Server may use this to format the response
        Accept: "application/json",
      },

      // WHAT: Request body with JSON data
      // WHY: POST requests carry data in the body
      // HOW: JSON.stringify() converts JavaScript object to JSON string
      // WHERE: This data is sent to the server for processing
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user! status: ${response.status}`);
    }

    // WHAT: Parse and return the created resource
    // WHY: Server usually returns the created object with assigned ID
    // HOW: Same JSON parsing as GET requests
    // WHERE: This gives us the complete created object
    const createdUser = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// ==============================================================================
// 4. ERROR HANDLING
// ==============================================================================

/*
WHAT: Comprehensive error handling for API requests
WHY: Network issues, server errors, and data problems are common
HOW: Multiple layers of error checking and meaningful error messages
WHERE: Every API interaction should include proper error handling
*/

// WHAT: Enhanced error handling function
// WHY: Different types of errors need different handling strategies
// HOW: Check response status, parse error messages, provide fallbacks
// WHERE: Use this pattern for all API interactions
async function robustApiRequest(url, options = {}) {
  try {
    // WHAT: Make the HTTP request
    // WHY: This is the primary operation we're trying to perform
    // HOW: Use fetch with provided URL and options
    // WHERE: Network request goes to the specified endpoint
    const response = await fetch(url, options);

    // WHAT: Handle different HTTP status codes
    // WHY: Different status codes indicate different types of problems
    // HOW: Check status code ranges and provide specific error messages
    // WHERE: This happens immediately after receiving the response
    if (!response.ok) {
      // WHAT: Get error details from response
      // WHY: Server might provide helpful error information
      // HOW: Try to parse JSON error response, fallback to text
      // WHERE: Error details come from the server response
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || "Unknown error";
      } catch {
        // WHAT: Fallback if JSON parsing fails
        // WHY: Error response might not be JSON
        // HOW: Get response as plain text
        // WHERE: This handles non-JSON error responses
        errorMessage = (await response.text()) || "Request failed";
      }

      // WHAT: Throw specific error based on status code
      // WHY: Different status codes require different handling
      // HOW: Check status code ranges and throw appropriate errors
      // WHERE: These errors can be caught and handled by calling code
      switch (true) {
        case response.status >= 400 && response.status < 500:
          // WHAT: Client errors (4xx)
          // WHY: These are usually mistakes in our request
          // HOW: Include status code and server message
          // WHERE: Examples: 400 Bad Request, 401 Unauthorized, 404 Not Found
          throw new Error(`Client Error ${response.status}: ${errorMessage}`);

        case response.status >= 500:
          // WHAT: Server errors (5xx)
          // WHY: These are problems on the server side
          // HOW: Indicate server issue and suggest retry
          // WHERE: Examples: 500 Internal Server Error, 503 Service Unavailable
          throw new Error(`Server Error ${response.status}: ${errorMessage}`);

        default:
          // WHAT: Other unexpected status codes
          // WHY: Handle any other non-success codes
          // HOW: Generic error message with status
          // WHERE: Catch-all for unusual response codes
          throw new Error(`HTTP Error ${response.status}: ${errorMessage}`);
      }
    }

    // WHAT: Parse successful response
    // WHY: We need to extract the data from the response
    // HOW: Parse as JSON, with fallback handling
    // WHERE: This is the happy path - successful request
    try {
      return await response.json();
    } catch (parseError) {
      // WHAT: Handle JSON parsing errors
      // WHY: Response might not be valid JSON
      // HOW: Return response as text instead
      // WHERE: Fallback for non-JSON responses
      console.warn("Response is not valid JSON, returning as text");
      return await response.text();
    }
  } catch (error) {
    // WHAT: Handle network and other errors
    // WHY: Network issues, timeouts, and other problems can occur
    // HOW: Catch all errors and provide meaningful messages
    // WHERE: This catches errors from the entire request process
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      // WHAT: Network connectivity error
      // WHY: User might be offline or server unreachable
      // HOW: Detect fetch-specific TypeErrors
      // WHERE: Common when network is down or URL is invalid
      throw new Error("Network error: Unable to connect to server");
    } else if (error.name === "AbortError") {
      // WHAT: Request was cancelled
      // WHY: Request might have been aborted due to timeout
      // HOW: Check for AbortError specifically
      // WHERE: Happens when using AbortController or timeout
      throw new Error("Request was cancelled or timed out");
    } else {
      // WHAT: Re-throw other errors
      // WHY: Preserve original error information
      // HOW: Don't modify errors we don't understand
      // WHERE: Let other error types propagate unchanged
      throw error;
    }
  }
}

// ==============================================================================
// 5. ASYNC/AWAIT VS PROMISES
// ==============================================================================

/*
WHAT: Two different syntaxes for handling asynchronous operations
WHY: JavaScript is single-threaded, so we need non-blocking ways to handle I/O
HOW: Promises use .then()/.catch(), async/await uses try/catch with simpler syntax
WHERE: Both work for API calls, file operations, timers, and other async tasks
*/

// WHAT: Promise-based approach (traditional)
// WHY: Understanding promises is fundamental to JavaScript async programming
// HOW: Chain .then() for success and .catch() for errors
// WHERE: Still useful for complex promise chains and older codebases
function getUsersWithPromises() {
  // WHAT: Return a promise chain
  // WHY: Allows caller to handle the async result
  // HOW: fetch() returns a promise, we chain additional promises
  // WHERE: Each .then() handles the previous promise's resolution
  return fetch(`${API_BASE_URL}/users`)
    .then((response) => {
      // WHAT: Handle the HTTP response
      // WHY: Need to check if request was successful
      // HOW: Arrow function receives the response object
      // WHERE: This runs when the HTTP request completes
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json(); // Returns another promise
    })
    .then((users) => {
      // WHAT: Handle the parsed JSON data
      // WHY: This is our final result
      // HOW: Previous .then() resolved with JSON data
      // WHERE: This runs after JSON parsing completes
      console.log("Users fetched with promises:", users);
      return users;
    })
    .catch((error) => {
      // WHAT: Handle any errors in the chain
      // WHY: Errors can occur at any step
      // HOW: .catch() handles rejected promises
      // WHERE: This runs if any promise in the chain rejects
      console.error("Promise error:", error);
      throw error; // Re-throw for caller
    });
}

// WHAT: Async/await approach (modern)
// WHY: Cleaner syntax, easier to read and debug
// HOW: async function can use await keyword to pause execution
// WHERE: Preferred for new code, easier error handling with try/catch
async function getUsersWithAsyncAwait() {
  try {
    // WHAT: Wait for the HTTP request to complete
    // WHY: We need the response before proceeding
    // HOW: await pauses execution until promise resolves
    // WHERE: Execution continues here when response is ready
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // WHAT: Wait for JSON parsing to complete
    // WHY: We need the actual data, not the promise
    // HOW: await the response.json() promise
    // WHERE: Execution pauses until JSON is parsed
    const users = await response.json();

    console.log("Users fetched with async/await:", users);
    return users;
  } catch (error) {
    // WHAT: Catch any errors from the try block
    // WHY: Handle both HTTP and parsing errors
    // HOW: try/catch works naturally with async/await
    // WHERE: This runs if any await expression rejects
    console.error("Async/await error:", error);
    throw error;
  }
}

// ==============================================================================
// 6. REST API CRUD OPERATIONS
// ==============================================================================

/*
WHAT: CRUD stands for Create, Read, Update, Delete - the basic data operations
WHY: These four operations cover most data manipulation needs
HOW: Map to HTTP methods: POST (Create), GET (Read), PUT/PATCH (Update), DELETE (Delete)
WHERE: Standard pattern used in most REST APIs
*/

// WHAT: Complete CRUD operations class
// WHY: Organize related API operations together
// HOW: Class methods for each CRUD operation
// WHERE: Reusable pattern for any REST API resource
class UserAPI {
  constructor(baseUrl) {
    // WHAT: Store the base URL for API endpoints
    // WHY: All operations need to know where to send requests
    // HOW: Constructor parameter allows flexibility
    // WHERE: Used as prefix for all API calls
    this.baseUrl = baseUrl;
  }

  // CREATE (POST) - Add new user
  async create(userData) {
    // WHAT: POST request to create new resource
    // WHY: Server needs to store new data and assign ID
    // HOW: Send JSON data in request body
    // WHERE: Typically posted to collection endpoint (/users)
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      const createdUser = await response.json();
      console.log("User created:", createdUser);
      return createdUser;
    } catch (error) {
      console.error("Create error:", error);
      throw error;
    }
  }

  // READ (GET) - Retrieve users
  async getAll() {
    // WHAT: GET request for all resources
    // WHY: Need to display or process multiple items
    // HOW: Simple GET to collection endpoint
    // WHERE: Returns array of all users
    try {
      const response = await fetch(`${this.baseUrl}/users`);

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const users = await response.json();
      console.log("All users retrieved:", users.length);
      return users;
    } catch (error) {
      console.error("Get all error:", error);
      throw error;
    }
  }

  async getById(id) {
    // WHAT: GET request for specific resource
    // WHY: Need details for one particular item
    // HOW: Include ID in URL path
    // WHERE: Returns single user object
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User with ID ${id} not found`);
        }
        throw new Error(`Failed to fetch user: ${response.status}`);
      }

      const user = await response.json();
      console.log("User retrieved:", user);
      return user;
    } catch (error) {
      console.error("Get by ID error:", error);
      throw error;
    }
  }

  // UPDATE (PUT) - Replace entire resource
  async update(id, userData) {
    // WHAT: PUT request to replace entire resource
    // WHY: Need to update all fields of an existing item
    // HOW: Send complete object in request body
    // WHERE: PUT to specific resource endpoint (/users/1)
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log("User updated:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Update error:", error);
      throw error;
    }
  }

  // UPDATE (PATCH) - Partial update
  async partialUpdate(id, partialData) {
    // WHAT: PATCH request to update specific fields
    // WHY: Only need to change some fields, not entire resource
    // HOW: Send only the fields that changed
    // WHERE: More efficient than PUT for small changes
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialData),
      });

      if (!response.ok) {
        throw new Error(`Failed to patch user: ${response.status}`);
      }

      const patchedUser = await response.json();
      console.log("User patched:", patchedUser);
      return patchedUser;
    } catch (error) {
      console.error("Patch error:", error);
      throw error;
    }
  }

  // DELETE - Remove resource
  async delete(id) {
    // WHAT: DELETE request to remove resource
    // WHY: Need to permanently remove data
    // HOW: Send DELETE to specific resource endpoint
    // WHERE: Usually returns confirmation or empty response
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User with ID ${id} not found`);
        }
        throw new Error(`Failed to delete user: ${response.status}`);
      }

      // WHAT: Handle empty response body
      // WHY: DELETE often returns empty response (204 No Content)
      // HOW: Check if response has content before parsing
      // WHERE: Avoid parsing errors on empty responses
      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { message: `User ${id} deleted successfully` };
      }

      console.log("User deleted:", result);
      return result;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }
}

// ==============================================================================
// 7. AUTHENTICATION & HEADERS
// ==============================================================================

/*
WHAT: Authentication verifies who you are, authorization determines what you can do
WHY: APIs need to protect data and limit access to authorized users
HOW: Common methods include API keys, JWT tokens, OAuth, Basic Auth
WHERE: Usually sent in HTTP headers, sometimes in query parameters or request body
*/

// WHAT: API client with authentication support
// WHY: Most real APIs require authentication
// HOW: Store and send authentication tokens with requests
// WHERE: Headers are the standard place for auth information
class AuthenticatedAPI {
  constructor(baseUrl, authToken = null) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  // WHAT: Set authentication token
  // WHY: Token might be obtained after login or from storage
  // HOW: Store token for use in subsequent requests
  // WHERE: Called after successful login or when loading saved token
  setAuthToken(token) {
    this.authToken = token;
    console.log("Authentication token updated");
  }

  // WHAT: Build headers with authentication
  // WHY: Most requests need consistent headers
  // HOW: Combine default headers with auth headers
  // WHERE: Used by all API methods
  getHeaders(additionalHeaders = {}) {
    // WHAT: Start with basic headers
    // WHY: All requests need content type specification
    // HOW: Create object with default headers
    // WHERE: Foundation for all HTTP requests
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    // WHAT: Add authentication header if token exists
    // WHY: Protected endpoints require authentication
    // HOW: Bearer token is a common authentication scheme
    // WHERE: Authorization header is the standard location
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    // WHAT: Merge with any additional headers
    // WHY: Some requests might need special headers
    // HOW: Object spread operator combines objects
    // WHERE: Allows flexibility for specific requests
    return { ...headers, ...additionalHeaders };
  }

  // WHAT: Login method to get authentication token
  // WHY: Users need to authenticate before accessing protected resources
  // HOW: Send credentials to login endpoint
  // WHERE: Usually a special /auth or /login endpoint
  async login(email, password) {
    try {
      // WHAT: Send login credentials
      // WHY: Server needs to verify user identity
      // HOW: POST username/password to auth endpoint
      // WHERE: This example uses a mock login endpoint
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const authData = await response.json();

      // WHAT: Store the received token
      // WHY: Need token for future authenticated requests
      // HOW: Extract token from response and store it
      // WHERE: Token is typically in response body
      if (authData.token) {
        this.setAuthToken(authData.token);
        console.log("Login successful");
        return authData;
      } else {
        throw new Error("No token received from login");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // WHAT: Authenticated GET request
  // WHY: Need to access protected user data
  // HOW: Include auth headers with request
  // WHERE: Used for accessing protected endpoints
  async getProtectedData(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      // WHAT: Handle authentication errors
      // WHY: Token might be expired or invalid
      // HOW: Check for 401 Unauthorized status
      // WHERE: Server returns 401 when auth fails
      if (response.status === 401) {
        throw new Error("Authentication required or token expired");
      }

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Protected request error:", error);
      throw error;
    }
  }

  // WHAT: Logout method
  // WHY: Clean up authentication state
  // HOW: Clear stored token and optionally notify server
  // WHERE: Called when user logs out
  async logout() {
    try {
      // WHAT: Notify server about logout (optional)
      // WHY: Server might want to invalidate the token
      // HOW: Send POST to logout endpoint with current token
      // WHERE: Some APIs have logout endpoints
      if (this.authToken) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: this.getHeaders(),
        });
      }

      // WHAT: Clear local authentication state
      // WHY: Prevent unauthorized access with old token
      // HOW: Set token to null
      // WHERE: Local cleanup regardless of server response
      this.authToken = null;
      console.log("Logged out successfully");
    } catch (error) {
      // WHAT: Still clear local state even if server request fails
      // WHY: User should be logged out locally regardless
      // HOW: Clear token in finally or catch block
      // WHERE: Ensure cleanup happens
      this.authToken = null;
      console.error("Logout error (but cleared locally):", error);
    }
  }
}

// ==============================================================================
// 8. REAL-WORLD EXAMPLES
// ==============================================================================

/*
WHAT: Practical examples showing common API usage patterns
WHY: Demonstrate how to combine concepts for real applications
HOW: Complete workflows with error handling and user feedback
WHERE: Patterns you'll use in actual web applications
*/

// WHAT: User management system example
// WHY: Common requirement in web applications
// HOW: Combine CRUD operations with proper error handling
// WHERE: Frontend application managing user data
class UserManager {
  constructor() {
    this.api = new UserAPI(API_BASE_URL);
    this.users = []; // Local cache of users
  }

  // WHAT: Load and display all users
  // WHY: Show current data to user
  // HOW: Fetch from API and update local state
  // WHERE: Called when page loads or data refreshes
  async loadUsers() {
    try {
      // WHAT: Show loading state to user
      // WHY: API calls take time, user needs feedback
      // HOW: Update UI before starting request
      // WHERE: Improves user experience
      this.showLoading("Loading users...");

      const users = await this.api.getAll();
      this.users = users;
      this.displayUsers();
    } catch (error) {
      // WHAT: Show error message to user
      // WHY: User needs to know what went wrong
      // HOW: Display friendly error message
      // WHERE: Better than silent failures
      this.showError("Failed to load users: " + error.message);
    } finally {
      // WHAT: Hide loading state
      // WHY: Loading indicator should disappear regardless of success/failure
      // HOW: finally block runs after try or catch
      // WHERE: Cleanup code that always runs
      this.hideLoading();
    }
  }

  // WHAT: Create new user with validation
  // WHY: Prevent invalid data from being sent to API
  // HOW: Validate locally before making API call
  // WHERE: Form submission handler
  async createUser(formData) {
    try {
      // WHAT: Validate input data
      // WHY: Catch errors early, save API calls
      // HOW: Check required fields and formats
      // WHERE: Before making expensive API request
      if (!this.validateUserData(formData)) {
        throw new Error("Please fill all required fields correctly");
      }

      this.showLoading("Creating user...");

      const newUser = await this.api.create(formData);

      // WHAT: Update local state
      // WHY: Keep UI in sync with server
      // HOW: Add new user to local array
      // WHERE: After successful API call
      this.users.push(newUser);
      this.displayUsers();

      // WHAT: Clear form and show success
      // WHY: Good user experience
      // HOW: Reset form fields and show confirmation
      // WHERE: After successful creation
      this.clearForm();
      this.showSuccess("User created successfully!");
    } catch (error) {
      this.showError("Failed to create user: " + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // WHAT: Update existing user
  // WHY: Allow editing of user information
  // HOW: Send updated data to API and refresh display
  // WHERE: Edit form submission
  async updateUser(userId, formData) {
    try {
      if (!this.validateUserData(formData)) {
        throw new Error("Please fill all required fields correctly");
      }

      this.showLoading("Updating user...");

      const updatedUser = await this.api.update(userId, formData);

      // WHAT: Update user in local array
      // WHY: Keep local state synchronized
      // HOW: Find and replace user in array
      // WHERE: After successful API update
      const index = this.users.findIndex((user) => user.id == userId);
      if (index !== -1) {
        this.users[index] = updatedUser;
        this.displayUsers();
      }

      this.showSuccess("User updated successfully!");
    } catch (error) {
      this.showError("Failed to update user: " + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // WHAT: Delete user with confirmation
  // WHY: Prevent accidental deletions
  // HOW: Ask for confirmation before making API call
  // WHERE: Delete button click handler
  async deleteUser(userId, userName) {
    // WHAT: Ask user to confirm deletion
    // WHY: Deletion is irreversible
    // HOW: Use browser confirm dialog
    // WHERE: Before making destructive API call
    const confirmed = confirm(
      `Are you sure you want to delete user "${userName}"?`
    );

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      this.showLoading("Deleting user...");

      await this.api.delete(userId);

      // WHAT: Remove user from local array
      // WHY: Update UI to reflect deletion
      // HOW: Filter out the deleted user
      // WHERE: After successful API deletion
      this.users = this.users.filter((user) => user.id != userId);
      this.displayUsers();

      this.showSuccess("User deleted successfully!");
    } catch (error) {
      this.showError("Failed to delete user: " + error.message);
    } finally {
      this.hideLoading();
    }
  }

  // WHAT: Search users by name or email
  // WHY: Help users find specific records quickly
  // HOW: Filter local data or make API search request
  // WHERE: Search input handler
  async searchUsers(searchTerm) {
    if (!searchTerm) {
      // WHAT: Show all users when search is empty
      // WHY: Clear search should show all results
      // HOW: Display the full users array
      // WHERE: When search input is cleared
      this.displayUsers();
      return;
    }

    try {
      // WHAT: Filter users locally
      // WHY: Faster than API calls for simple searches
      // HOW: Use array filter and includes methods
      // WHERE: Good for client-side filtering
      const filteredUsers = this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      this.displayUsers(filteredUsers);

      // Alternative: Server-side search
      // WHY: Better for large datasets or complex search
      // HOW: Send search term to API endpoint
      // WHERE: Use when local filtering isn't sufficient
      /*
            const searchResults = await fetch(`${API_BASE_URL}/users?search=${encodeURIComponent(searchTerm)}`);
            const users = await searchResults.json();
            this.displayUsers(users);
            */
    } catch (error) {
      this.showError("Search failed: " + error.message);
    }
  }

  // WHAT: Validate user input data
  // WHY: Ensure data quality before API calls
  // HOW: Check required fields and basic formats
  // WHERE: Called before create and update operations
  validateUserData(data) {
    // WHAT: Check required fields
    // WHY: API will reject incomplete data
    // HOW: Verify essential properties exist and aren't empty
    // WHERE: Basic validation before API call
    if (!data.name || data.name.trim().length < 2) {
      return false;
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      return false;
    }

    if (!data.username || data.username.trim().length < 3) {
      return false;
    }

    return true;
  }

  // WHAT: Email format validation
  // WHY: Ensure email addresses are properly formatted
  // HOW: Use regular expression to check format
  // WHERE: Called from validateUserData
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UI Helper Methods (would be implemented based on your frontend framework)
  showLoading(message) {
    console.log("LOADING:", message);
  }
  hideLoading() {
    console.log("Loading hidden");
  }
  showError(message) {
    console.error("ERROR:", message);
  }
  showSuccess(message) {
    console.log("SUCCESS:", message);
  }
  displayUsers(users = this.users) {
    console.log("DISPLAY:", users);
  }
  clearForm() {
    console.log("Form cleared");
  }
}

// ==============================================================================
// 9. BEST PRACTICES
// ==============================================================================

/*
WHAT: Guidelines for writing maintainable, reliable API code
WHY: Prevent common mistakes and improve code quality
HOW: Follow established patterns and handle edge cases
WHERE: Apply these principles to all API interactions
*/

// WHAT: API client with best practices implemented
// WHY: Demonstrate production-ready patterns
// HOW: Include retry logic, caching, timeouts, and proper error handling
// WHERE: Use as template for real applications
class BestPracticeAPI {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;

    // WHAT: Configuration options with defaults
    // WHY: Make the API client flexible and configurable
    // HOW: Use object destructuring with default values
    // WHERE: Allow customization while providing sensible defaults
    this.config = {
      timeout: options.timeout || 10000, // 10 second timeout
      retryAttempts: options.retryAttempts || 3,
      retryDelay: options.retryDelay || 1000, // 1 second
      cacheEnabled: options.cacheEnabled || true,
      maxCacheAge: options.maxCacheAge || 300000, // 5 minutes
    };

    // WHAT: Simple cache for GET requests
    // WHY: Reduce unnecessary API calls and improve performance
    // HOW: Store responses with timestamps
    // WHERE: Useful for data that doesn't change frequently
    this.cache = new Map();
  }

  // WHAT: Request method with timeout support
  // WHY: Prevent requests from hanging indefinitely
  // HOW: Use AbortController to cancel requests after timeout
  // WHERE: Wrapper around fetch for all requests
  async request(url, options = {}) {
    // WHAT: Create abort controller for timeout
    // WHY: Allow cancelling requests that take too long
    // HOW: AbortController provides signal to cancel fetch
    // WHERE: Essential for user experience and resource management
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, this.config.timeout);

    try {
      // WHAT: Add abort signal to request options
      // WHY: Connect timeout mechanism to fetch request
      // HOW: Merge signal with existing options
      // WHERE: All requests should respect timeout
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      // Clear timeout since request completed
      clearTimeout(timeoutId);

      return response;
    } catch (error) {
      clearTimeout(timeoutId);

      // WHAT: Handle timeout errors specifically
      // WHY: Provide clear error messages for timeouts
      // HOW: Check error name for AbortError
      // WHERE: Better user experience than generic error
      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${this.config.timeout}ms`);
      }
      throw error;
    }
  }

  // WHAT: GET request with caching and retry logic
  // WHY: Improve performance and reliability
  // HOW: Check cache first, retry on failure, store successful responses
  // WHERE: Use for read operations that benefit from caching
  async get(endpoint, options = {}) {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    const cacheKey = fullUrl;

    // WHAT: Check cache first
    // WHY: Avoid unnecessary network requests
    // HOW: Look up URL in cache and check age
    // WHERE: Only for GET requests that can be cached
    if (this.config.cacheEnabled && !options.skipCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.config.maxCacheAge) {
        console.log("Returning cached response for:", endpoint);
        return cached.data;
      }
    }

    // WHAT: Retry logic for failed requests
    // WHY: Network requests can fail temporarily
    // HOW: Loop with exponential backoff
    // WHERE: Useful for transient network issues
    let lastError;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`GET ${endpoint} (attempt ${attempt})`);

        const response = await this.request(fullUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...options.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // WHAT: Cache successful responses
        // WHY: Improve performance for repeated requests
        // HOW: Store data with timestamp
        // WHERE: Only cache successful GET responses
        if (this.config.cacheEnabled) {
          this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now(),
          });
        }

        return data;
      } catch (error) {
        lastError = error;

        // WHAT: Don't retry certain errors
        // WHY: Some errors won't be fixed by retrying
        // HOW: Check error types and status codes
        // WHERE: Avoid wasting time on permanent failures
        if (
          error.message.includes("404") ||
          error.message.includes("401") ||
          error.message.includes("403")
        ) {
          break; // Don't retry client errors
        }

        // WHAT: Wait before retrying
        // WHY: Give server time to recover
        // HOW: Exponential backoff increases delay each attempt
        // WHERE: Between retry attempts
        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          console.log(`Retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  // WHAT: POST request with retry logic
  // WHY: Create operations should also be reliable
  // HOW: Similar retry logic but no caching
  // WHERE: Used for data creation
  async post(endpoint, data, options = {}) {
    const fullUrl = `${this.baseUrl}${endpoint}`;

    let lastError;
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        console.log(`POST ${endpoint} (attempt ${attempt})`);

        const response = await this.request(fullUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        // WHAT: Be more conservative with POST retries
        // WHY: POST operations might not be idempotent
        // HOW: Only retry on network errors, not HTTP errors
        // WHERE: Avoid duplicate creation
        if (error.message.includes("HTTP")) {
          break; // Don't retry HTTP errors for POST
        }

        if (attempt < this.config.retryAttempts) {
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  // WHAT: Clear cache for specific endpoint or all
  // WHY: Force fresh data when needed
  // HOW: Remove entries from cache Map
  // WHERE: After data modifications or on user request
  clearCache(endpoint = null) {
    if (endpoint) {
      const fullUrl = `${this.baseUrl}${endpoint}`;
      this.cache.delete(fullUrl);
      console.log(`Cache cleared for: ${endpoint}`);
    } else {
      this.cache.clear();
      console.log("All cache cleared");
    }
  }

  // WHAT: Utility method for delays
  // WHY: Need to wait between retry attempts
  // HOW: Return promise that resolves after specified time
  // WHERE: Used in retry logic
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // WHAT: Get cache statistics
  // WHY: Monitor cache performance and usage
  // HOW: Analyze cache Map contents
  // WHERE: Debugging and optimization
  getCacheStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    return {
      totalEntries: entries.length,
      validEntries: entries.filter(
        ([, data]) => now - data.timestamp < this.config.maxCacheAge
      ).length,
      oldestEntry:
        entries.length > 0
          ? Math.min(...entries.map(([, data]) => data.timestamp))
          : null,
      newestEntry:
        entries.length > 0
          ? Math.max(...entries.map(([, data]) => data.timestamp))
          : null,
    };
  }
}

// ==============================================================================
// 10. CREATING API SERVERS (NODE.JS)
// ==============================================================================

/*
WHAT: Creating your own REST API server using Node.js
WHY: Understanding server-side development completes the API picture
HOW: Use Node.js built-in modules or frameworks like Express.js
WHERE: Backend development, microservices, full-stack applications
*/

// WHAT: Basic HTTP server using Node.js built-in modules
// WHY: Understanding the fundamentals before using frameworks
// HOW: Use 'http' module to create server and handle requests
// WHERE: Learning purposes, simple APIs, or when avoiding dependencies

// First, let's show what a package.json would look like for a Node.js API server
/*
WHAT: package.json configuration for API server
WHY: Defines project dependencies and scripts
HOW: JSON file with metadata and dependency list
WHERE: Root of your Node.js project

{
  "name": "api-server-tutorial",
  "version": "1.0.0",
  "description": "Tutorial for creating REST API servers",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "body-parser": "^1.20.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.0",
    "jest": "^29.0.0"
  }
}
*/

// WHAT: Basic Node.js HTTP server (without frameworks)
// WHY: Understand how HTTP servers work at the core level
// HOW: Use Node.js 'http' module to create server
// WHERE: Educational purposes or very simple APIs
function createBasicServer() {
  // WHAT: Import required Node.js modules
  // WHY: Need HTTP module for server, URL for parsing, querystring for parameters
  // HOW: Use require() to import built-in Node.js modules
  // WHERE: Top of server file, before other code
  const http = require("http");
  const url = require("url");
  const querystring = require("querystring");

  // WHAT: In-memory data store (for demo purposes)
  // WHY: Need somewhere to store data without a database
  // HOW: Simple JavaScript array to hold user objects
  // WHERE: Replace with real database in production
  let users = [
    { id: 1, name: "John Doe", email: "john@example.com", username: "johndoe" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      username: "janesmith",
    },
  ];
  let nextId = 3; // Track next available ID

  // WHAT: Helper function to parse request body
  // WHY: HTTP requests with body data need to be read from stream
  // HOW: Listen to 'data' and 'end' events on request stream
  // WHERE: Used for POST, PUT, PATCH requests
  function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
      let body = "";

      // WHAT: Listen for data chunks
      // WHY: Request body comes in chunks over the network
      // HOW: Concatenate each chunk to build complete body
      // WHERE: Data event fires for each chunk received
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      // WHAT: Handle end of request body
      // WHY: Need to know when all data has been received
      // HOW: Parse complete body as JSON and resolve promise
      // WHERE: End event fires when all chunks received
      req.on("end", () => {
        try {
          const data = body ? JSON.parse(body) : {};
          resolve(data);
        } catch (error) {
          reject(new Error("Invalid JSON in request body"));
        }
      });

      // WHAT: Handle request errors
      // WHY: Network issues can cause request stream errors
      // HOW: Reject promise with error
      // WHERE: Error event fires on stream problems
      req.on("error", reject);
    });
  }

  // WHAT: Helper function to send JSON responses
  // WHY: Standardize response format and headers
  // HOW: Set appropriate headers and stringify JSON data
  // WHERE: Used by all route handlers
  function sendJSON(res, data, statusCode = 200) {
    // WHAT: Set response headers
    // WHY: Tell client what type of data we're sending
    // HOW: Set Content-Type header to application/json
    // WHERE: Must be set before writing response body
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Enable CORS
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // WHAT: Set status code and send response
    // WHY: HTTP status code indicates result of request
    // HOW: Set statusCode property and write JSON string
    // WHERE: Final step in handling request
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  }

  // WHAT: Helper function to send error responses
  // WHY: Standardize error response format
  // HOW: Create error object with message and send as JSON
  // WHERE: Used when errors occur in request handling
  function sendError(res, message, statusCode = 400) {
    sendJSON(res, { error: message }, statusCode);
  }

  // WHAT: Main request handler function
  // WHY: Process all incoming HTTP requests
  // HOW: Parse URL and method, route to appropriate handler
  // WHERE: Called for every HTTP request to server
  const requestHandler = async (req, res) => {
    try {
      // WHAT: Parse request URL and extract components
      // WHY: Need to know what resource and action client wants
      // HOW: Use url.parse() to break down URL into parts
      // WHERE: First step in processing any request
      const parsedUrl = url.parse(req.url, true);
      const path = parsedUrl.pathname;
      const method = req.method;
      const query = parsedUrl.query;

      console.log(`${method} ${path}`);

      // WHAT: Handle CORS preflight requests
      // WHY: Browsers send OPTIONS requests before actual API calls
      // HOW: Respond with allowed methods and headers
      // WHERE: Required for cross-origin requests from web browsers
      if (method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE, PATCH"
        );
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.statusCode = 200;
        res.end();
        return;
      }

      // WHAT: Route handling - GET /users (get all users)
      // WHY: Client needs to retrieve list of all users
      // HOW: Return users array as JSON response
      // WHERE: READ operation in CRUD
      if (path === "/users" && method === "GET") {
        sendJSON(res, users);
        return;
      }

      // WHAT: Route handling - GET /users/:id (get specific user)
      // WHY: Client needs details for one specific user
      // HOW: Extract ID from URL, find user, return user data
      // WHERE: READ operation for single resource
      if (path.startsWith("/users/") && method === "GET") {
        const id = parseInt(path.split("/")[2]);
        const user = users.find((u) => u.id === id);

        if (user) {
          sendJSON(res, user);
        } else {
          sendError(res, "User not found", 404);
        }
        return;
      }

      // WHAT: Route handling - POST /users (create new user)
      // WHY: Client wants to add new user to system
      // HOW: Parse request body, validate data, add to users array
      // WHERE: CREATE operation in CRUD
      if (path === "/users" && method === "POST") {
        const userData = await parseRequestBody(req);

        // WHAT: Validate required fields
        // WHY: Ensure data quality and prevent errors
        // HOW: Check that essential fields are present and valid
        // WHERE: Before processing any user data
        if (!userData.name || !userData.email || !userData.username) {
          sendError(res, "Missing required fields: name, email, username", 400);
          return;
        }

        // WHAT: Check for duplicate username or email
        // WHY: Usernames and emails should be unique
        // HOW: Search existing users for matches
        // WHERE: Before creating new user
        const existingUser = users.find(
          (u) => u.username === userData.username || u.email === userData.email
        );

        if (existingUser) {
          sendError(res, "Username or email already exists", 409);
          return;
        }

        // WHAT: Create new user object
        // WHY: Need to store user data with generated ID
        // HOW: Combine provided data with generated ID
        // WHERE: After validation passes
        const newUser = {
          id: nextId++,
          name: userData.name,
          email: userData.email,
          username: userData.username,
          address: userData.address || {},
          phone: userData.phone || "",
          website: userData.website || "",
        };

        users.push(newUser);
        sendJSON(res, newUser, 201); // 201 = Created
        return;
      }

      // WHAT: Route handling - PUT /users/:id (update entire user)
      // WHY: Client wants to replace all user data
      // HOW: Parse ID and body, find user, replace data
      // WHERE: UPDATE operation (full replacement)
      if (path.startsWith("/users/") && method === "PUT") {
        const id = parseInt(path.split("/")[2]);
        const userData = await parseRequestBody(req);
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
          sendError(res, "User not found", 404);
          return;
        }

        // WHAT: Validate required fields for update
        // WHY: PUT should include all required data
        // HOW: Check essential fields are present
        // WHERE: Before updating user data
        if (!userData.name || !userData.email || !userData.username) {
          sendError(res, "Missing required fields: name, email, username", 400);
          return;
        }

        // WHAT: Update user with new data
        // WHY: Replace existing user data completely
        // HOW: Keep existing ID but replace all other fields
        // WHERE: After validation passes
        const updatedUser = {
          id: id, // Keep original ID
          name: userData.name,
          email: userData.email,
          username: userData.username,
          address: userData.address || {},
          phone: userData.phone || "",
          website: userData.website || "",
        };

        users[userIndex] = updatedUser;
        sendJSON(res, updatedUser);
        return;
      }

      // WHAT: Route handling - PATCH /users/:id (partial update)
      // WHY: Client wants to update only specific fields
      // HOW: Parse ID and body, find user, merge data
      // WHERE: UPDATE operation (partial replacement)
      if (path.startsWith("/users/") && method === "PATCH") {
        const id = parseInt(path.split("/")[2]);
        const updateData = await parseRequestBody(req);
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
          sendError(res, "User not found", 404);
          return;
        }

        // WHAT: Merge update data with existing user
        // WHY: PATCH should only change specified fields
        // HOW: Use object spread to combine existing and new data
        // WHERE: Preserve unchanged fields
        const updatedUser = {
          ...users[userIndex],
          ...updateData,
          id: id, // Ensure ID cannot be changed
        };

        users[userIndex] = updatedUser;
        sendJSON(res, updatedUser);
        return;
      }

      // WHAT: Route handling - DELETE /users/:id (delete user)
      // WHY: Client wants to remove user from system
      // HOW: Parse ID, find user, remove from array
      // WHERE: DELETE operation in CRUD
      if (path.startsWith("/users/") && method === "DELETE") {
        const id = parseInt(path.split("/")[2]);
        const userIndex = users.findIndex((u) => u.id === id);

        if (userIndex === -1) {
          sendError(res, "User not found", 404);
          return;
        }

        // WHAT: Remove user from array
        // WHY: Delete operation should remove data
        // HOW: Use splice to remove element at specific index
        // WHERE: After confirming user exists
        const deletedUser = users.splice(userIndex, 1)[0];
        sendJSON(res, {
          message: "User deleted successfully",
          user: deletedUser,
        });
        return;
      }

      // WHAT: Handle unknown routes
      // WHY: Client might request non-existent endpoints
      // HOW: Return 404 error for unmatched routes
      // WHERE: Fallback for unhandled requests
      sendError(res, "Route not found", 404);
    } catch (error) {
      // WHAT: Handle unexpected server errors
      // WHY: Prevent server crashes and provide error feedback
      // HOW: Catch all errors and return generic error response
      // WHERE: Outer error handling for all request processing
      console.error("Server error:", error);
      sendError(res, "Internal server error", 500);
    }
  };

  // WHAT: Create and configure HTTP server
  // WHY: Need server instance to handle HTTP requests
  // HOW: Pass request handler function to http.createServer
  // WHERE: Main server setup
  const server = http.createServer(requestHandler);

  // WHAT: Start server listening on specified port
  // WHY: Server needs to bind to port to receive requests
  // HOW: Call listen() with port number and callback
  // WHERE: Final step in server setup
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Basic server running on port ${PORT}`);
    console.log("Available endpoints:");
    console.log("  GET    /users      - Get all users");
    console.log("  GET    /users/:id  - Get user by ID");
    console.log("  POST   /users      - Create new user");
    console.log("  PUT    /users/:id  - Update entire user");
    console.log("  PATCH  /users/:id  - Partial update user");
    console.log("  DELETE /users/:id  - Delete user");
  });

  return server;
}

// WHAT: Express.js server (recommended for production)
// WHY: Express provides routing, middleware, and many conveniences
// HOW: Use Express framework for cleaner, more maintainable code
// WHERE: Production applications, complex APIs
function createExpressServer() {
  // WHAT: Import Express and related modules
  // WHY: Express simplifies server creation and request handling
  // HOW: Use require() to import necessary packages
  // WHERE: Top of Express server file
  const express = require("express");
  const cors = require("cors");

  // WHAT: Create Express application instance
  // WHY: Express app manages routes and middleware
  // HOW: Call express() function to create app
  // WHERE: Foundation of Express server
  const app = express();

  // WHAT: Configure middleware
  // WHY: Middleware processes requests before route handlers
  // HOW: Use app.use() to register middleware functions
  // WHERE: Before defining routes

  // WHAT: Enable CORS (Cross-Origin Resource Sharing)
  // WHY: Allow web browsers to make requests from different domains
  // HOW: Use cors middleware package
  // WHERE: Essential for frontend-backend communication
  app.use(cors());

  // WHAT: Parse JSON request bodies
  // WHY: APIs need to read JSON data from client requests
  // HOW: Use express.json() built-in middleware
  // WHERE: Required for POST, PUT, PATCH requests
  app.use(express.json());

  // WHAT: Parse URL-encoded form data
  // WHY: Support traditional form submissions
  // HOW: Use express.urlencoded() middleware
  // WHERE: If supporting form-based requests
  app.use(express.urlencoded({ extended: true }));

  // WHAT: Request logging middleware
  // WHY: Track API usage and debug issues
  // HOW: Custom middleware function that logs request details
  // WHERE: Helpful for development and monitoring
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next(); // WHAT: Call next() to continue to next middleware/route
  });

  // WHAT: In-memory data store (same as basic server)
  // WHY: Demo purposes - replace with database in production
  // HOW: JavaScript array with sample data
  // WHERE: Would be database connection in real application
  let users = [
    { id: 1, name: "John Doe", email: "john@example.com", username: "johndoe" },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      username: "janesmith",
    },
  ];
  let nextId = 3;

  // WHAT: Input validation middleware
  // WHY: Centralize validation logic for reuse
  // HOW: Custom middleware that checks required fields
  // WHERE: Used by POST and PUT routes
  const validateUser = (req, res, next) => {
    const { name, email, username } = req.body;

    // WHAT: Check required fields
    // WHY: Ensure data quality
    // HOW: Verify fields exist and have content
    // WHERE: Before processing user data
    if (!name || !email || !username) {
      return res.status(400).json({
        error: "Missing required fields: name, email, username",
      });
    }

    // WHAT: Basic email validation
    // WHY: Ensure email format is reasonable
    // HOW: Simple regex check for email pattern
    // WHERE: Part of data validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Invalid email format",
      });
    }

    // WHAT: Continue to next middleware/route
    // WHY: Validation passed, proceed with request
    // HOW: Call next() function
    // WHERE: After all validation checks pass
    next();
  };

  // WHAT: Express route handlers (much cleaner than basic server)
  // WHY: Express routing is more readable and maintainable
  // HOW: Use app.get(), app.post(), etc. methods
  // WHERE: Define all API endpoints

  // GET /users - Retrieve all users
  app.get("/users", (req, res) => {
    // WHAT: Optional query parameters for filtering/pagination
    // WHY: Large datasets need filtering and pagination
    // HOW: Extract query parameters from request
    // WHERE: Common pattern for list endpoints
    const { page, limit, search } = req.query;

    let result = users;

    // WHAT: Search functionality
    // WHY: Users need to find specific records
    // HOW: Filter array based on search term
    // WHERE: Optional feature for better UX
    if (search) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    // WHAT: Pagination support
    // WHY: Large datasets should be paginated
    // HOW: Calculate offset and limit for array slicing
    // WHERE: Professional APIs include pagination
    if (page && limit) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const startIndex = (pageNum - 1) * limitNum;
      const endIndex = startIndex + limitNum;

      result = result.slice(startIndex, endIndex);

      // WHAT: Include pagination metadata
      // WHY: Clients need to know total count and pagination info
      // HOW: Add metadata to response
      // WHERE: Standard pagination response format
      return res.json({
        users: result,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: users.length,
          totalPages: Math.ceil(users.length / limitNum),
        },
      });
    }

    res.json(result);
  });

  // GET /users/:id - Retrieve specific user
  app.get("/users/:id", (req, res) => {
    // WHAT: Extract ID parameter from URL
    // WHY: Need to know which user to retrieve
    // HOW: Access req.params.id and convert to number
    // WHERE: Express automatically parses URL parameters
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  });

  // POST /users - Create new user
  app.post("/users", validateUser, (req, res) => {
    // WHAT: Check for duplicate username or email
    // WHY: Ensure uniqueness constraints
    // HOW: Search existing users for matches
    // WHERE: Before creating new user
    const existingUser = users.find(
      (u) => u.username === req.body.username || u.email === req.body.email
    );

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Username or email already exists" });
    }

    // WHAT: Create new user object
    // WHY: Add user to system with generated ID
    // HOW: Combine request data with generated ID
    // WHERE: After validation and uniqueness checks
    const newUser = {
      id: nextId++,
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      address: req.body.address || {},
      phone: req.body.phone || "",
      website: req.body.website || "",
      createdAt: new Date().toISOString(), // WHAT: Add timestamp
    };

    users.push(newUser);

    // WHAT: Return created user with 201 status
    // WHY: 201 indicates successful resource creation
    // HOW: Use res.status().json() to set status and send data
    // WHERE: Standard REST API response pattern
    res.status(201).json(newUser);
  });

  // PUT /users/:id - Update entire user
  app.put("/users/:id", validateUser, (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // WHAT: Create updated user object
    // WHY: PUT replaces entire resource
    // HOW: Use all data from request body
    // WHERE: Keep original ID and timestamps
    const updatedUser = {
      ...users[userIndex], // Keep original metadata
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      address: req.body.address || {},
      phone: req.body.phone || "",
      website: req.body.website || "",
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    res.json(updatedUser);
  });

  // PATCH /users/:id - Partial update
  app.patch("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // WHAT: Merge update data with existing user
    // WHY: PATCH only updates provided fields
    // HOW: Use object spread to combine data
    // WHERE: Preserve unchanged fields
    const updatedUser = {
      ...users[userIndex],
      ...req.body,
      id: id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString(),
    };

    users[userIndex] = updatedUser;
    res.json(updatedUser);
  });

  // DELETE /users/:id - Delete user
  app.delete("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    res.json({
      message: "User deleted successfully",
      user: deletedUser,
    });
  });

  // WHAT: Health check endpoint
  // WHY: Monitor server status and uptime
  // HOW: Simple endpoint that returns server status
  // WHERE: Standard practice for production APIs
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
    });
  });

  // WHAT: API information endpoint
  // WHY: Provide API documentation and available endpoints
  // HOW: Return structured information about the API
  // WHERE: Helpful for API discovery and testing
  app.get("/api", (req, res) => {
    res.json({
      name: "User Management API",
      version: "1.0.0",
      description: "REST API for managing users",
      endpoints: {
        "GET /users": "Get all users (supports ?search, ?page, ?limit)",
        "GET /users/:id": "Get user by ID",
        "POST /users": "Create new user",
        "PUT /users/:id": "Update entire user",
        "PATCH /users/:id": "Partially update user",
        "DELETE /users/:id": "Delete user",
        "GET /health": "Health check",
        "GET /api": "API information",
      },
    });
  });

  // WHAT: Error handling middleware
  // WHY: Catch and handle any unhandled errors
  // HOW: Express error middleware with 4 parameters
  // WHERE: Should be last middleware registered
  app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  });

  // WHAT: 404 handler for unknown routes
  // WHY: Provide helpful response for invalid endpoints
  // HOW: Catch-all route that runs if no other routes match
  // WHERE: Should be registered after all other routes
  app.use("*", (req, res) => {
    res.status(404).json({
      error: "Route not found",
      message: `${req.method} ${req.originalUrl} is not a valid endpoint`,
      availableEndpoints: "/api",
    });
  });

  // WHAT: Start Express server
  // WHY: Begin listening for HTTP requests
  // HOW: Call app.listen() with port and callback
  // WHERE: Final step in server setup
  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/api for API information`);
    console.log(`Visit http://localhost:${PORT}/health for health check`);
  });

  return server;
}

// WHAT: Advanced server features and middleware
// WHY: Production servers need additional functionality
// HOW: Add authentication, rate limiting, logging, etc.
// WHERE: Enterprise and production applications
function createAdvancedExpressServer() {
  const express = require("express");
  const cors = require("cors");

  const app = express();

  // WHAT: Security middleware
  // WHY: Protect against common web vulnerabilities
  // HOW: Use security-focused middleware packages
  // WHERE: Essential for production APIs

  // Rate limiting middleware
  const rateLimit = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
  };

  // WHAT: Simple rate limiting implementation
  // WHY: Prevent API abuse and DoS attacks
  // HOW: Track requests per IP address
  // WHERE: Before route handlers
  const requestCounts = new Map();

  app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - rateLimit.windowMs;

    // WHAT: Clean old entries
    // WHY: Prevent memory leaks from old IP tracking
    // HOW: Remove entries older than time window
    // WHERE: Part of rate limiting logic
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, []);
    }

    const requests = requestCounts.get(ip);
    const recentRequests = requests.filter((time) => time > windowStart);

    if (recentRequests.length >= rateLimit.max) {
      return res.status(429).json({ error: rateLimit.message });
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    next();
  });

  // WHAT: Request logging middleware
  // WHY: Track API usage, debug issues, monitor performance
  // HOW: Log request details with timestamps
  // WHERE: Early in middleware chain
  app.use((req, res, next) => {
    const start = Date.now();

    // WHAT: Log when response finishes
    // WHY: Include response time and status code
    // HOW: Listen to response 'finish' event
    // WHERE: Provides complete request information
    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `${new Date().toISOString()} - ${req.method} ${req.path} - ${
          res.statusCode
        } - ${duration}ms`
      );
    });

    next();
  });

  // WHAT: Authentication middleware
  // WHY: Protect sensitive endpoints
  // HOW: Check for valid authentication token
  // WHERE: Applied to protected routes
  const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // WHAT: Simple token validation (use JWT in production)
    // WHY: Verify user is authenticated
    // HOW: Check token against known valid tokens
    // WHERE: Before accessing protected resources
    if (token !== "valid-token-123") {
      return res.status(401).json({ error: "Invalid token" });
    }

    // WHAT: Add user info to request object
    // WHY: Route handlers need user context
    // HOW: Attach user data to req object
    // WHERE: After successful authentication
    req.user = { id: 1, username: "authenticated-user" };
    next();
  };

  // WHAT: Input sanitization middleware
  // WHY: Prevent XSS and injection attacks
  // HOW: Clean user input data
  // WHERE: Before processing request data
  const sanitizeInput = (req, res, next) => {
    if (req.body) {
      // WHAT: Simple HTML tag removal
      // WHY: Prevent XSS attacks
      // HOW: Replace HTML tags with empty string
      // WHERE: Process all string fields in request body
      Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === "string") {
          req.body[key] = req.body[key].replace(/<[^>]*>/g, "");
        }
      });
    }
    next();
  };

  // Basic middleware setup
  app.use(cors());
  app.use(express.json());
  app.use(sanitizeInput);

  // Sample data (same as before)
  let users = [
    { id: 1, name: "John Doe", email: "john@example.com", username: "johndoe" },
  ];
  let nextId = 2;

  // WHAT: Public routes (no authentication required)
  // WHY: Some endpoints should be accessible without login
  // HOW: Define routes before authentication middleware
  // WHERE: Login, registration, public information

  app.get("/api", (req, res) => {
    res.json({
      name: "Advanced User Management API",
      version: "2.0.0",
      features: [
        "Authentication",
        "Rate Limiting",
        "Input Sanitization",
        "Request Logging",
      ],
      publicEndpoints: ["/api", "/health", "/auth/login"],
      protectedEndpoints: ["/users", "/users/:id", "/profile"],
    });
  });

  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // WHAT: Authentication endpoints
  // WHY: Users need to login to access protected resources
  // HOW: Provide login endpoint that returns token
  // WHERE: Before protected route definitions
  app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    // WHAT: Simple credential check (use proper authentication in production)
    // WHY: Verify user credentials
    // HOW: Check username/password against known values
    // WHERE: Replace with database lookup and password hashing
    if (username === "admin" && password === "password") {
      res.json({
        token: "valid-token-123",
        user: { id: 1, username: "admin" },
        expiresIn: "1h",
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // WHAT: Apply authentication to all routes below this point
  // WHY: Protect sensitive user data and operations
  // HOW: Use authenticate middleware for subsequent routes
  // WHERE: After public routes, before protected routes
  app.use("/users", authenticate);
  app.use("/profile", authenticate);

  // WHAT: Protected routes (authentication required)
  // WHY: User data should only be accessible to authenticated users
  // HOW: Routes defined after authentication middleware
  // WHERE: All sensitive operations

  app.get("/users", (req, res) => {
    res.json(users);
  });

  app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  });

  app.get("/profile", (req, res) => {
    // WHAT: Return current user's profile
    // WHY: Authenticated users need access to their own data
    // HOW: Use user info from authentication middleware
    // WHERE: Personal profile endpoint
    res.json({
      message: "This is your profile",
      user: req.user,
    });
  });

  // Error handling and 404 handler (same as before)
  app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);
    res.status(500).json({ error: "Internal server error" });
  });

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Advanced Express server running on port ${PORT}`);
    console.log(
      "Features: Authentication, Rate Limiting, Input Sanitization, Logging"
    );
    console.log(
      'Login with: POST /auth/login {"username": "admin", "password": "password"}'
    );
  });
}

// WHAT: Server deployment and environment configuration
// WHY: Production servers need proper configuration management
// HOW: Use environment variables and configuration files
// WHERE: Production deployment setup
function createProductionServer() {
  // WHAT: Environment configuration
  // WHY: Different settings for development, testing, production
  // HOW: Use environment variables with defaults
  // WHERE: Top of production server file
  require("dotenv").config(); // Load .env file

  const express = require("express");
  const app = express();

  // WHAT: Configuration object
  // WHY: Centralize all configuration in one place
  // HOW: Read from environment variables with fallbacks
  // WHERE: Used throughout the application
  const config = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    dbUrl: process.env.DATABASE_URL || "sqlite://./dev.db",
    jwtSecret: process.env.JWT_SECRET || "your-secret-key",
    logLevel: process.env.LOG_LEVEL || "info",
    corsOrigin: process.env.CORS_ORIGIN || "*",
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    },
  };

  // WHAT: Production middleware setup
  // WHY: Production needs additional security and monitoring
  // HOW: Conditional middleware based on environment
  // WHERE: Early in middleware chain

  if (config.nodeEnv === "production") {
    // WHAT: Trust proxy headers
    // WHY: Behind load balancers or reverse proxies
    // HOW: Enable Express trust proxy setting
    // WHERE: Production deployment behind proxies
    app.set("trust proxy", 1);
  }

  // Basic middleware
  app.use(express.json({ limit: "10mb" })); // WHAT: Limit request size
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // WHAT: Security headers middleware
  // WHY: Protect against common security vulnerabilities
  // HOW: Set security-related HTTP headers
  // WHERE: Early in middleware chain
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    next();
  });

  // WHAT: CORS configuration
  // WHY: Control which origins can access the API
  // HOW: Use cors middleware with specific configuration
  // WHERE: Before route definitions
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Basic routes
  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  });

  // WHAT: Graceful shutdown handling
  // WHY: Properly close connections when server stops
  // HOW: Listen for termination signals
  // WHERE: Important for production deployments
  process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });

  const server = app.listen(config.port, () => {
    console.log(`Production server running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`CORS Origin: ${config.corsOrigin}`);
  });

  return server;
}

// WHAT: Example of how to start different server types
// WHY: Demonstrate different approaches for different needs
// HOW: Export functions that can be called to start servers
// WHERE: Main server file or deployment scripts
function startServer(type = "express") {
  switch (type) {
    case "basic":
      console.log("Starting basic Node.js HTTP server...");
      return createBasicServer();

    case "express":
      console.log("Starting Express.js server...");
      return createExpressServer();

    case "advanced":
      console.log("Starting advanced Express server with authentication...");
      return createAdvancedExpressServer();

    case "production":
      console.log("Starting production-ready server...");
      return createProductionServer();

    default:
      console.log("Unknown server type, starting Express server...");
      return createExpressServer();
  }
}

// WHAT: Export server creation functions
// WHY: Allow other modules to create servers
// HOW: Module exports or ES6 exports
// WHERE: For testing, deployment, or integration
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createBasicServer,
    createExpressServer,
    createAdvancedExpressServer,
    createProductionServer,
    startServer,
  };
}

// ==============================================================================
// USAGE EXAMPLES AND TESTING
// ==============================================================================

/*
WHAT: Practical examples showing how to use the API classes
WHY: Demonstrate real-world usage patterns
HOW: Create instances and call methods with proper error handling
WHERE: Use these patterns in your applications
*/

// WHAT: Example usage of the API classes
// WHY: Show how all the pieces work together
// HOW: Create instances and demonstrate common workflows
// WHERE: Main application code
async function demonstrateAPIUsage() {
  console.log("=== API Tutorial Examples ===\n");

  try {
    // WHAT: Basic API usage
    // WHY: Start with simple examples
    // HOW: Call individual functions
    // WHERE: Learning and testing
    console.log("1. Basic API calls:");
    const users = await getAllUsers();
    console.log(`Found ${users.length} users\n`);

    if (users.length > 0) {
      const firstUser = await getUserById(users[0].id);
      console.log("First user details:", firstUser.name, "\n");
    }

    // WHAT: CRUD operations with class
    // WHY: Demonstrate organized approach
    // HOW: Use UserAPI class methods
    // WHERE: Structured applications
    console.log("2. CRUD operations:");
    const userAPI = new UserAPI(API_BASE_URL);

    // Create new user
    const newUserData = createUserData(
      "John Doe",
      "john.doe@example.com",
      "johndoe123"
    );
    const createdUser = await userAPI.create(newUserData);
    console.log("Created user:", createdUser.id, "\n");

    // Update the user
    const updatedData = { ...newUserData, name: "John Smith" };
    await userAPI.update(createdUser.id, updatedData);
    console.log("User updated\n");

    // Partial update
    await userAPI.partialUpdate(createdUser.id, { phone: "555-9999" });
    console.log("User phone updated\n");

    // Delete the user
    await userAPI.delete(createdUser.id);
    console.log("User deleted\n");

    // WHAT: Best practices API with caching and retries
    // WHY: Show production-ready patterns
    // HOW: Use BestPracticeAPI class
    // WHERE: Production applications
    console.log("3. Best practices API:");
    const bestAPI = new BestPracticeAPI(API_BASE_URL, {
      timeout: 5000,
      retryAttempts: 2,
      cacheEnabled: true,
    });

    // This will cache the result
    const cachedUsers = await bestAPI.get("/users");
    console.log("Fetched and cached users:", cachedUsers.length);

    // This will use cached result
    const cachedUsersAgain = await bestAPI.get("/users");
    console.log("Used cached users:", cachedUsersAgain.length);

    // Check cache stats
    console.log("Cache stats:", bestAPI.getCacheStats(), "\n");

    // WHAT: User management system
    // WHY: Show complete application flow
    // HOW: Use UserManager class
    // WHERE: Frontend applications
    console.log("4. User management system:");
    const userManager = new UserManager();
    await userManager.loadUsers();

    // Simulate search
    await userManager.searchUsers("Leanne");

    console.log("=== Tutorial completed successfully! ===");
  } catch (error) {
    console.error("Tutorial error:", error.message);
  }
}

// WHAT: Helper function to run examples
// WHY: Easy way to test all functionality
// HOW: Call demonstrateAPIUsage when ready
// WHERE: For learning and testing
function runExamples() {
  demonstrateAPIUsage();
}

// WHAT: Export for use in other modules
// WHY: Make classes available for import
// HOW: Module exports (Node.js) or ES6 exports
// WHERE: When using in modular applications
if (typeof module !== "undefined" && module.exports) {
  // Node.js exports
  module.exports = {
    UserAPI,
    AuthenticatedAPI,
    BestPracticeAPI,
    UserManager,
    getAllUsers,
    getUserById,
    createUser,
    runExamples,
  };
}

/*
==============================================================================
                                SUMMARY
==============================================================================

WHAT: This tutorial covered comprehensive JavaScript API programming including server creation
WHY: APIs are fundamental to modern web development - both client and server sides
HOW: We explored:
   - Basic fetch() requests and response handling
   - Error handling and status code management
   - Async/await vs Promises
   - Complete CRUD operations
   - Authentication and security
   - Real-world usage patterns
   - Best practices including caching, retries, and timeouts
   - Creating API servers with Node.js and Express.js
   - Server middleware, authentication, and production deployment

WHERE: Apply these patterns in:
   - Frontend web applications (API consumption)
   - Node.js backend services (API creation)
   - Mobile apps using JavaScript frameworks
   - API testing and integration
   - Full-stack JavaScript applications

SERVER CREATION APPROACHES:
1. Basic Node.js HTTP Server - Understanding fundamentals
2. Express.js Server - Production-ready framework
3. Advanced Server - Authentication, rate limiting, security
4. Production Server - Environment config, graceful shutdown

CLIENT-SIDE CLASSES:
- UserAPI: Basic CRUD operations
- AuthenticatedAPI: Authentication handling
- BestPracticeAPI: Caching, retries, timeouts
- UserManager: Complete application example

SERVER-SIDE FUNCTIONS:
- createBasicServer(): Vanilla Node.js HTTP server
- createExpressServer(): Express.js with routing and middleware
- createAdvancedExpressServer(): Authentication and security features
- createProductionServer(): Production-ready configuration

NEXT STEPS:
1. Practice with real APIs (try JSONPlaceholder, GitHub API, etc.)
2. Create your own REST API server using Express.js
3. Implement JWT authentication instead of simple tokens
4. Add database integration (PostgreSQL, MongoDB, etc.)
5. Learn about API testing frameworks (Jest, Mocha, Supertest)
6. Explore GraphQL as an alternative to REST
7. Add API documentation with Swagger/OpenAPI
8. Implement WebSocket for real-time features
9. Deploy to cloud platforms (Heroku, AWS, Netlify)
10. Add monitoring and logging with tools like Winston

PRODUCTION CONSIDERATIONS:
- Use environment variables for configuration
- Implement proper error handling and logging
- Add input validation and sanitization
- Use HTTPS in production
- Implement rate limiting and security headers
- Set up proper database connections
- Add automated testing
- Configure CI/CD pipelines
- Monitor performance and errors

Remember: Always handle errors gracefully, implement proper security measures,
and consider user experience in your API interactions!
==============================================================================
*/
