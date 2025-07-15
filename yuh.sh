#!/bin/bash
# A simple calculator program to demonstrate Bash script structure

# Enable strict error handling
set -euo pipefail

# Error handling functions
handle_error() {
    local exit_code=$?
    local line_number=$1
    echo "Error occurred in script at line $line_number: exit code $exit_code" >&2
    exit $exit_code
}

# Set up error trap
trap 'handle_error $LINENO' ERR

# Validation functions
validate_number() {
    local num=$1
    local var_name=$2
    
    # Check if empty
    if [[ -z "$num" ]]; then
        echo "Error: $var_name cannot be empty" >&2
        return 1
    fi
    
    # Check if it's a valid number (including decimals and negatives)
    if ! [[ "$num" =~ ^-?[0-9]+\.?[0-9]*$ ]]; then
        echo "Error: '$num' is not a valid number for $var_name" >&2
        return 1
    fi
    
    return 0
}

validate_choice() {
    local choice=$1
    
    if [[ -z "$choice" ]]; then
        echo "Error: Choice cannot be empty" >&2
        return 1
    fi
    
    if ! [[ "$choice" =~ ^[1-5]$ ]]; then
        echo "Error: '$choice' is not a valid choice (1-5)" >&2
        return 1
    fi
    
    return 0
}

check_dependencies() {
    # Check if bc (calculator) is available
    if ! command -v bc &> /dev/null; then
        echo "Error: 'bc' calculator is required but not installed" >&2
        echo "Please install bc: sudo apt-get install bc (Ubuntu/Debian) or brew install bc (macOS)" >&2
        exit 1
    fi
}

# Enhanced calculator functions with error handling
add() {
    local num1=$1
    local num2=$2
    
    # Validate inputs
    validate_number "$num1" "first number" || return 1
    validate_number "$num2" "second number" || return 1
    
    # Perform calculation with error checking
    local result
    if ! result=$(echo "scale=2; $num1 + $num2" | bc 2>/dev/null); then
        echo "Error: Addition calculation failed" >&2
        return 1
    fi
    
    echo "$result"
}

subtract() {
    local num1=$1
    local num2=$2
    
    validate_number "$num1" "first number" || return 1
    validate_number "$num2" "second number" || return 1
    
    local result
    if ! result=$(echo "scale=2; $num1 - $num2" | bc 2>/dev/null); then
        echo "Error: Subtraction calculation failed" >&2
        return 1
    fi
    
    echo "$result"
}

multiply() {
    local num1=$1
    local num2=$2
    
    validate_number "$num1" "first number" || return 1
    validate_number "$num2" "second number" || return 1
    
    local result
    if ! result=$(echo "scale=2; $num1 * $num2" | bc 2>/dev/null); then
        echo "Error: Multiplication calculation failed" >&2
        return 1
    fi
    
    echo "$result"
}
# File Handling Tutorial in Shell Script
# Writing to a file
echo "Hello, world!" > example.txt

# Reading from a file
content=$(cat example.txt)
echo "File content: $content"


divide() {
    local num1=$1
    local num2=$2
    
    validate_number "$num1" "first number" || return 1
    validate_number "$num2" "second number" || return 1
    
    # Check for division by zero
    if [[ "$num2" == "0" ]] || [[ "$num2" == "0.0" ]]; then
        echo "Error: Cannot divide by zero" >&2
        return 1
    fi
    
    local result
    if ! result=$(echo "scale=2; $num1 / $num2" | bc 2>/dev/null); then
        echo "Error: Division calculation failed" >&2
        return 1
    fi
    
    echo "$result"
}

print_menu() {
    echo -e "\nCalculator Menu:"
    echo "1. Add"
    echo "2. Subtract"
    echo "3. Multiply"
    echo "4. Divide"
    echo "5. Exit"
}

safe_read() {
    local prompt=$1
    local var_name=$2
    local value
    
    while true; do
        read -p "$prompt" value
        
        # Handle Ctrl+C gracefully
        if [[ $? -ne 0 ]]; then
            echo ""
            echo "Input interrupted"
            return 1
        fi
        
        echo "$value"
        return 0
    done
}

