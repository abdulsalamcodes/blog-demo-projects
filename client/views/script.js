const customersTable = document.getElementById("customers_table");
customersTable.addEventListener("click", (event) => {
  if (event.target.classList.contains("btn-edit")) {
    const editButton = event.target;
    const id = editButton.getAttribute("data-id");
    const name = editButton.getAttribute("data-name");
    const age = editButton.getAttribute("data-age");
    const address = editButton.getAttribute("data-address");
    const editCustomerModal = document.getElementById("editCustomerModal");
    editCustomerModal.style.display = "block";
    var customerIdInput = document.querySelector(".customer_id");
    var nameInput = document.querySelector(".name");
    var ageInput = document.querySelector(".age");
    var addressInput = document.querySelector(".address");
    customerIdInput.value = id;
    nameInput.value = name;
    ageInput.value = age;
    addressInput.value = address;
  }
});
