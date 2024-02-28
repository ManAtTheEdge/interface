'use strict';

function CheckFewMonthsCheckBox(checked) {
    window.document.getElementById('periodEndSection').hidden = !checked;
    window.document.getElementById('periodEndDate').required = checked;
}

function validateBeforeSave() {
    window.document.getElementById('saveAndSendButton').disabled = true;
    const validAttributes = {
        periodStartDate: getValue(window, 'periodStartDate'),
        calculatedExpenses: (getValue(window, 'calculatedExpenses') - 0),
        periodEndDate: true
    };

    setValid(window, 'periodStartDate', validAttributes.periodStartDate, "Поле обязательно для заполнения.");
    if (window.document.getElementById('fewMonthsReport').checked) {
        validAttributes.periodEndDate = getValue(window, 'periodEndDate');
        setValid(window, 'periodEndDate', validAttributes.periodEndDate, "Поле обязательно для заполнения.");
        const endDate = validAttributes.periodEndDate;
        const startDate = validAttributes.periodStartDate;
        if (endDate <= startDate) {
            setValid(window, 'periodEndDate', false, "Дата окончания отчётного периода не может быть меньше или равна дате начала отчётного периода.");
            validAttributes.periodEndDate = false;
        }
    }
    setValid(window, 'calculatedExpenses', !!validAttributes.calculatedExpenses, "Итоговая сумма обязательна для заполнения и не равна нулю.");

    if (!!validAttributes.calculatedExpenses && !!validAttributes.periodStartDate && !!validAttributes.periodEndDate) {
        window.document.getElementById('saveAndSendButton').disabled = false;
    }
}

const getValue = (window, elemId) => {
    return window.document.getElementById(elemId).value;
};

const setValid = (window, elemId, isValid, text) => {
    if (!isValid) {
        window.document.getElementById(elemId).setCustomValidity(text);
    }
    else {
        window.document.getElementById(elemId).setCustomValidity("")
    }
}

const calculateExpenses = () => {
    let representation = getValue(window, 'representation');
    let trip = getValue(window, 'trip');
    let auto = getValue(window, 'auto');
    let others = getValue(window, 'others');
    let result = 0;

    if (representation.match(/[0-9]/)) {
        result += formatString(representation);
        setValid(window, 'representation', true);
    }
    else {
        setValid(window, 'representation', false, "Значение должно содержать только цифры.");
    }

    if (trip.match(/[0-9]/)) {
        result += formatString(trip);
        setValid(window, 'trip', true);
    }
    else {
        setValid(window, 'trip', false, "Значение должно содержать только цифры.");
    }

    if (auto.match(/[0-9]/)) {
        result += formatString(auto);
        setValid(window, 'auto', true);
    }
    else {
        setValid(window, 'auto', false, "Значение должно содержать только цифры.");
    }

    if (others.match(/[0-9]/)) {

        result += formatString(others);
        setValid(window, 'others', true);
    }
    else {
        setValid(window, 'others', false, "Значение должно содержать только цифры.");
    }

    window.document.getElementById('calculatedExpenses').value = result.toString();
}

function sendForm() {
    alert('Отчёт направлен на согласование руководству.')
}

const formatString = (val) => {
    if (val.includes(',')) {
        return val.replace(',', '.') - 0;
    }
    else return val - 0;
}