
import { addInfoText } from "./load-data";
import { updateDropdown } from "./manage-contact";
import { createModal, closeModal } from "./modal";
import { checkGroupList } from "./sidebar";
import { Toaster } from "./toaster";

const addGroupBtn = document.getElementById("add-group-btn");
const closeModalBtn = document.getElementById('close-modal-btn');
const groupForm = document.getElementById('groupForm');

const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

function addGroupInput(): void{
    addGroupBtn?.blur();
    
    let newGroup = document.createElement('div');
    newGroup.classList.add('group-list__element', 'list-element');
    
    let groupInput = document.createElement('input');
    groupInput.classList.add("list-element__name");
    groupInput.setAttribute('name', 'group_name');
    groupInput.setAttribute('type', 'text');
    groupInput.setAttribute('placeholder', 'Введите название');

    let groupDeleteBtn = document.createElement('button');
    groupDeleteBtn.setAttribute('type', 'button');
    groupDeleteBtn.classList.add('list-element__button', 'list-button');

    newGroup.append(groupInput, groupDeleteBtn);
    groupForm?.appendChild(newGroup);
    groupForm?.blur();
}

function setInputValue(e: Event): void{
    const target = e.target as HTMLElement;

    target.addEventListener('input', function(e){
        let groupName = (e.target as HTMLInputElement).value;

        target.setAttribute('value',(groupName));
    });
}

function choiceFunction(e: Event): void{
    const target = e.target as HTMLElement;

    if (target.classList.contains('list-button')) deleteGroup(e);

    if(target.classList.contains('list-element__name')) setInputValue(e);
}

function deleteGroup(e: Event): void{
    e.preventDefault();

    const element = (e.target as HTMLElement).closest('.list-element');

    if (element) {
        const groupId = element.getAttribute('id');
        if(!groupId) groupForm?.lastElementChild?.remove();
        else createModal("Вы уверены, что хотите удалить эту группу?", "Это приведет к удалению всех контактов, находящихся в этой группе.", groupId, true);
    }
}

function confirmDelete(): void{
    const groupName = modalConfirmBtn?.getAttribute('data-id');
    if(groupName){
        const deleteGroupFromSidebar = document.getElementById(groupName);
        const deleteGroupFromPage = document.getElementById(`${groupName}-group`);
        deleteGroupFromSidebar?.remove();
        deleteGroupFromPage?.remove();
        localStorage.removeItem(groupName);
        updateDropdown();
        addInfoText();
        closeModal();
        Toaster.show("Группа успешно удалена");
    }
}

export function initManageGroup(): void{
    addGroupBtn?.addEventListener('click', ()=>{
        addGroupInput();
        checkGroupList('groupForm');
    });
    groupForm?.addEventListener('click', choiceFunction);
    closeModalBtn?.addEventListener('click', closeModal);
    modalCancelBtn?.addEventListener('click', closeModal);
    modalConfirmBtn?.addEventListener('click', confirmDelete);
}
