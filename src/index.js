// To store all items data
const groceryListData = {};

// To store all ussually accessed dom elements
const domElements = {
    groceryList: document.querySelector('#groceryList'),
    submitFormButton: document.querySelector('#submitButton'),
    formNameInput: document.querySelector('#nameInput'),
    formQuantityInput: document.querySelector('#quantityInput'),
    formTitle: document.querySelector('#formTitle'),
};

// Reset form to add functionality
function resetForm () {
    domElements.formNameInput.value = '';
    domElements.formQuantityInput.value = '';
    domElements.submitFormButton.innerText = 'Add';
    domElements.submitFormButton.setAttribute('onclick', 'addItem()');
    domElements.formTitle.innerText = 'Add Item'
}

// Check and display errors with given input
function checkErrors () {
    const inputName = domElements.formNameInput.value;
    const inputQuantity = domElements.formQuantityInput.value;
    let error = false;
    if (inputName.length === 0) {
        document.querySelector('#nameError').innerText = 'Enter item name';
        error = true;
    }
    else {
        document.querySelector('#nameError').innerText = '';
    }

    if (inputQuantity <= 0) {
        document.querySelector('#quantityError').innerText = 'Enter quantity more than 0';
        error = true;
    }
    else {
        document.querySelector('#quantityError').innerText = '';
    }
    return error;
}

// Returns HTML for displaying list item
function getListItemHtml (name, quantity) {
    return `
        <div>
            <p class='listItemName'>${name}</p>
            <p class='listItemQuantity'>x${quantity}</p>
        </div>
        <br>
        <button class='editButton' onclick="renderEditItemForm('${name}')" >Edit</button>
        <button class='deleteButton' onclick="deleteItem('${name}')" >Delete</button>
    `;
}

// Change form to edit functionality
function renderEditItemForm (name) {
    domElements.formTitle.innerText = 'Edit Item';
    domElements.submitFormButton.innerText = 'Edit';
    domElements.submitFormButton.setAttribute('onclick', `editItem('${name}')`);
    domElements.formNameInput.value = name;
    domElements.formQuantityInput.value = groceryListData[name].quantity;
}

// Create and returns list item to be diplayed and stored
function createListItem (name, quantity) {
    let listElement = document.createElement('div');
    listElement.classList.add('listElement');
    listElement.innerHTML = getListItemHtml(name, quantity);
    groceryListData[name] = {
        quantity: quantity,
        element: listElement
    };
    return listElement;
}

// Edit item functionality
function editItem (prevName) {
    if(checkErrors()) {
        return;
    }
    const newName = domElements.formNameInput.value;
    const newQuantity = Number(domElements.formQuantityInput.value);
    if(newName !== prevName) {
        groceryListData[newName] = {...groceryListData[prevName]};
        delete groceryListData[prevName];
    }
    groceryListData[newName].quantity = Number(newQuantity);
    groceryListData[newName].element.innerHTML = getListItemHtml(newName, newQuantity);
    resetForm();
}

// Add item functionality
function addItem () {
    if(checkErrors()) {
        return;
    }
    const name = domElements.formNameInput.value;
    const quantity = Number(domElements.formQuantityInput.value);
    if (groceryListData.hasOwnProperty(name)) {
        groceryListData[name].quantity += quantity;
        groceryListData[name].element.querySelector('.listItemQuantity').innerText = 'x' + groceryListData[name].quantity;
    }
    else {
        domElements.groceryList.append(createListItem(name, quantity));
    }
    resetForm();
}

// Delete item functionality
function deleteItem (name) {
    groceryListData[name].element.remove();
    delete groceryListData[name];
    resetForm();
}

// Initail loading of data from local storage
window.onload = () => {
    const loadedData = JSON.parse(localStorage.getItem('listItems'));
    for (let name in loadedData) {
        domElements.groceryList.append(createListItem(name, loadedData[name]));
    }
}

// Updating data in local storage on exit
window.onbeforeunload = () => {
    const storeData = {};
    const orderedItemData = document.querySelectorAll('.listItemName');
    orderedItemData.forEach(item => {
        storeData[item.innerText] = Number(groceryListData[item.innerText].quantity);
    });
    localStorage.setItem('listItems', JSON.stringify(storeData));
}