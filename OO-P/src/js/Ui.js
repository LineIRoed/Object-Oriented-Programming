import Pharmaceutical from './pharmaceuticals.js';

class Ui {
    constructor() {
        this.pharmaceuticalList = this.loadFromLocalStorage();
        this.pharmaceuticalListContainer = document.getElementById('pharmaceutical-list');
        this.welcomeMessage = document.querySelector('.welcome-message');
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.filteredPharmaceuticals = [...this.pharmaceuticalList];
        this.editIndex = -1;

        // Initialize by rendering the page and attaching event listeners
        this.renderPage();
        this.attachFilterEventListeners();
    }

    // Load pharmaceuticals from localStorage
    loadFromLocalStorage() {
        const pharmaceuticals = localStorage.getItem('pharmaceuticals');
        if (pharmaceuticals) {
            return JSON.parse(pharmaceuticals).map((data) => {
                return new Pharmaceutical(
                    data.name, 
                    data.manufacturer, 
                    data.expirationDate, 
                    data.quantity, 
                    data.isPrescription
                );
            });
        }
        return [];
    }

    // Save pharmaceuticals to localStorage
    saveToLocalStorage() {
        const pharmaceuticalData = this.pharmaceuticalList.map(pharmaceutical => ({
            name: pharmaceutical.name,
            manufacturer: pharmaceutical.manufacturer,
            expirationDate: pharmaceutical.expirationDate,
            quantity: pharmaceutical.quantity,
            isPrescription: pharmaceutical.isPrescription
        }));
        localStorage.setItem('pharmaceuticals', JSON.stringify(pharmaceuticalData));
    }

    // Render the page with pharmaceuticals
    renderPage() {
        this.clearPage();

        // Add pharmaceutical to page
        this.filteredPharmaceuticals.forEach((pharmaceutical, index) => {
            this.pharmaceuticalListContainer.appendChild(
                pharmaceutical.render(
                    () => this.deletePharmaceutical(index),
                    () => this.openEditModal(index)
                )
            );
        });

        // Show/hide welcome message
        if (this.filteredPharmaceuticals.length > 0) {
            this.hideWelcomeMessage();
        } else {
            this.showWelcomeMessage();
        }
    }

    // Clear the page of all items
    clearPage() {
        this.pharmaceuticalListContainer.innerHTML = '';
    }

    // Hide the welcome message
    hideWelcomeMessage() {
        this.welcomeMessage.style.display = 'none';
    }

    // Show the welcome message
    showWelcomeMessage() {
        this.welcomeMessage.style.display = 'block';
    }

    // event listeners to filter buttons
    attachFilterEventListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterType = button.dataset.id;
                this.filterPharmaceuticals(filterType);
            });
        });
    }

    // Filter pharmaceuticals based on type
    filterPharmaceuticals(type) {
        if (type === 'all') {
            this.filteredPharmaceuticals = [...this.pharmaceuticalList];
        } else if (type === 'perscription') {
            this.filteredPharmaceuticals = this.pharmaceuticalList.filter(pharmaceutical => pharmaceutical.isPrescription);
        } else if (type === 'overTheCounter') {
            this.filteredPharmaceuticals = this.pharmaceuticalList.filter(pharmaceutical => !pharmaceutical.isPrescription);
        }

        this.renderPage();
    }

    // Open the form when the "Add" button is clicked
    static openFormOnClick() {
        const addButton = document.querySelector(".button-add");
        const modal = document.querySelector(".form-modal__all");
        const closeButton = document.querySelector(".form-modal__close");

        addButton.addEventListener("click", () => {
            modal.classList.add("form-modal__open");
        });

        closeButton.addEventListener("click", () => {
            modal.classList.remove("form-modal__open");
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("form-modal__open");
            }
        });
    }

    // add/edit function
    handleFormSubmit(form) {
        const name = form.querySelector(".form__input--pharmaceutical-name").value;
        const manufacturer = form.querySelector(".form__input--manufacturer-name").value;
        const expirationDate = form.querySelector(".form__input--expiration-date").value;
        const quantity = form.querySelector(".form__input--quantity-number").value;
        const isPrescription = form.querySelector("input[name='drug']:checked").value === "yes";

        if (this.editIndex !== -1) {
            // If editing, update the pharmaceutical
            this.updatePharmaceutical(this.editIndex, name, manufacturer, expirationDate, quantity, isPrescription);
        } else {
            // add a new pharmaceutical
            this.addPharmaceutical(name, manufacturer, expirationDate, quantity, isPrescription);
        }

        this.saveToLocalStorage();
        this.renderPage();
        this.clearForm(form);
        this.closeModal(); 
    }

    // Add a new pharmaceutical
    addPharmaceutical(name, manufacturer, expirationDate, quantity, isPrescription) {
        const pharmaceutical = new Pharmaceutical(name, manufacturer, expirationDate, quantity, isPrescription);
        this.pharmaceuticalList.push(pharmaceutical);
        this.filteredPharmaceuticals.push(pharmaceutical);
    }

    // Update an existing pharmaceutical
    updatePharmaceutical(index, name, manufacturer, expirationDate, quantity, isPrescription) {
        const pharmaceutical = new Pharmaceutical(name, manufacturer, expirationDate, quantity, isPrescription);
        this.pharmaceuticalList[index] = pharmaceutical;
        this.filteredPharmaceuticals[index] = pharmaceutical;
    }

    // Clear the form after submit
    clearForm(form) {
        form.reset();
        this.editIndex = -1;
    }

    // Close the modal
    closeModal() {
        const modal = document.querySelector(".form-modal__all");
        modal.classList.remove("form-modal__open");
    }

    // Delete a pharmaceutical
    deletePharmaceutical(index) {
        this.pharmaceuticalList.splice(index, 1);
        this.filteredPharmaceuticals.splice(index, 1);
        this.saveToLocalStorage();
        this.renderPage();
    }

    // Open the edit modal
    openEditModal(index) {
        const pharmaceutical = this.pharmaceuticalList[index];

        const modal = document.querySelector(".form-modal__all");
        const form = modal.querySelector('.form-all');

        form.querySelector(".form__input--pharmaceutical-name").value = pharmaceutical.name;
        form.querySelector(".form__input--manufacturer-name").value = pharmaceutical.manufacturer;
        form.querySelector(".form__input--expiration-date").value = pharmaceutical.expirationDate;
        form.querySelector(".form__input--quantity-number").value = pharmaceutical.quantity;
        form.querySelector(`input[name="drug"][value="${pharmaceutical.isPrescription ? 'yes' : 'no'}"]`).checked = true;

        modal.classList.add("form-modal__open");

        this.editIndex = index;
    }
}

export default Ui;
