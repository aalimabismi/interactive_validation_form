// script.js
console.log("script.js is running!");

// 1. HTML Element References
const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// New elements for data display and type selection
const submittedRecords = document.getElementById('submittedRecords');
const noRecordsMessage = document.getElementById('noRecordsMessage');
const deleteAllBtn = document.getElementById('deleteAllBtn');
const studentBtn = document.getElementById('studentBtn');
const facultyBtn = document.getElementById('facultyBtn');
const studentForm = document.getElementById('registrationForm');
const facultyForm = document.getElementById('facultyRegistrationForm');
const facultyId = document.getElementById('facultyId');
const department = document.getElementById('department');
const facultyEmail = document.getElementById('facultyEmail');
const facultyPassword = document.getElementById('facultyPassword');
const facultyPassword2 = document.getElementById('facultyPassword2');
const successMessage = document.getElementById('successMessage');

// ==========================================================
// 1. Core Functions: Show Errors and Success
// ==========================================================

function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error'; 
    const small = formControl.querySelector('small');
    small.innerText = message;
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success'; 
    const small = formControl.querySelector('small');
    small.innerText = ''; 
}

// ==========================================================
// 2. Validation Rules
// ==========================================================

// Checks required fields
function checkRequired(inputArr) {
    let isFormValid = true;
    inputArr.forEach(function(input) {
        if (input.value.trim() === '') {
            showError(input, `${getFieldName(input)} is required`);
            isFormValid = false;
        } else {
            showSuccess(input);
        }
    });
    console.log('checkRequired result:', isFormValid); 
    return isFormValid;
}

// *** checkEmail function REMOVED as requested ***

// Checks if passwords match
function checkPasswordsMatch(input1, input2) {
    let isValid = true;
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match');
        isValid = false;
    }
    console.log('checkPasswordsMatch result:', isValid); 
    return isValid;
}

// Checks field length (min and max)
function checkLength(input, min, max) {
    let isValid = true; 
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
        isValid = false;
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
        isValid = false;
    } else {
        showSuccess(input);
    }
    console.log(`checkLength for ${getFieldName(input)} (${min}-${max}) result:`, isValid); 
    return isValid;
}

// Capitalizes the field ID to use as a user-friendly label
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// ==========================================================
// 3. UI Feedback Functions
// ==========================================================

function showSuccessMessage() {
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000); 
}

// ==========================================================
// 4. Data Storage and Display Functions (Local Storage)
// ==========================================================

function getStoredRecords() {
    const records = localStorage.getItem('registrationRecords');
    return records ? JSON.parse(records) : [];
}

function saveRecord(record, type) {
    const records = getStoredRecords();
    
    const newRecord = {
        ...record,
        id: Date.now(), 
        submittedAt: new Date().toLocaleString(), 
        type: type 
    };
    
    records.push(newRecord);
    localStorage.setItem('registrationRecords', JSON.stringify(records));
}

function deleteAllRecords() {
    if (confirm('Are you sure you want to delete all records?')) {
        localStorage.removeItem('registrationRecords');
        displayRecords();
        console.log('All records have been deleted.');
    }
}

function deleteRecord(idToDelete) {
    if (confirm('Are you sure you want to delete this record?')) {
        const targetId = Number(idToDelete);
        const records = getStoredRecords();
        
        const updatedRecords = records.filter(record => record.id !== targetId);
        
        localStorage.setItem('registrationRecords', JSON.stringify(updatedRecords));
        
        displayRecords(updatedRecords);

        console.log(`Record with ID ${targetId} deleted.`);
    }
}

