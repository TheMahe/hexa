class Validator {
	constructor(config, formID) {
		this.elementsConfig = config;
		this.formID = formID;
		this.errors = {};

		this.generateErrorsObject();
		this.inputListener();
	}

	generateErrorsObject() {
		for(let field in this.elementsConfig) {
			this.errors[field] = [];
		}
	}

	inputListener() {
		let inputSelector = this.elementsConfig;

		for(let field in inputSelector) {
			let el = document.querySelector(`${this.formID} input[name="${field}"]`);

			el.addEventListener('input', this.validate.bind(this));
		}
	}

	validate(e) {
		let elFields = this.elementsConfig;

		let field = e.target;
		let fieldName = field.getAttribute('name');
		let fieldValue = field.value;

		this.errors[fieldName] = [];
		this.clearErrors(fieldName);

		if(elFields[fieldName].required) {
			if(fieldValue === '') {
				this.errors[fieldName].push('Field is empty');
			}
		}

		if(elFields[fieldName].email) {
			if(!this.validateEmail(fieldValue)) {
				this.errors[fieldName].push('Invalid email address');
			}
		}

		if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
			this.errors[fieldName].push(`Field must have a minimum of ${elFields[fieldName].minlength} and a maximum of ${elFields[fieldName].maxlength} characters`);
		}

		if(elFields[fieldName].matching) {
			let matchingEl = document.querySelector(`${this.formID} input[name="${elFields[fieldName].matching}"]`);

			if(fieldValue !== matchingEl.value) {
				this.errors[fieldName].push('Passwords do not match');
			}

			if(this.errors[fieldName].length === 0) {
				this.errors[fieldName] = [];
				this.errors[elFields[fieldName].matching] = [];
			}
		}

		this.populateErrors(this.errors);
	}

	validationPassed() {
		for(let key of Object.keys(this.errors)) {
			if(this.errors[key].length > 0) {
				return false;
			}
		}

		return true;
	}

	clearErrors(fieldName) {
		let parentElement = document.querySelector(`${this.formID} input[name="${fieldName}"]`).parentElement;
		let errorsElement = parentElement.querySelector('ul');
		if (errorsElement) {
			errorsElement.remove();
		}
	}

	populateErrors(errors) {
		for(let key of Object.keys(errors)) {
			let parentElement = document.querySelector(`${this.formID} input[name="${key}"]`).parentElement;
			let errorsElement = document.createElement('ul');
			parentElement.appendChild(errorsElement);

			errors[key].forEach(error => {
				let li = document.createElement('li');
				li.innerText = error;

				errorsElement.appendChild(li);
			});
		}
	}

	validateEmail(email) {
		let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return emailRegex.test(email);
	}
}