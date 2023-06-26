import { createNotification } from '../components/notification.js';

const form = document.querySelector('#form');
const nameInput = document.querySelector('#name-input');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const matchInput = document.querySelector('#match-input');
const formBtn = document.querySelector('#form-btn');
const notification = document.querySelector('#notification');
// Regex validations

const EMAIL_VALIDATION = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
const PASSWORD_VALIDATION = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const NAME_VALIDATION = /^[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1]+(\s*[A-Z\u00d1][a-zA-Z-ÿí\u00f1\u00d1\s]*)$/;

// Validations

let nameValidation = false;
let emailValidation = false;
let passwordValidation = false;
let matchValidation = false;

const validations = (input, regexValidation) => {
 formBtn.disabled = nameValidation && emailValidation && passwordValidation && matchValidation ? false : true;

    if (input.value === '') {
        input.classList.remove('outline-red-700', 'outline-2', 'outline');
        input.classList.remove('outline-green-700', 'outline-2', 'outline');
        input.classList.add('focus:outline-indigo-700');
    } else if (regexValidation) {
        input.classList.remove('focus:outline-indigo-700');
        input.classList.add('outline-green-700', 'outline-2', 'outline');
    } else if (!regexValidation) {
        input.classList.remove('focus:outline-indigo-700');
        input.classList.remove('outline-green-700', 'outline-2', 'outline');
        input.classList.add('outline-red-700', 'outline-2', 'outline');
    }
};

// events

nameInput.addEventListener('input', e =>{
   nameValidation = NAME_VALIDATION.test(e.target.value);
   validations(nameInput, nameValidation);
});

emailInput.addEventListener('input', e => {
    emailValidation = EMAIL_VALIDATION.test(e.target.value);
    validations(emailInput, emailValidation);
});

passwordInput.addEventListener('input', e => {
    passwordValidation = PASSWORD_VALIDATION.test(e.target.value);
    matchValidation = e.target.value === matchInput.value; 
    validations(passwordInput, passwordValidation);
    validations(matchInput, matchValidation);
});

matchInput.addEventListener('input', e => {
    matchValidation = e.target.value === passwordInput.value; 
    validations(matchInput, matchValidation);
});

form.addEventListener('submit', async e => {
    e.preventDefault();
    try {
        const newUser = {
            name: nameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
        }
        const { data } = await axios.post('/api/users', newUser);
        createNotification(false, data);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000)
       
        nameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        matchInput.value = '';
        validations(nameInput, false);
        validations(emailInput, false);
        validations(passwordInput, false);
        validations(matchInput, false);
    } catch (error) {
        createNotification(true, error.response.data.error);
        setTimeout(() => {
            notification.innerHTML = '';
        }, 5000)
       
    }
     
});

