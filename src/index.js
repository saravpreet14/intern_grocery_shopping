const groceryListData = {};
const domElements = {
    groceryList: document.querySelector('#groceryList'),
    submitFormButton: document.querySelector('form button'),
    form: document.querySelector('form'),
    formNameInput: document.querySelector('#nameInput'),
    formQuantityInput: document.querySelector('#quantityInput'),
    formTitle: document.querySelector('#formTitle'),
};

function resetForm () {
    domElements.form.setAttribute('onsubmit', "submitForm(event)");
    domElements.formNameInput.value = '';
    domElements.formQuantityInput.value = '';
    domElements.submitFormButton.innerText = 'Add';
    domElements.formTitle.innerText = 'Add Item'
}

function checkErrors (event) {
    let error = false;
    if (event.target[0].value.length === 0) {
        document.querySelector('#nameError').innerText = 'Enter item name';
        error = true;
    }
    else {
        document.querySelector('#nameError').innerText = '';
    }

    if (event.target[1].value <= 0) {
        document.querySelector('#quantityError').innerText = 'Enter quantity more than 0';
        error = true;
    }
    else {
        document.querySelector('#quantityError').innerText = '';
    }
    return error;
}

function deleteItem (name) {
    groceryListData[name].element.remove();
    delete groceryListData[name];
    resetForm();
}

function getListItemHtml (name, quantity) {
    return `
    <p class='listItemName'>${name}</p>
    &emsp;x<p class='listItemQuantity'>${quantity}</p>
    <br>
    <button class='editButton' onclick="renderEditItemForm('${name}')" >Edit</button>
    <button class='deleteButton' onclick="deleteItem('${name}')" >Delete</button>
`
}

async function editItem (event, prevName) {
    event.preventDefault();
    if(checkErrors(event)) {
        return;
    }
    const newName = event.target[0].value;
    const newQuantity = event.target[1].value;
    if(newName !== prevName) {
        groceryListData[newName] = {...groceryListData[prevName]};
        delete groceryListData[prevName];
    }
    groceryListData[newName].quantity = Number(newQuantity);
    groceryListData[newName].element.innerHTML = getListItemHtml(newName, newQuantity);
    await resetForm();
}

function renderEditItemForm (name) {
    domElements.formTitle.innerText = 'Edit Item';
    domElements.submitFormButton.innerText = 'Edit';
    domElements.formNameInput.value = name;
    domElements.formQuantityInput.value = groceryListData[name].quantity;
    domElements.form.setAttribute('onsubmit', `editItem(event, '${name}')`);
}

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

function addItemToList (name, quantity) {
    quantity = Number(quantity);
    if (groceryListData.hasOwnProperty(name)) {
        groceryListData[name].quantity += quantity;
        groceryListData[name].element.querySelector('.listItemQuantity').innerText = groceryListData[name].quantity;
    }
    else {
        domElements.groceryList.append(createListItem(name, quantity));
    }
}

async function submitForm (event) {
    event.preventDefault();
    if(checkErrors(event)) {
        return;
    }
    addItemToList(event.target[0].value, event.target[1].value);
    await resetForm();
}

window.onload = () => {
    const loadedData = JSON.parse(localStorage.getItem('listItems'));
    for (let name in loadedData) {
        domElements.groceryList.append(createListItem(name, loadedData[name]));
    }
}

window.onbeforeunload = () => {
    const storeData = {};
    const orderedItemData = document.querySelectorAll('.listItemName');
    orderedItemData.forEach(item => {
        storeData[item.innerText] = Number(groceryListData[item.innerText].quantity);
    })
    // for (let name in groceryListData) {
    //     storeData[name] = Number(groceryListData[name].quantity);
    // }
    localStorage.setItem('listItems', JSON.stringify(storeData));
}