#include <stdio.h>

// Функция 1: Без параметров
void printHello() {
    printf("Hello, World!\n");
}

// Функция 2: С параметром
void printSum(int a, int b) {
    printf("Sum: %d\n", a + b);
}

// Функция 3: С параметром
int multiply(int a, int b) {
    return a * b;
}

// Функция 4: Без параметров
void printGoodbye() {
    printf("Goodbye!\n");
}

// Функция 5: С параметром
void printSquare(int num) {
    printf("Square of %d: %d\n", num, num * num);
}

// Функция 6: Без параметров
void printRandomNumber() {
    printf("Random number: %d\n", rand() % 100);
}

// Функция 7: С параметром
void greetUser(const char* name) {
    printf("Hello, %s!\n", name);
}

// Функция 8: С параметром
void printArray(int arr[], int size) {
    printf("Array elements: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// Функция 9: Без параметров
void printMessage() {
    printf("This is a message from printMessage function.\n");
}

// Функция 10: С параметром
void findMax(int a, int b) {
    int max = (a > b) ? a : b;
    printf("Max: %d\n", max);
}

int main() {
    printHello();
    printSum(5, 10);
    int product = multiply(4, 6);
    printf("Product: %d\n", product);
    printGoodbye();
    printSquare(7);
    printRandomNumber();
    greetUser("Alice");

    int arr[] = {1, 2, 3, 4, 5};
    printArray(arr, 5);
    printMessage();
    findMax(15, 20);

    return 0;
}
