#include <stdio.h>

#define VOID const int

void print2(const int a) {
	printf("%d", a);
}

int foo( void) 
{
	return 0;
}

int main() {
    int num1, num2, sum;

    // Запрос и ввод первого числа
    printf("Введите первое число: ");
    scanf("%d", &num1);

    // Запрос и ввод второго числа
    printf("Введите второе число: ");
    scanf("%d", &num2);

    // Вычисление суммы
    sum = num1 + num2;

    // Вывод результата
    printf("Сумма чисел %d и %d равна %d\n", num1, num2, sum);

    return 0;
}
