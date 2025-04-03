import Pharmaceutical from './pharmaceuticals.js';

class Ui {
    constructor() {
        this.pharmaceuticalList = [];
        this.pharmaceuticalListContainer = document.getElementById('pharmaceutical-list');
        this.welcomeMessage = document.querySelector('.welcome-message');
        this.modal = document.querySelector(".form-modal__all");
    }

    // Render the page by displaying all pharmaceuticals
    renderPage() {
        this.clearPage();
        this.pharmaceuticalList.forEach(pharmaceutical => {
            this.pharmaceuticalListContainer.appendChild(pharmaceutical.render());
        });
        
        // Hide the welcome message after pharmaceutical is added
        if (this.pharmaceuticalList.length > 0) {
            this.hideWelcomeMessage();
        }
    }

    // Clear the pharmaceutical list container
    clearPage() {
        this.pharmaceuticalListContainer.innerHTML = '';
    }

    // Hide the welcome message
    hideWelcomeMessage() {
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
        }
    }

    // connect add button and form
    static openFormOnClick() {
        const addButton = document.querySelector(".button-add");
        const modal = document.querySelector(".form-modal__all");
        const closeButton = document.querySelector(".form-modal__close");

        // Open form when the add button is clicked
        addButton.addEventListener("click", () => {
            modal.classList.add("form-modal__open");
        });

        // Close the modal when the close button is clicked
        closeButton.addEventListener("click", () => {
            modal.classList.remove("form-modal__open");
        });

        // Close the modal if the user clicks outside of it
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("form-modal__open");
            }
        });
    }

    // Handle form submission to create a new pharmaceutical
    handleFormSubmit(form) {
        const pharmaceutical = this.getFormData(form);
        this.addPharmaceutical(pharmaceutical);
        this.renderPage();
        form.reset();
        this.closeModal();
    }

    // Close the modal by removing the 'form-modal__open' class
    closeModal() {
        this.modal.classList.remove("form-modal__open");
    }

    // Create a Pharmaceutical object
    getFormData(form) {
        const name = form.querySelector(".form__input--pharmaceutical-name").value;
        const manufacturer = form.querySelector(".form__input--manufacturer-name").value;
        const expirationDate = form.querySelector(".form__input--expiration-date").value;
        const quantity = form.querySelector(".form__input--quantity-number").value;
        const isPrescription = form.querySelector("input[name='drug']:checked").value === 'yes';

        return new Pharmaceutical(name, manufacturer, expirationDate, quantity, isPrescription);
    }

    // Add pharmaceutical to the list
    addPharmaceutical(pharmaceutical) {
        this.pharmaceuticalList.push(pharmaceutical);
    }
}

export default Ui;
