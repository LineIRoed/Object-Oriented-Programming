import { Pharmaceutical, PrescriptionMedicine, OTCMedicine } from './pharmaceuticals.js';

class Ui {
    constructor() {
        this.pharmaceuticalList = this.loadFromLocalStorage();
        this.pharmaceuticalListContainer = document.getElementById('pharmaceutical-list');
        this.welcomeMessage = document.querySelector('.welcome-message');
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.searchInput = document.getElementById('search-form');
        this.filteredPharmaceuticals = [...this.pharmaceuticalList];
        this.editIndex = -1;
        this.formButton = document.querySelector(".form__button");

        // render the page and attach event listeners
        this.renderPage();
        this.attachFilterEventListeners();
        this.attachSearchEventListener();

        // Initialize delete confirmation modal
        this.deleteModal = document.querySelector(".delete-modal");
        this.deleteConfirmBtn = document.querySelector(".delete-confirm-btn");
        this.deleteCancelBtn = document.querySelector(".delete-cancel-btn");

        // Attach delete confirmation button actions
        this.deleteConfirmBtn.addEventListener("click", this.confirmDelete.bind(this));
        this.deleteCancelBtn.addEventListener("click", this.closeDeleteModal.bind(this));

        const addButton = document.querySelector(".button-add");
        const modal = document.querySelector(".form-modal__all");

        addButton.addEventListener("click", () => {
            const form = modal.querySelector('form') || modal.querySelector('.form-all');
                if (form) form.reset();

            this.editIndex = -1;
            modal.classList.add("form-modal__open");

            this.formButton.textContent = "Add pharmaceutical";
        });

    }

    // Load pharmaceuticals from localStorage
    loadFromLocalStorage() {
        const pharmaceuticals = localStorage.getItem('pharmaceuticals');
        if (pharmaceuticals) {
            return JSON.parse(pharmaceuticals).map((data) => {
                if (data.isPrescription) {
                    return new PrescriptionMedicine(
                        data.name,
                        data.manufacturer,
                        data.expirationDate,
                        data.quantity,
                        data.id
                    );
                } else {
                    return new OTCMedicine(
                        data.name,
                        data.manufacturer,
                        data.expirationDate,
                        data.quantity,
                        data.id
                    );
                }
            });
        }
        return [];
    }    
    

    // Save pharmaceuticals to localStorage
    saveToLocalStorage() {
        const pharmaceuticalData = this.pharmaceuticalList.map(pharmaceutical => ({
            id: pharmaceutical.id,
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

        // Add pharmaceutical to the page
        this.filteredPharmaceuticals.forEach((pharmaceutical) => {
            this.pharmaceuticalListContainer.appendChild(
                pharmaceutical.render(
                    () => this.openDeleteModal(pharmaceutical.id), // pass id, not index
                    () => this.openEditModal(pharmaceutical.id)
                )
            );
        });

        // Show/hide welcome message depending on whether pharmaceuticals are present
        if (this.filteredPharmaceuticals.length > 0) {
            this.hideWelcomeMessage();
        } else {
            this.showWelcomeMessage();
        }
    }

    // Clear the page of all pharmaceutical items
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

    // Attach event listeners to filter buttons
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
            this.filteredPharmaceuticals = this.pharmaceuticalList.filter(pharmaceutical => pharmaceutical instanceof PrescriptionMedicine);
        } else if (type === 'overTheCounter') {
            this.filteredPharmaceuticals = this.pharmaceuticalList.filter(pharmaceutical => pharmaceutical instanceof OTCMedicine);
        }
    
        this.renderPage();
    }    
    

    // Attach search event listener to the search input
    attachSearchEventListener() {
        this.searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.searchPharmaceuticals(query);
        });
    }

    // Search for pharmaceutical by name through search input
    searchPharmaceuticals(query) {
        if (query.trim() === '') {
            // If search is empty, show all
            this.filteredPharmaceuticals = [...this.pharmaceuticalList];
        } else {
            // Filter by name
            this.filteredPharmaceuticals = this.pharmaceuticalList.filter(pharmaceutical =>
                pharmaceutical.name.toLowerCase().includes(query)
            );
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
            const form = modal.querySelector('form') || modal.querySelector('.form-all');
                if (form) form.reset();
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

    // Add/edit function
    handleFormSubmit(form) {
        const name = form.querySelector(".form__input--pharmaceutical-name").value;
        const manufacturer = form.querySelector(".form__input--manufacturer-name").value;
        const expirationDate = form.querySelector(".form__input--expiration-date").value;
        const quantity = form.querySelector(".form__input--quantity-number").value;
        const isPrescription = form.querySelector("input[name='drug']:checked").value === "yes";

        if (this.editIndex !== -1) {
            // If editing, update pharmaceutical
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
        const pharmaceutical = isPrescription
            ? new PrescriptionMedicine(name, manufacturer, expirationDate, quantity)
            : new OTCMedicine(name, manufacturer, expirationDate, quantity);
    
        this.pharmaceuticalList.push(pharmaceutical);
        this.filteredPharmaceuticals.push(pharmaceutical);
        this.saveToLocalStorage();
    }
    

    // Update an existing pharmaceutical
    updatePharmaceutical(index, name, manufacturer, expirationDate, quantity, isPrescription) {
        const existingId = this.pharmaceuticalList[index].id;
        const pharmaceutical = isPrescription
            ? new PrescriptionMedicine(name, manufacturer, expirationDate, quantity, existingId)
            : new OTCMedicine(name, manufacturer, expirationDate, quantity, existingId);
    
        this.pharmaceuticalList[index] = pharmaceutical;
        this.filteredPharmaceuticals[index] = pharmaceutical;
        this.saveToLocalStorage();
    }
    

    // Clear the form after submit
    clearForm(form) {
        form.reset();
        this.editIndex = -1;
    }

    // Close the modal
    closeModal() {
        const modal = document.querySelector(".form-modal__all");
        const form = modal.querySelector('form') || modal.querySelector('.form-all');
        modal.classList.remove("form-modal__open");
        if (form) {
            this.clearForm(form);
        }
    }

    // Delete a pharmaceutical
    openDeleteModal(id) {
        this.deleteModal.style.display = "flex";
        this.deleteId = id;
    }

    // Confirm the deletion
    confirmDelete() {
        this.deletePharmaceutical(this.deleteId);
        this.closeDeleteModal();
    }

    // Close the delete modal without deleting
    closeDeleteModal() {
        this.deleteModal.style.display = "none";
    }

    // delete pharmaceutical
    deletePharmaceutical(id) {
        // Find the index of the pharmaceutical with this id in the original list
        const index = this.pharmaceuticalList.findIndex(pharma => pharma.id === id);
        if (index === -1) return;
    
        // Remove from the original pharmaceutical list
        this.pharmaceuticalList.splice(index, 1);
    
        // Remove from the filtered list by filtering out the item with this id
        this.filteredPharmaceuticals = this.filteredPharmaceuticals.filter(pharma => pharma.id !== id);
    
        this.saveToLocalStorage();
        this.renderPage();
    }

    // Open the edit modal
    openEditModal(id) {
        // Find the index in the original pharmaceuticalList by id
        const index = this.pharmaceuticalList.findIndex(pharma => pharma.id === id);
        if (index === -1) return;
    
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
