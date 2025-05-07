include <jet_types.h>
include <strings.h>


VOID MemCopy(VOID* dst, CONST VOID* src, SIZE_TYPE length)
{
  // синоним аргумента dst, преобразованного к типу UINT8*
  UINT8* destination = dst;
  // синоним аргумента src, преобразованного к типу UINT8*
  CONST UINT8* source = src;
  // Цикл по всем копируемым байтам
  for (SIZE_TYPE i = 0; i < length; i++)
  {
    destination[i] = source[i];
  }
}

VOID MemFill(VOID* mem, UINT8 fillValue, SIZE_TYPE length)
{
  // синоним аргумента mem, преобразованного к типу UINT8*
  UINT8* destination = mem;
  // Цикл по всем заполняемым байтам
  for (SIZE_TYPE i = 0; i < length; i++)
  {
    destination[i] = fillValue;
  }
}

BOOL StringIsEqual(CONST CHAR* first, CONST CHAR* second)
{
  SIZE_TYPE index; // индекс проверяемого символа
  // Цикл по всем ненулевым символам строки first
  for (index = 0; first[index]; index++)
  {
    if (first[index] != second[index])
    { // символы с индексом index в строках first и second различны
      break;
    }
  }
  // строки совпадают только, если в цикле обе строки были пройдены до конца
  return (first[index] == 0) && (second[index] == 0);
}
