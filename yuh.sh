#!/bin/bash
# A simple calculator program to demonstrate Bash script structure

# Calculator functions
add() {
    echo "scale=2; $1 + $2" | bc
}

subtract() {
    echo "scale=2; $1 - $2" | bc
}

multiply() {
    echo "scale=2; $1 * $2" | bc
}

divide() {
    if [ "$2" = "0" ]; then
        echo "Error: Cannot divide by zero"
    else
        echo "scale=2; $1 / $2" | bc
    fi
}

print_menu() {
    echo -e "\nCalculator Menu:"
    echo "1. Add"
    echo "2. Subtract"
    echo "3. Multiply"
    echo "4. Divide"
    echo "5. Exit"
}

# Main program loop
while true; do
    print_menu
    read -p "Enter your choice (1-5): " choice
    
    if [ "$choice" = "5" ]; then
        echo "Goodbye!"
        break
    fi
    
    read -p "Enter first number: " num1
    read -p "Enter second number: " num2
    
    case $choice in
        1) echo "Result: $(add $num1 $num2)";;
        2) echo "Result: $(subtract $num1 $num2)";;
        3) echo "Result: $(multiply $num1 $num2)";;
        4) echo "Result: $(divide $num1 $num2)";;
        *) echo "Invalid choice!";;
    esac
done