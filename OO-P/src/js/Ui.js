class Ui {
    static renderPage(id) {
        this.clearPage();
        this.createPanel(id);
        this.renderData(id);
    }

    // Open form when add button is clicked
    static openFormOnClick = (form, id) => {
        const addButton = document.querySelector(".button-add");
        const closeButton = document.querySelector(".form-modal__close");

        // Open form when add button is clicked
        addButton.addEventListener("click", () => {
            Ui.openForm(form, id);
        });

        // Close the form when the close button is clicked.
        closeButton.addEventListener("click", () => {
            Ui.closeForm(form, id);
        });
    };

    // Open the form modal
    static openForm(form, id) {
        const modal = document.querySelector(`.form-modal[data-id="${id}"]`);
        if (modal) {
            modal.classList.add("form-modal__open");
        }
    }

    // Close the form modal
    static closeForm(form, id) {
        const modal = document.querySelector(`.form-modal[data-id="${id}"]`);
        if (modal) {
            modal.classList.remove("form-modal__open");
        }
    }
};

export default Ui;
