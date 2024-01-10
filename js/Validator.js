class Validator {
    constructor(config, formID) {
        this.config = config;
        this.form = document.querySelector(formID);
        this.errors = {};

        this.initErrors();
        this.attachInputListeners();
    }

    initErrors() {
        Object.keys(this.config).forEach(field => this.errors[field] = []);
    }

    attachInputListeners() {
        Object.keys(this.config).forEach(field => {
            const input = this.form.querySelector(`input[name="${field}"]`);
            input.addEventListener('input', this.handleInput.bind(this));
        });
    }

    handleInput(event) {
        const field = event.target;
        const fieldName = field.name;
        const fieldValue = field.value.trim();

        this.resetFieldErrors(fieldName);
        this.performValidations(fieldName, fieldValue);

        this.displayErrors();
    }

    resetFieldErrors(fieldName) {
        this.errors[fieldName] = [];
    }

    performValidations(fieldName, fieldValue) {
        const rules = this.config[fieldName];

        if (rules.required && !fieldValue) {
            this.addError(fieldName, 'Field is required');
        }

        if (rules.email && !this.isValidEmail(fieldValue)) {
            this.addError(fieldName, 'Invalid email address');
        }

        if (fieldValue.length < rules.minlength || fieldValue.length > rules.maxlength) {
            this.addError(fieldName, `Field must be between ${rules.minlength} and ${rules.maxlength} characters`);
        }

        if (rules.matching && fieldValue !== this.form.querySelector(`input[name="${rules.matching}"]`).value) {
            this.addError(fieldName, 'Passwords do not match');
        }
    }

    addError(fieldName, message) {
        this.errors[fieldName].push(message);
    }

    displayErrors() {
        this.clearPreviousErrors();

        Object.keys(this.errors).forEach(field => {
            const fieldErrors = this.errors[field];
            if (fieldErrors.length > 0) {
                const errorList = this.createErrorElement(fieldErrors);
                const parentElement = this.form.querySelector(`input[name="${field}"]`).parentElement;
                parentElement.appendChild(errorList);
            }
        });
    }

    clearPreviousErrors() {
        this.form.querySelectorAll('ul.error-messages').forEach(node => node.remove());
    }

    createErrorElement(errors) {
        const ul = document.createElement('ul');
        ul.className = 'error-messages';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            ul.appendChild(li);
        });
        return ul;
    }

    isValidEmail(email) {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    }

    isFormValid() {
        return Object.values(this.errors).every(errors => errors.length === 0);
    }
}

