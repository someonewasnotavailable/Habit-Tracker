'use strict'
if (localStorage.getItem('loggedIn?')) window.location.href = "habitChecker.html"
else console.log('not signed in');
 
const form = document.querySelector('form')
const email = document.querySelector('#email')
const namein = document.querySelector('#firstname')
const password = document.querySelector('#password')

form.addEventListener('submit', e => {
    e.preventDefault()
    const emailInput = email.value
    const nameInput = namein.value
    const passInput = password.value
    
const formvalidation = () => {
    let isValid = true
    
    // Reset error states
    email.classList.remove('input-error')
    namein.classList.remove('input-error')
    password.classList.remove('input-error')
    
    // Check if email is empty
    if (!emailInput.trim()) {
        email.classList.add('input-error')
        isValid = false
    }
    
    // email validation
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (emailInput.trim() && regexEmail.test(emailInput) == false) {
        email.classList.add('input-error')
        isValid = false
    }
    
    // Check if name is empty
    if (!nameInput.trim()) {
        namein.classList.add('input-error')
        isValid = false
    }
    
    // name validation
    if (nameInput.length > 12) {
        namein.classList.add('input-error')
        isValid = false
    }
    
    // Check if password is empty
    if (!passInput.trim()) {
        password.classList.add('input-error')
        isValid = false
    }
    
    // If validation passes
    if (isValid && emailInput && nameInput && passInput) {
        console.log('Form submitted successfully!')
        localStorage.setItem('loggedIn?', true)
        localStorage.setItem('userEmail', emailInput)
        localStorage.setItem('userName', nameInput)
        window.location.href = "habitChecker.html"
    }
}

formvalidation()
})