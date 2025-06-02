import { v4 as uuidv4 } from 'uuid';

class Pharmaceutical {
    constructor(name, manufacturer, expirationDate, quantity, isPrescription, id = null) {
        this.id = id || uuidv4();
        this.name = name;
        this.manufacturer = manufacturer;
        this.expirationDate = expirationDate;
        this.quantity = quantity;
        this.isPrescription = isPrescription;
    }

    render(deleteCallback, editCallback) {
        const pharmaceuticalItem = document.createElement("div");
        pharmaceuticalItem.classList.add("pharmaceutical-item");

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

        pharmaceuticalItem.querySelector('.delete-btn').addEventListener('click', deleteCallback);
        pharmaceuticalItem.querySelector('.edit-btn').addEventListener('click', editCallback);

        return pharmaceuticalItem;
    }
}

// Prescription subclass
class PrescriptionMedicine extends Pharmaceutical {
    constructor(name, manufacturer, expirationDate, quantity, id = null) {
        super(name, manufacturer, expirationDate, quantity, true, id);
    }
}

// Over-the-counter subclass
class OTCMedicine extends Pharmaceutical {
    constructor(name, manufacturer, expirationDate, quantity, id = null) {
        super(name, manufacturer, expirationDate, quantity, false, id);
    }
}

export { Pharmaceutical, PrescriptionMedicine, OTCMedicine };
