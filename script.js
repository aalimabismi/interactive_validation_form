// script.js

const form = document.getElementById('registrationForm');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// New elements for data display
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

// ==========================================================
// 1. Core Functions: Show Errors and Success
// ==========================================================

function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form-control error'; // Applies .error styles from CSS
    const small = formControl.querySelector('small');
    small.innerText = message;
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-control success'; // Applies .success styles from CSS
    const small = formControl.querySelector('small');
    small.innerText = ''; // Clears error message on success
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
    return isFormValid;
}

// Checks for a valid email format (using RegEx)
function checkEmail(input) {
    // Standard email RegEx
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if (re.test(input.value.trim())) {
        showSuccess(input);
        return true;
    } else {
        showError(input, 'Email is not valid');
        return false;
    }
}

// Checks if passwords match
function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match');
        return false;
    }
    return true;
}

// Checks field length (min and max)
function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} characters`);
        return false;
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} characters`);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

// Capitalizes the field ID to use as a user-friendly label
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// ==========================================================
// 3. Data Storage and Display Functions (Local Storage)
// ==========================================================

// Gets all records from local storage
function getStoredRecords() {
    const records = localStorage.getItem('registrationRecords');
    return records ? JSON.parse(records) : [];
}

// Saves a new record to local storage, adding a unique ID, timestamp, and type
function saveRecord(record, type) {
    const records = getStoredRecords();
    
    // Create a new record object with ID, timestamp, and type for uniqueness and tracking
    const newRecord = {
        ...record,
        id: Date.now(), // Unique ID using timestamp
        submittedAt: new Date().toLocaleString(), // Timestamp for better display
        type: type // 'student' or 'faculty'
    };
    
    records.push(newRecord);
    localStorage.setItem('registrationRecords', JSON.stringify(records));
}

// Deletes all records from local storage
function deleteAllRecords() {
    if (confirm('Are you sure you want to delete all records?')) {
        localStorage.removeItem('registrationRecords');
        displayRecords();
        console.log('All records have been deleted.');
    }
}

// Deletes a record by ID and refreshes the display
function deleteRecord(idToDelete) {
    // Ask for confirmation before deleting
    if (confirm('Are you sure you want to delete this record?')) {
        const targetId = Number(idToDelete);
        const records = getStoredRecords();
        
        // Filter out the record with the matching ID
        const updatedRecords = records.filter(record => record.id !== targetId);
        
        // Save the updated list back to local storage
        localStorage.setItem('registrationRecords', JSON.stringify(updatedRecords));
        
        // Refresh the display with the updated records
        displayRecords(updatedRecords);

        // Log the action
        console.log(`Record with ID ${targetId} deleted.`);
    }
}

// Updates and displays the records on the screen
function displayRecords(recordsToDisplay) {
    const records = recordsToDisplay || getStoredRecords();
    
    // Clear previous records
    submittedRecords.innerHTML = ''; 

    if (records.length === 0) {
        // Show message if no records exist
        submittedRecords.appendChild(noRecordsMessage);
        noRecordsMessage.classList.remove('hidden');
    } else {
        // Create a new card for each record
        noRecordsMessage.classList.add('hidden');
        
        records.forEach((record, index) => {
            const recordCard = document.createElement('div');
            // Added flex and justify-between to align text and button
            recordCard.className = 'p-4 bg-indigo-50 border border-indigo-200 rounded-lg shadow-sm flex justify-between items-center';
            
            // --- Content Div (Left Side) ---
            const contentDiv = document.createElement('div');
            
            if (record.type === 'faculty') {
                contentDiv.innerHTML = `
                    <h4 class="text-md font-semibold text-indigo-700 mb-1">Faculty Record #${index + 1}</h4>
                    <p class="text-sm text-gray-700"><strong>Faculty ID:</strong> ${record.facultyId}</p>
                    <p class="text-sm text-gray-700"><strong>Department:</strong> ${record.department}</p>
                    <p class="text-sm text-gray-700"><strong>Email:</strong> ${record.email}</p>
                    <p class="text-xs text-gray-500 mt-1">Submitted: ${record.submittedAt}</p>
                `;
            } else { // Default to student
                contentDiv.innerHTML = `
                    <h4 class="text-md font-semibold text-indigo-700 mb-1">Record #${index + 1}</h4>
                    <p class="text-sm text-gray-700"><strong>Username:</strong> ${record.username}</p>
                    <p class="text-sm text-gray-700"><strong>Email:</strong> ${record.email}</p>
                    <p class="text-xs text-gray-500 mt-1">Submitted: ${record.submittedAt}</p>
                    <!-- NOTE: Password is not displayed for security reasons -->
                `;
            }

            // --- Delete Button (Right Side) ---
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.className = 'ml-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition duration-150 shadow-md';
            
            deleteBtn.addEventListener('click', () => {
                deleteRecord(record.id);
            });

            // Append elements to the card
            recordCard.appendChild(contentDiv);
            recordCard.appendChild(deleteBtn);

            // Append the card to the container
            submittedRecords.appendChild(recordCard);
        });
    }
}


