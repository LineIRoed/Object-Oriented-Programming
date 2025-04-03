import Ui from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new Ui();

    // Open and close modal
    Ui.openFormOnClick();

    // Handle form submission
    const form = document.querySelector('.form-all');
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        ui.handleFormSubmit(form);
    });
});
