'use strict';

function shouldRedirect() {
    if (window.document.getElementById('login')?.value?.length && window.document.getElementById('password')?.value?.length) {
        window.location.replace('main.html');
    }
}
        