# Main program with comprehensive error handling
main() {
    # Check dependencies first
    check_dependencies
    
    echo "Calculator with Error Handling"
    echo "Press Ctrl+C to exit at any time"
    
    # Set up interrupt handler
    trap 'echo ""; echo "Calculator interrupted by user"; exit 0' INT
    
    while true; do
        # Use block to handle errors in the main loop
        {
            print_menu
            
            # Get user choice with error handling
            local choice
            if ! choice=$(safe_read "Enter your choice (1-5): " "choice"); then
                continue
            fi
            
            # Validate choice
            if ! validate_choice "$choice"; then
                echo "Please try again."
                continue
            fi
            
            if [[ "$choice" == "5" ]]; then
                echo "Goodbye!"
                break
            fi
            
            # Get numbers with error handling
            local num1 num2
            
            if ! num1=$(safe_read "Enter first number: " "first number"); then
                continue
            fi
            
            if ! validate_number "$num1" "first number"; then
                echo "Please try again."
                continue
            fi
            
            if ! num2=$(safe_read "Enter second number: " "second number"); then
                continue
            fi
            
            if ! validate_number "$num2" "second number"; then
                echo "Please try again."
                continue
            fi
            
            # Perform calculation based on choice
            local result
            case $choice in
                1) 
                    if result=$(add "$num1" "$num2"); then
                        echo "Result: $result"
                    else
                        echo "Addition failed. Please try again."
                    fi
                    ;;
                2) 
                    if result=$(subtract "$num1" "$num2"); then
                        echo "Result: $result"
                    else
                        echo "Subtraction failed. Please try again."
                    fi
                    ;;
                3) 
                    if result=$(multiply "$num1" "$num2"); then
                        echo "Result: $result"
                    else
                        echo "Multiplication failed. Please try again."
                    fi
                    ;;
                4) 
                    if result=$(divide "$num1" "$num2"); then
                        echo "Result: $result"
                    else
                        echo "Division failed. Please try again."
                    fi
                    ;;
                *)
                    echo "Invalid choice: $choice"
                    ;;
            esac
            
        } || {
            # Handle any unexpected errors in the main loop
            echo "An unexpected error occurred. Please try again."
            continue
        }
    done
}

# Run main function if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi

# BASH ERROR HANDLING TECHNIQUES
#
# Bash doesn't have traditional exception handling like other languages,
# but it provides several mechanisms for error handling and validation.
#
# 1. EXIT CODES:
# Every command returns an exit code (0 = success, non-zero = error)
# Use $? to check the exit code of the last command

demonstrate_exit_codes() {
    echo "=== Exit Code Examples ==="
    
    # Successful command
    echo "Hello" > /dev/null
    if [[ $? -eq 0 ]]; then
        echo "Command succeeded (exit code: $?)"
    fi
    
    # Failed command
    false  # Always returns exit code 1
    if [[ $? -ne 0 ]]; then
        echo "Command failed (exit code: $?)"
    fi
    
    # Using && and || for conditional execution
    echo "test" | grep "test" && echo "Found match" || echo "No match"
}

# 2. SET OPTIONS FOR ERROR HANDLING:
demonstrate_set_options() {
    echo "=== Set Options for Error Handling ==="
    
    # set -e: Exit on any command failure
    # set -u: Exit on undefined variable
    # set -o pipefail: Exit on pipe failure
    # set -x: Print commands before executing (debug)
    
    echo "Current set options: $-"
    
    # Example of undefined variable handling
    # set -u
    # echo $UNDEFINED_VAR  # This would cause script to exit
}

# 3. TRAP MECHANISMS:
demonstrate_traps() {
    echo "=== Trap Mechanisms ==="
    
    # Trap specific signals
    cleanup() {
        echo "Cleanup function called"
        # Perform cleanup operations
    }
    
    # Set traps for different signals
    trap cleanup EXIT    # Called when script exits
    trap cleanup INT     # Called on Ctrl+C
    trap cleanup TERM    # Called on termination
    trap cleanup ERR     # Called on error (with set -e)
    
    echo "Traps set up for cleanup"
}

