#include <stdio.h>
#include <stdlib.h>

// Функция 1: Без параметров
void printHello() {
    printf("Hello, World!\n");
}

// Функция 2: Изменилось количество параметров и имя
void printSumma(int a, int b, int c) {
    printf("Summ: %d\n", a + b + c);
}

// Функция 3: С параметром
int multiply(int a, int b, int c) {
    return a * b * c;
}

// Функция 4: Без параметров
void printRandomNumber() {
    printf("Random number: %d\n", rand() % 100);
}

// Функция 5: С параметром
void printSquare(int num) {
    printf("Square of %d: %d\n", num, num * num);
}

// Функция 6: Изменилось имя
void greetUsers(const char* name) {
    printf("Hello, %s!\n", name);
}

// Функция 7: Изменилось количество параметров
void printArray(int arr[], int size, int offset) {
    printf("Array elements with offset %d: ", offset);
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i] + offset);
    }
    printf("\n");
}

// Функция 8: Удалена
// void printMesssage() {
//     printf("This is a message from printMesssage function.\n");
// }

// Функция 9: С параметром
void findMax(int a, int b) {
    int max = (a > b) ? a : b;
    printf("Max: %d\n", max);
}

// Функция 10: С параметром
void printDifference(int a, int b) {
    printf("Difference: %d\n", a - b);
}

// Функция 11: С параметром
void printCube(int num) {
    printf("Cube of %d: %d\n", num, num * num * num);
}

// Функция 12: Добавлена
void printAge(int age) {
    printf("Age is: %d\n", age);
}

int main() {
    printHello();
    printSuum(5, 10);
    int product = multiply(4, 6);
    printf("Product: %d\n", product);
    printRandomNumber();
    printSquare(7);
    greetUser("Alice");

    int arr[] = {1, 2, 3, 4, 5};
    printArray(arr, 5, 2); // Пример использования нового параметра offset
    printMesssage();
    findMax(15, 20);
    printDifference(10, 4);
    printCube(3);

    return 0;
}
