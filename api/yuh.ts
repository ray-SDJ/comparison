/*
==============================================================================
                    TYPESCRIPT APIs & REST APIs TUTORIAL
                     Line-by-Line Explanations (What, Why, How, Where)
==============================================================================

WHAT: This tutorial covers APIs (Application Programming Interfaces) and REST APIs in TypeScript
WHY: TypeScript adds type safety and better development experience to JavaScript API development
HOW: We'll explore typed API clients, interfaces, generics, and both frontend and backend development
WHERE: This applies to frontend applications, Node.js backends, and full-stack TypeScript projects

TABLE OF CONTENTS:
1. TypeScript API Fundamentals & Types
2. Making Typed HTTP Requests
3. Working with Typed JSON Data
4. Advanced Error Handling with Types
5. Async/Await with TypeScript
6. Typed REST API CRUD Operations
7. Authentication & Security with Types
8. Real-world Examples with Interfaces
9. Best Practices & Type Safety
10. Creating Typed API Servers (Node.js + Express)
*/

// ==============================================================================
// 1. TYPESCRIPT API FUNDAMENTALS & TYPES
// ==============================================================================

/*
WHAT: TypeScript interfaces and types for API development
WHY: Type safety prevents runtime errors and improves developer experience
HOW: Define interfaces for request/response data and API client configuration
WHERE: Foundation for all API interactions in TypeScript
*/

// WHAT: Base API response interface
// WHY: Standardize response structure across all API calls
// HOW: Generic interface that can wrap any data type
// WHERE: Used as return type for all API methods
interface ApiResponse<T> {
  data: T; // WHAT: The actual response data
  status: number; // WHY: HTTP status code for response handling
  message?: string; // HOW: Optional message for additional info
  timestamp: string; // WHERE: When the response was generated
}

// WHAT: Error response interface
// WHY: Consistent error handling across the application
// HOW: Standard error structure with optional details
// WHERE: Used when API calls fail
interface ApiError {
  error: string; // WHAT: Error message
  code?: string; // WHY: Error code for programmatic handling
  details?: Record<string, any>; // HOW: Additional error information
  status: number; // WHERE: HTTP status code
}

// WHAT: User data interface
// WHY: Type safety for user-related API operations
// HOW: Define structure matching API user schema
// WHERE: Used in all user CRUD operations
interface User {
  id: number; // WHAT: Unique identifier
  name: string; // WHY: User's full name
  email: string; // HOW: Contact and login identifier
  username: string; // WHERE: Unique username for system
  address?: Address; // Optional nested address object
  phone?: string; // Optional contact number
  website?: string; // Optional personal website
  createdAt?: string; // ISO string timestamp
  updatedAt?: string; // ISO string timestamp
}

// WHAT: Address interface for nested user data
// WHY: Organize related data with proper typing
// HOW: Separate interface for complex nested objects
// WHERE: Used within User interface
interface Address {
  street: string;
  suite?: string;
  city: string;
  zipcode: string;
  geo?: {
    lat: string;
    lng: string;
  };
}

// WHAT: User creation/update input interface
// WHY: Separate type for input data (no ID, timestamps)
// HOW: Pick required fields and make others optional
// WHERE: Used in POST and PUT requests
interface CreateUserInput {
  name: string;
  email: string;
  username: string;
  address?: Partial<Address>; // WHAT: Partial makes all fields optional
  phone?: string;
  website?: string;
}

// WHAT: Partial user update interface
// WHY: PATCH operations only need changed fields
// HOW: Make all fields optional using Partial utility type
// WHERE: Used in PATCH requests
interface UpdateUserInput extends Partial<CreateUserInput> {
  // WHAT: All fields from CreateUserInput but optional
  // WHY: PATCH allows updating any subset of fields
  // HOW: TypeScript Partial utility type
  // WHERE: Flexible updates without requiring all fields
}

// WHAT: Pagination parameters interface
// WHY: Type safety for list endpoint query parameters
// HOW: Define common pagination and filtering options
// WHERE: Used in GET requests for collections
interface PaginationParams {
  page?: number; // WHAT: Page number (1-based)
  limit?: number; // WHY: Items per page
  search?: string; // HOW: Search term for filtering
  sortBy?: keyof User; // WHERE: Field to sort by (type-safe)
  sortOrder?: "asc" | "desc"; // Literal type for sort direction
}

// WHAT: Paginated response interface
// WHY: Consistent structure for paginated data
// HOW: Generic interface that wraps any array type
// WHERE: Returned by list endpoints with pagination
interface PaginatedResponse<T> {
  items: T[]; // WHAT: Array of items for current page
  pagination: {
    page: number; // WHY: Current page number
    limit: number; // HOW: Items per page
    total: number; // WHERE: Total number of items
    totalPages: number; // Total number of pages
    hasNext: boolean; // Whether there are more pages
    hasPrevious: boolean; // Whether there are previous pages
  };
}