# 4. CONDITIONAL ERROR CHECKING:
demonstrate_conditionals() {
    echo "=== Conditional Error Checking ==="
    
    # Check if file exists
    check_file() {
        local filename=$1
        
        if [[ ! -f "$filename" ]]; then
            echo "Error: File '$filename' does not exist" >&2
            return 1
        fi
        
        if [[ ! -r "$filename" ]]; then
            echo "Error: File '$filename' is not readable" >&2
            return 1
        fi
        
        echo "File '$filename' is valid"
        return 0
    }
    
    # Check if directory exists and is writable
    check_directory() {
        local dirname=$1
        
        if [[ ! -d "$dirname" ]]; then
            echo "Error: Directory '$dirname' does not exist" >&2
            return 1
        fi
        
        if [[ ! -w "$dirname" ]]; then
            echo "Error: Directory '$dirname' is not writable" >&2
            return 1
        fi
        
        echo "Directory '$dirname' is valid and writable"
        return 0
    }
}

# 5. FUNCTION ERROR HANDLING PATTERNS:
demonstrate_function_patterns() {
    echo "=== Function Error Handling Patterns ==="
    
    # Pattern 1: Return codes
    safe_operation() {
        local input=$1
        
        # Validate input
        if [[ -z "$input" ]]; then
            echo "Error: Input cannot be empty" >&2
            return 1
        fi
        
        # Perform operation
        if ! some_command "$input" &>/dev/null; then
            echo "Error: Operation failed for input '$input'" >&2
            return 2
        fi
        
        echo "Operation successful"
        return 0
    }
    
    # Pattern 2: Output redirection for errors
    safe_operation_with_output() {
        local input=$1
        local output
        
        # Capture both stdout and stderr
        if output=$(some_command "$input" 2>&1); then
            echo "$output"
            return 0
        else
            echo "Error: $output" >&2
            return 1
        fi
    }
    
    # Pattern 3: Try-catch simulation
    try_catch() {
        local error_code=0
        
        # "Try" block
        {
            risky_operation
            another_risky_operation
        } || error_code=$?
        
        # "Catch" block
        if [[ $error_code -ne 0 ]]; then
            echo "Caught error with code: $error_code"
            handle_specific_error $error_code
        fi
    }
    
    handle_specific_error() {
        local code=$1
        case $code in
            1) echo "Handling error code 1" ;;
            2) echo "Handling error code 2" ;;
            *) echo "Handling unknown error code: $code" ;;
        esac
    }
    
    risky_operation() {
        # Simulate a risky operation
        false
    }
    
    another_risky_operation() {
        # Another risky operation
        true
    }
    
    some_command() {
        # Placeholder function
        return 0
    }
}

# 6. INPUT VALIDATION PATTERNS:
demonstrate_input_validation() {
    echo "=== Input Validation Patterns ==="
    
    # Validate email format
    validate_email() {
        local email=$1
        local email_regex='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        
        if [[ ! "$email" =~ $email_regex ]]; then
            echo "Error: Invalid email format: '$email'" >&2
            return 1
        fi
        
        echo "Valid email: $email"
        return 0
    }
    
    # Validate port number
    validate_port() {
        local port=$1
        
        if ! [[ "$port" =~ ^[0-9]+$ ]]; then
            echo "Error: Port must be a number: '$port'" >&2
            return 1
        fi
        
        if [[ $port -lt 1 ]] || [[ $port -gt 65535 ]]; then
            echo "Error: Port must be between 1 and 65535: '$port'" >&2
            return 1
        fi
        
        echo "Valid port: $port"
        return 0
    }
    
    # Validate file path
    validate_path() {
        local path=$1
        
        # Check for dangerous characters
        if [[ "$path" =~ [^a-zA-Z0-9/_.-] ]]; then
            echo "Error: Path contains invalid characters: '$path'" >&2
            return 1
        fi
        
        # Check for directory traversal attempts
        if [[ "$path" =~ \.\. ]]; then
            echo "Error: Path traversal not allowed: '$path'" >&2
            return 1
        fi
        
        echo "Valid path: $path"
        return 0
    }
}

