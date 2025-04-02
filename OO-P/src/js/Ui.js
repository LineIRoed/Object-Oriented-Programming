class Ui {
    static renderPage(id) {
        this.clearPage();
        this.createPanel(id);
        this.renderData(id);
    }

    // Open the form when the add button is clicked
    static openFormOnClick = () => {
        const addButton = document.querySelector(".button-add");
        const modal = document.querySelector(".form-modal__all");
        const closeButton = document.querySelector(".form-modal__close");

        // Open form when the add button is clicked
        addButton.addEventListener("click", () => {
            modal.classList.add("form-modal__open");  // Show the modal
        });

        // Close the modal when the close button is clicked
        closeButton.addEventListener("click", () => {
            modal.classList.remove("form-modal__open");  // Hide the modal
        });

        // Optional: Close the modal if the user clicks outside the modal
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("form-modal__open");  // Hide the modal
            }
        });
    };
}

// Initialize the modal opening and closing functionality
Ui.openFormOnClick();


export default Ui;
