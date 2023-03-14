# js-substring_search_hash
Поиск подстроки в строке с использованием хешей.


**Пример запуска:**

js-substring_search_hash>node src/hash.js -n 4 -t -c h3 resources/Harry.txt resources/HarrySubStr.txt

**-n number**, если установлен, то выводится number ближайших вхождений подстроки\
**-t**, если установлен, то выводится время работы алгоритма\
**-c**, если установлен, то выводится количество коллизий\
**h3** - мод, b - bruteforce, h1, h2, h3 - разновидности хешей\
**resources/Harry.txt** - текст про Гарри Поттера\
**resources/HarrySubStr.txt** - подстрока "Гарри"

Для примера выше будет выведен результат:\
WorkTime h3: 0ms\
There are 1 collisions\
------First n entries-----\
|            6652           |\
|            7338           |\
|            7438           |\
|            12939           |\
--------------------------\