# 7. LOGGING AND DEBUGGING:
demonstrate_logging() {
    echo "=== Logging and Debugging ==="
    
    # Setup logging
    LOG_FILE="/tmp/calculator.log"
    LOG_LEVEL="INFO"  # DEBUG, INFO, WARN, ERROR
    
    log() {
        local level=$1
        shift
        local message="$*"
        local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
        
        # Only log if level is appropriate
        case $LOG_LEVEL in
            DEBUG) log_levels="DEBUG INFO WARN ERROR" ;;
            INFO)  log_levels="INFO WARN ERROR" ;;
            WARN)  log_levels="WARN ERROR" ;;
            ERROR) log_levels="ERROR" ;;
        esac
        
        if [[ " $log_levels " =~ " $level " ]]; then
            echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
        fi
    }
    
    # Logging functions
    log_debug() { log "DEBUG" "$@"; }
    log_info()  { log "INFO" "$@"; }
    log_warn()  { log "WARN" "$@"; }
    log_error() { log "ERROR" "$@"; }
    
    # Debug function execution
    debug_function() {
        local func_name=$1
        shift
        
        log_debug "Entering function: $func_name with args: $*"
        
        # Call the actual function
        "$func_name" "$@"
        local exit_code=$?
        
        log_debug "Exiting function: $func_name with exit code: $exit_code"
        
        return $exit_code
    }
}

# 8. RECOVERY MECHANISMS:
demonstrate_recovery() {
    echo "=== Recovery Mechanisms ==="
    
    # Retry mechanism
    retry() {
        local max_attempts=$1
        local delay=$2
        shift 2
        local command="$@"
        
        local attempt=1
        while [[ $attempt -le $max_attempts ]]; do
            echo "Attempt $attempt/$max_attempts: $command"
            
            if eval "$command"; then
                echo "Command succeeded on attempt $attempt"
                return 0
            else
                echo "Command failed on attempt $attempt"
                if [[ $attempt -lt $max_attempts ]]; then
                    echo "Waiting $delay seconds before retry..."
                    sleep "$delay"
                fi
            fi
            
            ((attempt++))
        done
        
        echo "Command failed after $max_attempts attempts"
        return 1
    }
    
    # Fallback mechanism
    with_fallback() {
        local primary_command=$1
        local fallback_command=$2
        
        echo "Trying primary command: $primary_command"
        if eval "$primary_command"; then
            echo "Primary command succeeded"
            return 0
        else
            echo "Primary command failed, trying fallback: $fallback_command"
            if eval "$fallback_command"; then
                echo "Fallback command succeeded"
                return 0
            else
                echo "Both primary and fallback commands failed"
                return 1
            fi
        fi
    }
}

# BASH ERROR HANDLING BEST PRACTICES:
#
# 1. Always use 'set -euo pipefail' for strict error handling
# 2. Check exit codes of important commands
# 3. Validate all user inputs
# 4. Use trap for cleanup operations
# 5. Redirect errors to stderr with >&2
# 6. Use local variables in functions
# 7. Quote variables to prevent word splitting
# 8. Use [[ ]] instead of [ ] for tests
# 9. Implement logging for debugging
# 10. Provide meaningful error messages
#
# COMMON ERROR PATTERNS:
# - Unset variables (use set -u)
# - Command failures (use set -e)
# - Pipeline failures (use set -o pipefail)
# - File/directory access issues
# - Invalid user input
# - Network timeouts
# - Permission errors
# - Resource exhaustion
#
# ERROR CODES CONVENTION:
# 0   - Success
# 1   - General error
# 2   - Misuse of shell builtin
# 126 - Command invoked cannot execute
# 127 - Command not found
# 128 - Invalid argument to exit
# 130 - Script terminated by Ctrl+C
#
# SIGNAL HANDLING:
# INT  (2)  - Interrupt (Ctrl+C)
# TERM (15) - Termination
# EXIT (0)  - Script exit
# ERR       - Command error (with set -e)