// ==========================================================
// 4. Event Listener for Submission
// ==========================================================

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([username, email, password, password2]);
    let isLengthValid = false;
    let isEmailValid = false;
    let isPasswordMatchValid = false;

    if (isRequiredValid) {
        isLengthValid = checkLength(username, 3, 15) && checkLength(password, 6, 25);
        isEmailValid = checkEmail(email);
        isPasswordMatchValid = checkPasswordsMatch(password, password2);
    }
    
    // Submit if all checks pass
    if (isRequiredValid && isLengthValid && isEmailValid && isPasswordMatchValid) {
        
        const submissionData = {
            username: username.value.trim(),
            email: email.value.trim(),
            // Password would be hashed and sent to a server in a real application
            // password: password.value.trim(), 
        };
        
        // 1. Save data to Local Storage with type 'student'
        saveRecord(submissionData, 'student');
        
        // 2. Reset the form and update the display
        form.reset(); 
        displayRecords(); 

        // Replaced alert() with console.log() as per guidelines
        console.log('Registration successfully submitted! 🎉 Record saved in history.');
    }
});

facultyForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const isRequiredValid = checkRequired([facultyId, department, facultyEmail, facultyPassword, facultyPassword2]);
    let isLengthValid = false;
    let isEmailValid = false;
    let isPasswordMatchValid = false;

    if (isRequiredValid) {
        isLengthValid = checkLength(facultyPassword, 6, 25);
        isEmailValid = checkEmail(facultyEmail);
        isPasswordMatchValid = checkPasswordsMatch(facultyPassword, facultyPassword2);
    }
    
    if (isRequiredValid && isLengthValid && isEmailValid && isPasswordMatchValid) {
        const submissionData = {
            facultyId: facultyId.value.trim(),
            department: department.value.trim(),
            email: facultyEmail.value.trim(),
        };
        
        saveRecord(submissionData, 'faculty');
        
        facultyForm.reset(); 
        displayRecords(); 

        console.log('Faculty registration successfully submitted! 🎉 Record saved in history.');
    }
});

// ==========================================================
// 5. Initial Load and Interactive Validation
// ==========================================================

// Display stored records when the page loads
document.addEventListener('DOMContentLoaded', displayRecords);

// Event listener for the "Delete All" button
deleteAllBtn.addEventListener('click', deleteAllRecords);

// ==========================================================
// 6. Role Selection
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
[username, email, password, password2].forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '') {
            if (input.id === 'email') {
                checkEmail(input);
            } else if (input.id === 'username') {
                checkLength(input, 3, 15);
            } else if (input.id === 'password') {
                checkLength(input, 6, 25);
            } else if (input.id === 'password2') {
                checkPasswordsMatch(password, password2);
            }
        }
    });
});
