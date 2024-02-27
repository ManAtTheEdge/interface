'use strict';

function enableFields(value) {
    let fieldsId = ['FullName', 'Place', 'Post', 'Chief'];

    for (let el of fieldsId) {
        window.document.getElementById(el).disabled = !value;
    }
}