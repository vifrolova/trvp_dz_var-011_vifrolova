#include <stdio.h>
#include <string.h>

// Определение структуры для представления студента
struct Student {
    int id;
    char name[50];
    float gpa;
};

// Определение структуры для представления курса
struct Course {
    int courseId;
    char courseName[100];
    int credits;
};

// Функция для отображения информации о студенте
void displayStudent(struct Student student) {
    printf("Student ID: %d\n", student.id);
    printf("Name: %s\n", student.name);
    printf("GPA: %.2f\n", student.gpa);
}

// Функция для отображения информации о курсе
void displayCourse(struct Course course) {
    printf("Course ID: %d\n", course.courseId);
    printf("Course Name: %s\n", course.courseName);
    printf("Credits: %d\n", course.credits);
}

int main() {
    // Создание и инициализация студента
    struct Student student1;
    student1.id = 1;
    strcpy(student1.name, "Alice");
    student1.gpa = 3.8;

    // Создание и инициализация курса
    struct Course course1;
    course1.courseId = 101;
    strcpy(course1.courseName, "Introduction to Programming");
    course1.credits = 3;

    // Отображение информации о студенте и курсе
    printf("Student Information:\n");
    displayStudent(student1);
    printf("\nCourse Information:\n");
    displayCourse(course1);

    return 0;
}
