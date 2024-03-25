'use strict';

// В какой-то момент в проекте перестал работать оператор "??". Решение ниже - написанная функция, использующаяся по сей день

/**
 * 
 * @param {Object} obj Объект, в котором будут проверяться значения свойств
 * @param {String} path Пусть до искомого значения в объекте
 * @param {any} defaultValue Значение по умолчанию (может быть как примитивом, так и объектом)
 * @returns 
 */

function getValue(obj, path = '', defaultValue) {
    if (!path) {
        return obj;
    }

    for (const name of path.split('.')) {
        if (!obj) {
            return defaultValue;
        }
        else {
            obj = obj[name];
        }
    }

    return obj === undefined ? defaultValue : obj;
}

/*
Метод по работе с датами, о котором я рассказывал.

Ошибка заключалась в том, что при добавлении нескольких месяцев к исходной дате
JS автоматически переходил на новый месяц в случае, если количество дней в полученной
Дате было больше, чем максимальное количество дней в месяце (например, 31.02.2024 он превращал в 02.03.2024)

*/

/**
 * 
 * @param {String} input Дата
 * @param {Number} months Количество месяцев
 * @returns {String | undefined} 
 */

function getCorrectDate(input, months) {
    if (!input) {
        return;
    }

    if (!months) {
        return input;
    }

    let data = new Date(input);
    let day = data.getDate();
    let month = data.getMonth() + 1; // т.к. нумерация месяцев идёт с 0
    let year = data.getFullYear();

    month += months;

    if (month > 12) {
        month = month % 12;
        year++;
    }

    /*
    new Date(year, month, 0) вернёт дату с максимальным числом дней в месяце
    Например, new Date(2024, 2, 0) вернёт 29-02-2024 (в другом формате, конечно же)
    new Date(2023, 2, 0) вернёт 28-02-2024. Эту проверку я и использовал для того, чтобы узнать,
    существует ли созданная дата или нет.
    day - 1 - Нумерация дней в методе корректная, просто это уменьшение - бизнес-требование.
    */
    day = new Date(year, month, 0).getDate() < day ? new Date(year, month, 0).getDate() : day - 1;

    if (day === 0) {
        month--;
        if (month === 0) {
            year--;
            month = 12;
        }
        day = new Date(year, month, 0).getDate();
    }

    return formatDate({ year, month, day });
}

function formatDate(input) {
    let day = input.day;
    let month = input.month;
    let year = input.year;

    if (day < 10) {
        day = '0' + day; // чтобы получать число формата "07" вместо "7"
    }

    if (month < 10) {
        month = '0' + month; // та же история, что и с днём
    }

    return `${year}-${month}-${day}`; // дата в необходимом формате
}

/*
Функция, написанная мною из-за отсутствия необходимости сравнивать пустые и/или недозаполненные значения,
приходящие из сторонних сервисов, со значениями, находящимися в системе.
*/

function shouldToCheckValue(attribute) {
    switch (typeof (attribute)) {
        case 'string':
            if (attribute == "") { return true; }
            break;
        case 'number':
            if (attribute == 0) { return true; }
            break;
        case 'undefined':
            return true;
        case 'object':
            if (attribute == null) { return true; }
            else if (Array.isArray(attribute)) {
                if (!attribute.length) { return true; }
            }
            else if (!Object.keys(attribute).length) { return true; }
            break;
    }
    return false;
}

// Метод по получению возраста человека (страхователи, водители и прочие)
/**
 * 
 * @param {String} birthString Дата рождения 
 * @param {String} todayString Текущая дата (для того, чтобы считать возраст на конкретную дату)
 * @returns 
 */
function getAge(birthString, todayString = '') {

    if (!birthString) { return; }

    let today = todayString === '' ? new Date(this.dateNow()) : new Date(todayString);
    let birthDate = new Date(birthString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}