function displayRecords(recordsToDisplay) {
    const records = recordsToDisplay || getStoredRecords();
    
    submittedRecords.innerHTML = ''; 

    if (records.length === 0) {
        submittedRecords.appendChild(noRecordsMessage);
        noRecordsMessage.classList.remove('hidden');
    } else {
        noRecordsMessage.classList.add('hidden');
        
        records.forEach((record, index) => {
            const recordCard = document.createElement('div');
            recordCard.className = 'p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex justify-between items-center';
            
            const contentDiv = document.createElement('div');
            
            if (record.type === 'faculty') {
                contentDiv.innerHTML = `
                    <h4 class="text-md font-semibold text-indigo-700 mb-1">Faculty Record #${index + 1}</h4>
                    <p class="text-sm text-gray-700"><strong>Faculty ID:</strong> ${record.facultyId}</p>
                    <p class="text-sm text-gray-700"><strong>Department:</strong> ${record.department}</p>
                    <p class="text-sm text-gray-700"><strong>Email:</strong> ${record.email}</p>
                    <p class="text-sm text-green-600 font-semibold">Successfully registered! 🎉</p>
                    <p class="text-xs text-gray-500 mt-1">Submitted: ${record.submittedAt}</p>
                `;
            } else { // Default to student
                contentDiv.innerHTML = `
                    <h4 class="text-md font-semibold text-indigo-700 mb-1">Student Record #${index + 1}</h4>
                    <p class="text-sm text-gray-700"><strong>Username:</strong> ${record.username}</p>
                    <p class="text-sm text-gray-700"><strong>Email:</strong> ${record.email}</p>
                    <p class="text-sm text-green-600 font-semibold">Successfully registered! 🎉</p>
                    <p class="text-xs text-gray-500 mt-1">Submitted: ${record.submittedAt}</p>
                `;
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.className = 'ml-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition duration-150 shadow-md';
            
            deleteBtn.addEventListener('click', () => {
                deleteRecord(record.id);
            });

            recordCard.appendChild(contentDiv);
            recordCard.appendChild(deleteBtn);

            submittedRecords.appendChild(recordCard);
        });
    }
}


// ==========================================================
// 5. Event Listener for Submission 
// ==========================================================

// STUDENT FORM SUBMISSION
form.addEventListener('submit', function(e) {
    console.log("Student form submitted!"); 
    e.preventDefault();

    // Removed email from validation list since it's only required now, not format-checked
    const isRequiredValid = checkRequired([username, email, password, password2]);
    let isLengthValid = false;
    let isPasswordMatchValid = false;

    if (isRequiredValid) {
        isLengthValid = checkLength(username, 3, 15) && checkLength(password, 6, 25);
        // checkEmail(email) REMOVED
        isPasswordMatchValid = checkPasswordsMatch(password, password2);
    }
    
    // Submit if all checks pass
    if (isRequiredValid && isLengthValid && isPasswordMatchValid) { // isEmailValid check REMOVED
        
        const submissionData = {
            username: username.value.trim(),
            email: email.value.trim(),
        };
        
        saveRecord(submissionData, 'student');
        
        form.reset();
        
        alert('Successfully registered!'); 

        displayRecords(); 
        
        [username, email, password, password2].forEach(showSuccess);
        
        console.log('Registration successfully submitted! 🎉 Record saved in history.');
    }
});

// FACULTY FORM SUBMISSION
facultyForm.addEventListener('submit', function(e) {
    console.log("Faculty form submitted!"); 
    e.preventDefault();

    // Removed facultyEmail from format validation consideration
    const isRequiredValid = checkRequired([facultyId, department, facultyEmail, facultyPassword, facultyPassword2]);
    let isLengthValid = false;
    let isPasswordMatchValid = false;

    if (isRequiredValid) {
        isLengthValid = checkLength(facultyPassword, 6, 25);
        // checkEmail(facultyEmail) REMOVED
        isPasswordMatchValid = checkPasswordsMatch(facultyPassword, facultyPassword2);
    }
    
    if (isRequiredValid && isLengthValid && isPasswordMatchValid) { // isEmailValid check REMOVED
        const submissionData = {
            facultyId: facultyId.value.trim(),
            department: department.value.trim(),
            email: facultyEmail.value.trim(),
        };
        
        saveRecord(submissionData, 'faculty');

        facultyForm.reset();

        alert('Successfully registered!');

        displayRecords();
        
        [facultyId, department, facultyEmail, facultyPassword, facultyPassword2].forEach(showSuccess);

        console.log('Faculty registration successfully submitted! 🎉 Record saved in history.');
    }
});

// ==========================================================
// 6. Initial Load and Interactive Validation
// ==========================================================

document.addEventListener('DOMContentLoaded', displayRecords);

deleteAllBtn.addEventListener('click', deleteAllRecords);

// ==========================================================
// 7. Role Selection
// ==========================================================

studentBtn.addEventListener('click', () => {
    studentForm.classList.remove('hidden');
    facultyForm.classList.add('hidden');
    studentBtn.classList.add('bg-indigo-600', 'text-white');
    studentBtn.classList.remove('bg-gray-300', 'text-gray-700');
    facultyBtn.classList.add('bg-gray-300', 'text-gray-700');
    facultyBtn.classList.remove('bg-indigo-600', 'text-white');
});

facultyBtn.addEventListener('click', () => {
    facultyForm.classList.remove('hidden');
    studentForm.classList.add('hidden');
    facultyBtn.classList.add('bg-indigo-600', 'text-white');
    facultyBtn.classList.remove('bg-gray-300', 'text-gray-700');
    studentBtn.classList.add('bg-gray-300', 'text-gray-700');
    studentBtn.classList.remove('bg-indigo-600', 'text-white');
});

// Checks when the user fills an input field and moves out (on blur)
[username, email, password, password2, facultyId, department, facultyEmail, facultyPassword, facultyPassword2].forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            if (input.id === 'username') {
                checkLength(input, 3, 15);
            } else if (input.id === 'password') {
                checkLength(input, 6, 25);
            } else if (input.id === 'password2') {
                checkPasswordsMatch(password, password2);
            } else if (input.id === 'facultyPassword') {
                checkLength(input, 6, 25);
            } else if (input.id === 'facultyPassword2') {
                checkPasswordsMatch(facultyPassword, facultyPassword2);
            } else {
                // Email fields now only check for being non-empty (which checkRequired does)
                showSuccess(input);
            }
        }
    });
});