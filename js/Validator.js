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

		if(elFields[fieldName].required) {
			if(fieldValue === '') {
				this.errors[fieldName].push('Polje je prazno');
			}
		}

		if(elFields[fieldName].email) {
			if(!this.validateEmail(fieldValue)) {
				this.errors[fieldName].push('Neispravna email adresa');
			}
		}

		if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
			this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
		}

		if(elFields[fieldName].matching) {
			let matchingEl = document.querySelector(`${this.formID} input[name="${elFields[fieldName].matching}"]`);

			if(fieldValue !== matchingEl.value) {
				this.errors[fieldName].push('Lozinke se ne poklapaju');
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

	populateErrors(errors) {
        // Ensure the form element exists
        const form = document.querySelector(this.formID);
        if (!form) {
            console.error('Form not found for the given formID:', this.formID);
            return;
        }

        // Clear existing errors within the form only
        const existingErrorLists = form.querySelectorAll('.form-error');
        existingErrorLists.forEach(elem => elem.remove());

        Object.keys(errors).forEach(key => {
            let inputElement = form.querySelector(`input[name="${key}"]`);
            if (!inputElement) {
                console.warn('Input element not found for name:', key);
                return; // Skip this iteration if the input element is not found
            }

            let parentElement = inputElement.parentElement;
            if (errors[key].length > 0) {
                let errorsElement = document.createElement('ul');
                errorsElement.classList.add('form-error'); // Add a class to identify these lists
                parentElement.appendChild(errorsElement);

                errors[key].forEach(error => {
                    let li = document.createElement('li');
                    li.innerText = error;
                    errorsElement.appendChild(li);
                });
            }
        });
    }


	validateEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
	    	return true;
		}
	    
	    return false;
	}
}