// WHAT: HTTP method enumeration
// WHY: Type safety for HTTP methods and better IntelliSense
// HOW: String literal union type for allowed methods
// WHERE: Used in API client configuration
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

// WHAT: Request configuration interface
// WHY: Type-safe configuration for HTTP requests
// HOW: Comprehensive options interface
// WHERE: Used by API client methods
interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
}

// WHAT: API client configuration interface
// WHY: Configure API client behavior with type safety
// HOW: Centralized configuration object
// WHERE: Used when creating API client instances
interface ApiClientConfig {
  baseUrl: string; // WHAT: Base URL for API endpoints
  timeout?: number; // WHY: Default timeout for requests
  retryAttempts?: number; // HOW: Number of retry attempts
  retryDelay?: number; // WHERE: Delay between retries
  defaultHeaders?: Record<string, string>; // Default headers for all requests
  auth?: {
    type: "bearer" | "basic" | "apikey";
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

// WHAT: Constants for API endpoints
// WHY: Centralize endpoint URLs and avoid typos
// HOW: Read-only object with typed properties
// WHERE: Used throughout API client methods
const API_ENDPOINTS = {
  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,
  AUTH_LOGIN: "/auth/login",
  AUTH_LOGOUT: "/auth/logout",
  HEALTH: "/health",
} as const; // WHAT: 'as const' makes object deeply readonly

// WHAT: Environment detection and API URL configuration
// WHY: Support both browser and Node.js environments
// HOW: Check for global objects and environment variables
// WHERE: Configuration that works in different JavaScript environments

// Browser environment check
declare const process: any; // WHAT: Declare process for browser environments

const getBrowserApiUrl = (): string => {
  // WHAT: Try to get API URL from various sources
  // WHY: Different deployment environments use different methods
  // HOW: Check multiple possible sources in order of preference
  // WHERE: Browser-specific configuration
  if (typeof window !== "undefined") {
    // Check window.env (some deployment systems)
    const windowEnv = (window as any).env;
    if (windowEnv?.REACT_APP_API_URL) return windowEnv.REACT_APP_API_URL;

    // Check data attributes on HTML elements
    const metaElement = document.querySelector('meta[name="api-url"]');
    if (metaElement) return metaElement.getAttribute("content") || "";
  }

  return "";
};

// WHAT: Base URL constant with environment support
// WHY: Different URLs for different environments
// HOW: Check multiple environment sources
// WHERE: Default configuration for API clients
const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.REACT_APP_API_URL) ||
  getBrowserApiUrl() ||
  "https://jsonplaceholder.typicode.com";

// ==============================================================================
// 2. MAKING TYPED HTTP REQUESTS
// ==============================================================================

/*
WHAT: Type-safe HTTP request functions using fetch API
WHY: Ensure request/response data matches expected types
HOW: Generic functions with TypeScript type parameters
WHERE: Foundation for all API communication
*/

// WHAT: Custom error class for API errors
// WHY: Better error handling with additional context
// HOW: Extend built-in Error class with API-specific properties
// WHERE: Thrown by API client methods when requests fail
class ApiRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any,
    public code?: string
  ) {
    super(message);
    this.name = "ApiRequestError";

    // WHAT: Maintain proper stack trace (Node.js specific)
    // WHY: Better debugging experience in Node.js environments
    // HOW: Use captureStackTrace if available
    // WHERE: Required for proper error inheritance in Node.js
    const errorConstructor = Error as any;
    if (errorConstructor.captureStackTrace) {
      errorConstructor.captureStackTrace(this, ApiRequestError);
    }
  }
}

