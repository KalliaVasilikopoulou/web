let modal_form = document.querySelector("#accept_decline .modal-container");
let cells = document.querySelectorAll(".data_row td"); 

let cancelBtn = document.querySelector("#cancelBtn");
cancelBtn.addEventListener("click", closeConfirmForm);

function closeConfirmForm() { 
    modal_form.style.zIndex = "-1";
    modal_form.style.display = "none";
}
