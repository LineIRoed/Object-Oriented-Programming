class Pharmaceutical {
    constructor(name, manufacturer, expirationDate, quantity, isPrescription) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.isPrescription = isPrescription;
    }

    // Render the pharmaceutical item in HTML
    render(deleteCallback, editCallback) {
        const pharmaceuticalItem = document.createElement("div");
        pharmaceuticalItem.classList.add("pharmaceutical-item");

        // HTML content with wrapped buttons
        pharmaceuticalItem.innerHTML = `
            <div class="info-container">
                <h4>${this.name}</h4>
                <p><strong>Manufacturer:</strong> ${this.manufacturer}</p>
                <p><strong>Expiration Date:</strong> ${this.expirationDate}</p>
                <p><strong>Quantity:</strong> ${this.quantity}</p>
                <p><strong>Prescription Required:</strong> ${this.isPrescription ? 'Yes' : 'No'}</p>
            </div>

            <div class="button-container">
                <button class="delete-btn">Delete</button>
                <button class="edit-btn">Edit</button>
            </div>
        `;

        // Add event listeners to buttons
        pharmaceuticalItem.querySelector('.delete-btn').addEventListener('click', deleteCallback);
        pharmaceuticalItem.querySelector('.edit-btn').addEventListener('click', editCallback);

        return pharmaceuticalItem;
    }
}

export default Pharmaceutical;
