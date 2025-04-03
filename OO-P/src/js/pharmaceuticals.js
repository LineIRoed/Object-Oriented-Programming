class Pharmaceutical {
    constructor(name, manufacturer, expirationDate, quantity, isPrescription) {
        this.name = name;
        this.manufacturer = manufacturer;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.isPrescription = isPrescription;
    }

    // Render the pharmaceutical item in HTML
    render() {
        const pharmaceuticalItem = document.createElement("div");
        pharmaceuticalItem.classList.add("pharmaceutical-item");

        pharmaceuticalItem.innerHTML = `
            <h4>${this.name}</h4>
            <p><strong>Manufacturer:</strong> ${this.manufacturer}</p>
            <p><strong>Expiration Date:</strong> ${this.expirationDate}</p>
            <p><strong>Quantity:</strong> ${this.quantity}</p>
            <p><strong>Prescription Required:</strong> ${this.isPrescription ? 'Yes' : 'No'}</p>
        `;

        return pharmaceuticalItem;
    }
}

export default Pharmaceutical;