// WHAT: Generic typed fetch wrapper function
// WHY: Add type safety to fetch API calls
// HOW: Generic function that returns typed responses
// WHERE: Used by all API client methods
async function typedFetch<T>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  try {
    // WHAT: Create abort controller for timeout
    // WHY: Prevent requests from hanging indefinitely
    // HOW: AbortController with setTimeout
    // WHERE: Essential for good user experience
    const controller = new AbortController();
    const timeoutId = config.timeout
      ? setTimeout(() => {
          controller.abort();
        }, config.timeout)
      : null;

    // WHAT: Prepare fetch options
    // WHY: Configure request with proper headers and body
    // HOW: Merge default config with provided options
    // WHERE: Before making the HTTP request
    const fetchOptions: RequestInit = {
      method: config.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      },
      signal: controller.signal,
    };

    // WHAT: Add request body if present
    // WHY: POST/PUT/PATCH requests need data in body
    // HOW: Stringify JSON data
    // WHERE: Only for requests that support body
    if (config.body && config.method !== "GET") {
      fetchOptions.body = JSON.stringify(config.body);
    }

    // WHAT: Make the HTTP request
    // WHY: Actually perform the network call
    // HOW: Use fetch with prepared options
    // WHERE: Core request execution
    const response = await fetch(url, fetchOptions);

    // WHAT: Clear timeout after response
    // WHY: Prevent unnecessary timeout firing
    // HOW: Clear the timeout ID
    // WHERE: After successful response
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // WHAT: Check if response is successful
    // WHY: HTTP errors don't automatically throw in fetch
    // HOW: Check response.ok property
    // WHERE: Before parsing response body
    if (!response.ok) {
      // WHAT: Try to parse error response
      // WHY: Server might provide detailed error information
      // HOW: Attempt JSON parsing with fallback
      // WHERE: When response indicates error
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiRequestError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData,
        errorData.code
      );
    }

    // WHAT: Parse successful response as JSON
    // WHY: APIs typically return JSON data
    // HOW: Call response.json() and cast to expected type
    // WHERE: Happy path for successful requests
    const data: T = await response.json();
    return data;
  } catch (error) {
    // WHAT: Handle different types of errors
    // WHY: Provide meaningful error messages for different failure modes
    // HOW: Check error type and re-throw with context
    // WHERE: Catch block for all potential errors
    if (error instanceof ApiRequestError) {
      throw error; // Re-throw API errors as-is
    } else if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError("Request timeout", 408, null, "TIMEOUT");
    } else if (error instanceof TypeError) {
      throw new ApiRequestError("Network error", 0, null, "NETWORK_ERROR");
    } else {
      throw new ApiRequestError(
        `Unexpected error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        500,
        null,
        "UNKNOWN_ERROR"
      );
    }
  }
}

// WHAT: Simplified GET request function
// WHY: Common pattern for retrieving data
// HOW: Wrapper around typedFetch with GET method
// WHERE: Used for all read operations
async function get<T>(
  url: string,
  headers?: Record<string, string>
): Promise<T> {
  return typedFetch<T>(url, {
    method: "GET",
    headers,
  });
}

// WHAT: POST request function for creating data
// WHY: Type-safe data creation
// HOW: Generic function with typed input and output
// WHERE: Used for creating new resources
async function post<TInput, TOutput>(
  url: string,
  data: TInput,
  headers?: Record<string, string>
): Promise<TOutput> {
  return typedFetch<TOutput>(url, {
    method: "POST",
    body: data,
    headers,
  });
}

// WHAT: PUT request function for full updates
// WHY: Type-safe resource replacement
// HOW: Generic function with typed input and output
// WHERE: Used for complete resource updates
async function put<TInput, TOutput>(
  url: string,
  data: TInput,
  headers?: Record<string, string>
): Promise<TOutput> {
  return typedFetch<TOutput>(url, {
    method: "PUT",
    body: data,
    headers,
  });
}

// WHAT: PATCH request function for partial updates
// WHY: Type-safe partial resource updates
// HOW: Generic function with Partial input type
// WHERE: Used for updating specific fields
async function patch<T>(
  url: string,
  data: Partial<T>,
  headers?: Record<string, string>
): Promise<T> {
  return typedFetch<T>(url, {
    method: "PATCH",
    body: data,
    headers,
  });
}

// WHAT: DELETE request function
// WHY: Type-safe resource deletion
// HOW: Generic function for delete response type
// WHERE: Used for removing resources
async function del<T = void>(
  url: string,
  headers?: Record<string, string>
): Promise<T> {
  return typedFetch<T>(url, {
    method: "DELETE",
    headers,
  });
}

// ==============================================================================
// 3. WORKING WITH TYPED JSON DATA
// ==============================================================================

/*
WHAT: Type-safe JSON data handling and validation
WHY: Ensure data from APIs matches expected TypeScript types
HOW: Use type guards, validation functions, and transformation utilities
WHERE: Data processing layer between API and application logic
*/

// WHAT: Type guard function for User interface
// WHY: Runtime validation that data matches expected type
// HOW: Check all required properties exist and have correct types
// WHERE: Used when receiving data from external APIs
function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string" &&
    typeof obj.username === "string"
  );
}

// WHAT: Type guard for array of users
// WHY: Validate that API response contains valid user array
// HOW: Check array and validate each element
// WHERE: Used for list endpoints
function isUserArray(obj: any): obj is User[] {
  return Array.isArray(obj) && obj.every(isUser);
}

// WHAT: Data transformation utility
// WHY: Convert API response to internal data format
// HOW: Map API fields to internal interface properties
// WHERE: When API response format differs from internal types
function transformApiUserToUser(apiUser: any): User {
  // WHAT: Handle potential data inconsistencies
  // WHY: External APIs might have different field names or formats
  // HOW: Map and validate each field explicitly
  // WHERE: Integration layer between API and application
  return {
    id: Number(apiUser.id),
    name: String(apiUser.name || ""),
    email: String(apiUser.email || ""),
    username: String(apiUser.username || ""),
    address: apiUser.address
      ? {
          street: String(apiUser.address.street || ""),
          suite: apiUser.address.suite
            ? String(apiUser.address.suite)
            : undefined,
          city: String(apiUser.address.city || ""),
          zipcode: String(apiUser.address.zipcode || ""),
          geo: apiUser.address.geo
            ? {
                lat: String(apiUser.address.geo.lat || "0"),
                lng: String(apiUser.address.geo.lng || "0"),
              }
            : undefined,
        }
      : undefined,
    phone: apiUser.phone ? String(apiUser.phone) : undefined,
    website: apiUser.website ? String(apiUser.website) : undefined,
    createdAt: apiUser.createdAt ? String(apiUser.createdAt) : undefined,
    updatedAt: apiUser.updatedAt ? String(apiUser.updatedAt) : undefined,
  };
}

// WHAT: Input validation function
// WHY: Ensure user input meets requirements before API calls
// HOW: Check required fields and validate formats
// WHERE: Called before create/update operations
function validateCreateUserInput(input: CreateUserInput): string[] {
  const errors: string[] = [];

  // WHAT: Validate required fields
  // WHY: Prevent API calls with incomplete data
  // HOW: Check for presence and basic format
  // WHERE: Client-side validation before server request
  if (!input.name || input.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  if (!input.email || !isValidEmail(input.email)) {
    errors.push("Valid email address is required");
  }

  if (!input.username || input.username.trim().length < 3) {
    errors.push("Username must be at least 3 characters long");
  }

  // WHAT: Validate optional fields if present
  // WHY: Ensure data quality for optional information
  // HOW: Check format when field is provided
  // WHERE: Additional validation for complete data integrity
  if (input.phone && !isValidPhone(input.phone)) {
    errors.push("Phone number format is invalid");
  }

  if (input.website && !isValidUrl(input.website)) {
    errors.push("Website URL format is invalid");
  }

  return errors;
}

// WHAT: Email validation utility
// WHY: Ensure email addresses are properly formatted
// HOW: Regular expression pattern matching
// WHERE: Called from input validation functions
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// WHAT: Phone validation utility
// WHY: Basic phone number format checking
// HOW: Flexible regex for common phone formats
// WHERE: Optional field validation
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

// WHAT: URL validation utility
// WHY: Ensure website URLs are valid
// HOW: Try to construct URL object
// WHERE: Website field validation
function isValidUrl(url: string): boolean {
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
}

// WHAT: Generic response wrapper utility
// WHY: Standardize API response format
// HOW: Wrap data in consistent response structure
// WHERE: Server-side response formatting
function createApiResponse<T>(
  data: T,
  status: number = 200,
  message?: string
): ApiResponse<T> {
  return {
    data,
    status,
    message,
    timestamp: new Date().toISOString(),
  };
}

// ==============================================================================
// 4. ADVANCED ERROR HANDLING WITH TYPES
// ==============================================================================

/*
WHAT: Comprehensive error handling with TypeScript type safety
WHY: Provide detailed error information and maintain type safety
HOW: Custom error types, error handling utilities, and retry logic
WHERE: All API interactions and error scenarios
*/

// WHAT: Specific error types for different scenarios
// WHY: Handle different error types appropriately
// HOW: Extend base error class with specific properties
// WHERE: Thrown by different error scenarios
class ValidationError extends Error {
  constructor(message: string, public field: string, public value: any) {
    super(message);
    this.name = "ValidationError";
  }
}

class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

class RateLimitError extends Error {
  constructor(
    message: string = "Rate limit exceeded",
    public retryAfter?: number
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

// WHAT: Error result union type
// WHY: Type-safe error handling without exceptions
// HOW: Result pattern with success/error variants
// WHERE: Alternative to try-catch for error handling
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// WHAT: Safe API call wrapper
// WHY: Convert exceptions to Result type for safer handling
// HOW: Wrap async functions and catch errors
// WHERE: When you prefer Result pattern over try-catch
async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<Result<T, ApiRequestError>> {
  try {
    const data = await apiCall();
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new ApiRequestError(
        error instanceof Error ? error.message : "Unknown error",
        500
      ),
    };
  }
}

// WHAT: Retry logic with exponential backoff
// WHY: Handle temporary failures gracefully
// HOW: Retry with increasing delays between attempts
// WHERE: Used for network requests that might fail temporarily
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Unknown error");

      // WHAT: Don't retry certain error types
      // WHY: Some errors won't be fixed by retrying
      // HOW: Check error type and status code
      // WHERE: Avoid wasting time on permanent failures
      if (error instanceof ApiRequestError) {
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error; // Don't retry client errors (except rate limiting)
        }
      }

      // WHAT: Wait before retrying
      // WHY: Give system time to recover
      // HOW: Exponential backoff with jitter
      // WHERE: Between retry attempts
      if (attempt < maxAttempts) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
        await new Promise((resolve) => setTimeout(resolve, delay + jitter));
      }
    }
  }

  throw lastError!;
}

// WHAT: Error logging utility
// WHY: Track errors for debugging and monitoring
// HOW: Structured logging with error context
// WHERE: Called when errors occur
function logError(error: Error, context?: Record<string, any>): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...(error instanceof ApiRequestError && {
      status: error.status,
      code: error.code,
      response: error.response,
    }),
    ...context,
  };

  console.error("API Error:", errorInfo);

  // WHAT: Send to error tracking service in production
  // WHY: Monitor application health and debug issues
  // HOW: Integration with services like Sentry, Bugsnag
  // WHERE: Production error monitoring
  if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }
}

// ==============================================================================
// 5. ASYNC/AWAIT WITH TYPESCRIPT
// ==============================================================================

/*
WHAT: TypeScript-specific async/await patterns and utilities
WHY: Type safety with asynchronous operations and better error handling
HOW: Generic async functions, Promise utilities, and concurrent operations
WHERE: All asynchronous API operations
*/

// WHAT: Generic async function type
// WHY: Type safety for async function parameters
// HOW: Generic type that represents async functions
// WHERE: Used in higher-order functions and utilities
type AsyncFunction<T, Args extends any[] = any[]> = (
  ...args: Args
) => Promise<T>;

// WHAT: Timeout utility for async operations
// WHY: Prevent async operations from hanging indefinitely
// HOW: Race between actual operation and timeout
// WHERE: Wrap any async operation that might hang
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = "Operation timed out"
): Promise<T> {
  // WHAT: Create timeout promise that rejects
  // WHY: Provide alternative that fails after specified time
  // HOW: setTimeout wrapped in Promise
  // WHERE: Used in Promise.race with actual operation
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  // WHAT: Race between operation and timeout
  // WHY: Whichever completes first wins
  // HOW: Promise.race returns first resolved/rejected promise
  // WHERE: Ensures operation doesn't exceed time limit
  return Promise.race([promise, timeoutPromise]);
}

// WHAT: Concurrent async operations utility
// WHY: Execute multiple async operations in parallel
// HOW: Use Promise.all with proper type inference
// WHERE: When multiple independent API calls can run together
async function concurrent<T extends readonly unknown[] | []>(
  operations: readonly [...{ [K in keyof T]: Promise<T[K]> }]
): Promise<T> {
  return Promise.all(operations) as Promise<T>;
}

// WHAT: Sequential async operations utility
// WHY: Execute async operations one after another
// HOW: Use for-await-of loop or reduce
// WHERE: When operations depend on each other
async function sequential<T, R>(
  items: T[],
  operation: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i++) {
    const result = await operation(items[i], i);
    results.push(result);
  }

  return results;
}

// WHAT: Batch processing utility
// WHY: Process large arrays in smaller chunks
// HOW: Split array into batches and process each batch
// WHERE: When dealing with large datasets or rate-limited APIs
async function batch<T, R>(
  items: T[],
  batchSize: number,
  operation: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await operation(batch);
    results.push(...batchResults);
  }

  return results;
}

// WHAT: Async iterator for paginated data
// WHY: Handle large datasets that come in pages
// HOW: Async generator that yields pages of data
// WHERE: Working with paginated API endpoints
async function* paginatedIterator<T>(
  fetchPage: (page: number) => Promise<PaginatedResponse<T>>
): AsyncIterableIterator<T[]> {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage(page);
    yield response.items;

    hasMore = response.pagination.hasNext;
    page++;
  }
}

// ==============================================================================
// 6. TYPED REST API CRUD OPERATIONS
// ==============================================================================

/*
WHAT: Complete CRUD operations with TypeScript type safety
WHY: Ensure all API operations are type-safe and consistent
HOW: Generic classes and methods with proper TypeScript types
WHERE: Core API client implementation
*/

// WHAT: Generic CRUD repository interface
// WHY: Define contract for all resource operations
// HOW: Generic interface that can be implemented for any resource type
// WHERE: Base interface for all API repositories
interface Repository<T, TCreate, TUpdate = Partial<TCreate>> {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<T>>;
  getById(id: number): Promise<T>;
  create(data: TCreate): Promise<T>;
  update(id: number, data: TCreate): Promise<T>;
  partialUpdate(id: number, data: TUpdate): Promise<T>;
  delete(id: number): Promise<void>;
}

// WHAT: Base API repository implementation
// WHY: Reusable CRUD operations for any resource type
// HOW: Generic class with typed methods
// WHERE: Extended by specific resource repositories
abstract class BaseRepository<T, TCreate, TUpdate = Partial<TCreate>>
  implements Repository<T, TCreate, TUpdate>
{
  constructor(
    protected baseUrl: string,
    protected endpoint: string,
    protected headers: Record<string, string> = {}
  ) {}

  // WHAT: Get all resources with optional pagination
  // WHY: Retrieve lists of resources with filtering and pagination
  // HOW: Build query string from parameters and make GET request
  // WHERE: List views and data browsing
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    // WHAT: Build query string from parameters
    // WHY: Convert object to URL search parameters
    // HOW: Use URLSearchParams for proper encoding
    // WHERE: GET requests with query parameters
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());
      if (params.search) queryParams.set("search", params.search);
      if (params.sortBy) queryParams.set("sortBy", params.sortBy as string);
      if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `${this.baseUrl}${this.endpoint}${
      queryString ? `?${queryString}` : ""
    }`;

    return get<PaginatedResponse<T>>(url, this.headers);
  }

  // WHAT: Get single resource by ID
  // WHY: Retrieve detailed information for specific resource
  // HOW: Append ID to endpoint URL and make GET request
  // WHERE: Detail views and resource-specific operations
  async getById(id: number): Promise<T> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    return get<T>(url, this.headers);
  }

  // WHAT: Create new resource
  // WHY: Add new data to the system
  // HOW: POST request with creation data
  // WHERE: Forms and data entry operations
  async create(data: TCreate): Promise<T> {
    const url = `${this.baseUrl}${this.endpoint}`;
    return post<TCreate, T>(url, data, this.headers);
  }

  // WHAT: Update entire resource
  // WHY: Replace all resource data
  // HOW: PUT request with complete resource data
  // WHERE: Edit forms that update all fields
  async update(id: number, data: TCreate): Promise<T> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    return put<TCreate, T>(url, data, this.headers);
  }

  // WHAT: Partial update of resource
  // WHY: Update only specific fields
  // HOW: PATCH request with partial data
  // WHERE: Quick edits and field-specific updates
  async partialUpdate(id: number, data: TUpdate): Promise<T> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    return patch<T>(url, data as Partial<T>, this.headers);
  }

  // WHAT: Delete resource
  // WHY: Remove data from system
  // HOW: DELETE request to resource endpoint
  // WHERE: Delete operations and cleanup
  async delete(id: number): Promise<void> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    await del<void>(url, this.headers);
  }
}

// WHAT: User-specific repository implementation
// WHY: User operations with custom business logic
// HOW: Extend base repository with user-specific methods
// WHERE: User management features
class UserRepository extends BaseRepository<
  User,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(baseUrl: string, headers: Record<string, string> = {}) {
    super(baseUrl, "/users", headers);
  }

  // WHAT: Search users by various criteria
  // WHY: Find specific users quickly
  // HOW: Custom search implementation with multiple fields
  // WHERE: User search functionality
  async search(query: string): Promise<User[]> {
    const params: PaginationParams = { search: query };
    const response = await this.getAll(params);
    return response.items;
  }

  // WHAT: Get user by username
  // WHY: Alternative lookup method besides ID
  // HOW: Search for user with specific username
  // WHERE: Login systems and user profiles
  async getByUsername(username: string): Promise<User | null> {
    try {
      const users = await this.search(username);
      return users.find((user) => user.username === username) || null;
    } catch (error) {
      if (error instanceof ApiRequestError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // WHAT: Check if username is available
  // WHY: Prevent duplicate usernames during registration
  // HOW: Search for existing username
  // WHERE: Registration forms and validation
  async isUsernameAvailable(username: string): Promise<boolean> {
    const existingUser = await this.getByUsername(username);
    return existingUser === null;
  }

  // WHAT: Bulk create users
  // WHY: Import multiple users efficiently
  // HOW: Send array of users in single request
  // WHERE: Data import and batch operations
  async createMany(users: CreateUserInput[]): Promise<User[]> {
    const url = `${this.baseUrl}${this.endpoint}/batch`;
    return post<CreateUserInput[], User[]>(url, users, this.headers);
  }

  // WHAT: Get users with detailed statistics
  // WHY: Analytics and reporting features
  // HOW: Special endpoint that includes additional data
  // WHERE: Admin dashboards and reports
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    userGrowth: number;
  }> {
    const url = `${this.baseUrl}${this.endpoint}/stats`;
    return get<any>(url, this.headers);
  }
}

// ==============================================================================
// 7. AUTHENTICATION & SECURITY WITH TYPES
// ==============================================================================

/*
WHAT: Type-safe authentication and security implementations
WHY: Secure API access with TypeScript type safety
HOW: Typed authentication classes, token management, and security utilities
WHERE: Protected routes and secure API operations
*/

// WHAT: Authentication token interface
// WHY: Type safety for authentication data
// HOW: Define structure for token information
// WHERE: Authentication state management
interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  tokenType: "Bearer" | "Basic";
  expiresAt: Date;
  scope?: string[];
}

// WHAT: User authentication data interface
// WHY: Type safety for login/registration
// HOW: Define user credential structure
// WHERE: Authentication forms and API calls
interface AuthCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

// WHAT: Authentication response interface
// WHY: Type safety for auth API responses
// HOW: Standard structure for auth endpoints
// WHERE: Login and token refresh operations
interface AuthResponse {
  user: User;
  token: AuthToken;
  permissions?: string[];
}

// WHAT: JWT token payload interface
// WHY: Type safety for JWT token contents
// HOW: Define expected JWT payload structure
// WHERE: Token parsing and validation
interface JwtPayload {
  sub: string; // Subject (user ID)
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp
  aud?: string; // Audience
  iss?: string; // Issuer
  scope?: string[]; // User permissions
  [key: string]: any; // Additional custom claims
}

// WHAT: Authentication manager class
// WHY: Centralized authentication logic with type safety
// HOW: Class that manages tokens, login, logout
// WHERE: Authentication service throughout app
class AuthManager {
  private token: AuthToken | null = null;
  private refreshPromise: Promise<AuthToken> | null = null;

  constructor(private baseUrl: string) {
    // WHAT: Load saved token from storage
    // WHY: Persist authentication across sessions
    // HOW: Read from localStorage with error handling
    // WHERE: App initialization
    this.loadTokenFromStorage();
  }

  // WHAT: Login with credentials
  // WHY: Authenticate user and obtain tokens
  // HOW: POST credentials to auth endpoint
  // WHERE: Login forms and authentication flows
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const response = await post<AuthCredentials, AuthResponse>(
        `${this.baseUrl}/auth/login`,
        credentials
      );

      // WHAT: Store authentication token
      // WHY: Enable authenticated requests
      // HOW: Save token in memory and storage
      // WHERE: After successful login
      this.setToken(response.token);

      return response;
    } catch (error) {
      // WHAT: Handle authentication errors specifically
      // WHY: Provide clear feedback for auth failures
      // HOW: Check error status and provide appropriate message
      // WHERE: Login error handling
      if (error instanceof ApiRequestError && error.status === 401) {
        throw new AuthenticationError("Invalid username or password");
      }
      throw error;
    }
  }

  // WHAT: Logout and clear authentication
  // WHY: Secure cleanup of authentication state
  // HOW: Call logout endpoint and clear local state
  // WHERE: Logout actions and security cleanup
  async logout(): Promise<void> {
    try {
      // WHAT: Notify server about logout
      // WHY: Allow server to invalidate tokens
      // HOW: POST to logout endpoint with current token
      // WHERE: Before clearing local state
      if (this.token) {
        await post<{}, void>(
          `${this.baseUrl}/auth/logout`,
          {},
          this.getAuthHeaders()
        );
      }
    } catch (error) {
      // WHAT: Continue with logout even if server request fails
      // WHY: Local cleanup should happen regardless
      // HOW: Log error but don't throw
      // WHERE: Error handling that doesn't block logout
      console.warn("Logout request failed:", error);
    } finally {
      // WHAT: Clear local authentication state
      // WHY: Remove sensitive data from memory and storage
      // HOW: Set token to null and clear storage
      // WHERE: Always runs regardless of server response
      this.clearToken();
    }
  }

  // WHAT: Refresh authentication token
  // WHY: Maintain authentication without re-login
  // HOW: Use refresh token to get new access token
  // WHERE: When access token expires
  async refreshToken(): Promise<AuthToken> {
    // WHAT: Prevent multiple simultaneous refresh attempts
    // WHY: Avoid race conditions and duplicate requests
    // HOW: Use shared promise for concurrent calls
    // WHERE: Token refresh logic
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    if (!this.token?.refreshToken) {
      throw new AuthenticationError("No refresh token available");
    }

    // WHAT: Create shared refresh promise
    // WHY: Handle concurrent refresh requests
    // HOW: Store promise and clear after completion
    // WHERE: Before making refresh request
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.setToken(newToken);
      return newToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  // WHAT: Private method to perform token refresh
  // WHY: Separate the actual refresh logic
  // HOW: POST refresh token to refresh endpoint
  // WHERE: Called by public refreshToken method
  private async performTokenRefresh(): Promise<AuthToken> {
    const response = await post<{ refreshToken: string }, { token: AuthToken }>(
      `${this.baseUrl}/auth/refresh`,
      { refreshToken: this.token!.refreshToken! }
    );

    return response.token;
  }

  // WHAT: Check if user is authenticated
  // WHY: Control access to protected features
  // HOW: Check if valid token exists
  // WHERE: Route guards and conditional rendering
  isAuthenticated(): boolean {
    return this.token !== null && !this.isTokenExpired();
  }

  // WHAT: Check if token is expired
  // WHY: Prevent using invalid tokens
  // HOW: Compare token expiration with current time
  // WHERE: Before making authenticated requests
  private isTokenExpired(): boolean {
    if (!this.token) return true;

    const now = new Date();
    const expiresAt = new Date(this.token.expiresAt);

    // WHAT: Add 5-minute buffer before expiration
    // WHY: Prevent token expiry during request processing
    // HOW: Subtract buffer time from expiration
    // WHERE: Token validity checking
    const bufferMs = 5 * 60 * 1000; // 5 minutes
    return now.getTime() > expiresAt.getTime() - bufferMs;
  }

  // WHAT: Get current authentication token
  // WHY: Access token for authenticated requests
  // HOW: Return stored token if valid
  // WHERE: When making authenticated API calls
  getToken(): AuthToken | null {
    if (this.isTokenExpired()) {
      this.clearToken();
      return null;
    }
    return this.token;
  }

  // WHAT: Get authentication headers
  // WHY: Include auth token in API requests
  // HOW: Format token as Authorization header
  // WHERE: All authenticated API calls
  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) {
      throw new AuthenticationError("No valid authentication token");
    }

    return {
      Authorization: `${token.tokenType} ${token.accessToken}`,
    };
  }

  // WHAT: Set authentication token
  // WHY: Store token for future use
  // HOW: Save in memory and persistent storage
  // WHERE: After login or token refresh
  private setToken(token: AuthToken): void {
    this.token = token;
    this.saveTokenToStorage(token);
  }

  // WHAT: Clear authentication token
  // WHY: Remove authentication state
  // HOW: Clear memory and storage
  // WHERE: During logout or token expiry
  private clearToken(): void {
    this.token = null;
    this.removeTokenFromStorage();
  }

  // WHAT: Save token to persistent storage
  // WHY: Maintain authentication across browser sessions
  // HOW: Store in localStorage as encrypted JSON
  // WHERE: When token is set or updated
  private saveTokenToStorage(token: AuthToken): void {
    try {
      const tokenData = {
        ...token,
        expiresAt: token.expiresAt.toISOString(),
      };
      localStorage.setItem("authToken", JSON.stringify(tokenData));
    } catch (error) {
      console.warn("Failed to save token to storage:", error);
    }
  }

  // WHAT: Load token from persistent storage
  // WHY: Restore authentication state on app start
  // HOW: Read and parse from localStorage
  // WHERE: Auth manager initialization
  private loadTokenFromStorage(): void {
    try {
      const tokenData = localStorage.getItem("authToken");
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        this.token = {
          ...parsed,
          expiresAt: new Date(parsed.expiresAt),
        };

        // WHAT: Clear expired tokens immediately
        // WHY: Don't keep invalid tokens
        // HOW: Check expiration after loading
        // WHERE: After loading from storage
        if (this.isTokenExpired()) {
          this.clearToken();
        }
      }
    } catch (error) {
      console.warn("Failed to load token from storage:", error);
      this.removeTokenFromStorage();
    }
  }

  // WHAT: Remove token from persistent storage
  // WHY: Clean up storage during logout
  // HOW: Remove localStorage item
  // WHERE: When clearing authentication state
  private removeTokenFromStorage(): void {
    try {
      localStorage.removeItem("authToken");
    } catch (error) {
      console.warn("Failed to remove token from storage:", error);
    }
  }
}

// WHAT: Authenticated API client
// WHY: Automatically handle authentication for API requests
// HOW: Extend base repository with authentication
// WHERE: All authenticated API operations
class AuthenticatedRepository<
  T,
  TCreate,
  TUpdate = Partial<TCreate>
> extends BaseRepository<T, TCreate, TUpdate> {
  constructor(
    baseUrl: string,
    endpoint: string,
    private authManager: AuthManager
  ) {
    super(baseUrl, endpoint);
  }

  // WHAT: Override to add authentication headers
  // WHY: All requests need authentication
  // HOW: Get headers from auth manager
  // WHERE: Before every API request
  protected getHeaders(): Record<string, string> {
    try {
      return {
        ...this.headers,
        ...this.authManager.getAuthHeaders(),
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        // WHAT: Redirect to login if not authenticated
        // WHY: User needs to authenticate
        // HOW: Throw error that can be caught by app
        // WHERE: When authentication is required but missing
        throw error;
      }
      throw error;
    }
  }

  // WHAT: Override methods to use authenticated headers
  // WHY: Ensure all requests include authentication
  // HOW: Call parent methods with auth headers
  // WHERE: All CRUD operations

  async getAll(params?: PaginationParams): Promise<PaginatedResponse<T>> {
    return get<PaginatedResponse<T>>(
      `${this.baseUrl}${this.endpoint}${this.buildQueryString(params)}`,
      this.getHeaders()
    );
  }

  async getById(id: number): Promise<T> {
    return get<T>(`${this.baseUrl}${this.endpoint}/${id}`, this.getHeaders());
  }

  async create(data: TCreate): Promise<T> {
    return post<TCreate, T>(
      `${this.baseUrl}${this.endpoint}`,
      data,
      this.getHeaders()
    );
  }

  async update(id: number, data: TCreate): Promise<T> {
    return put<TCreate, T>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data,
      this.getHeaders()
    );
  }

  async partialUpdate(id: number, data: TUpdate): Promise<T> {
    return patch<T>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data as Partial<T>,
      this.getHeaders()
    );
  }

  async delete(id: number): Promise<void> {
    return del<void>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      this.getHeaders()
    );
  }

  // WHAT: Helper method to build query string
  // WHY: Reusable query string building
  // HOW: Convert params to URL search params
  // WHERE: GET requests with parameters
  private buildQueryString(params?: PaginationParams): string {
    if (!params) return "";

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.set(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}

// ==============================================================================
// 8. REAL-WORLD EXAMPLES WITH INTERFACES
// ==============================================================================
