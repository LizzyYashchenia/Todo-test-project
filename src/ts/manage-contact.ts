import { Dropdown, style } from "./dropdown";
import { getGroupStorageList, saveToLocalStorage } from "./local-storage";
import { createModal, closeModal} from "./modal";
import { closeSidebar, showSidebar } from "./sidebar";
import { Toaster } from "./toaster";
import { addInfoText } from "./load-data";
import IMask from 'imask';

const contactForm = document.getElementById('contactForm');
const main = document.getElementsByTagName('main')[0];
const saveContactBtn = document.getElementById('save-contact-btn');
const addContactList = document.getElementById('addContactList');
const activeDropdowns: Dropdown[] = [];

export function addDropdown(container:HTMLElement | null, dropdownName: string): void{
    if(container) {
        const documentStyle = document.head.querySelector('style') as HTMLElement;
        
        if(documentStyle) documentStyle.textContent += style;
        else{
            const styleElement = document.createElement('style');
            styleElement.className = 'dropdown-styles';
            styleElement.textContent = style;
            document.head.appendChild(styleElement);
        }

        const dropdown = new Dropdown(container, dropdownName);
        activeDropdowns.push(dropdown);

        updateDropdown();
    }
}

export function updateDropdown(): void{
    activeDropdowns.forEach(dropdoown=>{
        dropdoown.dataItem = getGroupStorageList();
    });
}

function warning(componet:HTMLElement): void{
    saveContactBtn?.blur();
    const warning = document.createElement('span');

    warning.classList.add('warning');
    warning.textContent = 'Поле является обязательным';
    warning.style.color = 'red';
    componet.style.border = '1px solid red';
    componet.style.marginBottom = '2px';
    if(contactForm){
        contactForm.style.gridTemplateRows = 'repeat(auto-fill, 42px)';
        
        if(componet.closest('div')?.querySelector('.warning') === null){
            componet.insertAdjacentElement('afterend' , warning);
        }
    } 
}
    
function checkInput(): void{
    let groupValue = '';
    let numberValue = '';
    let nameValue = '';
    let isEditMode = false;
    let originalGroup = '';
    let originalName = '';
    let originalNumber = '';

    const editButton = main.querySelector('.contact-info-btn__edit.active');
    if (editButton) {
        isEditMode = true;
        originalGroup = editButton.getAttribute('group-name') || '';
        originalName = editButton.getAttribute('contact-name') || '';
        originalNumber = editButton.getAttribute('contact-number') || '';
    }
    
    contactForm?.querySelectorAll('.contact-list__element').forEach(element=>{
        if((element as HTMLElement).classList.contains('dropdown-container')){
            const spanElement = element.querySelector('span');

            if((spanElement?.textContent) === 'Выберите группу'){
                (spanElement as HTMLElement).style.color = 'red';
                (element as HTMLElement).style.border = '1px solid red';
            }
            else{
                let content = spanElement?.textContent;
                if(content && content !== 'Выберите группу' && spanElement) {
                    groupValue = content;
                }
                if(spanElement && groupValue === null){
                    spanElement.textContent = 'Выберите группу';
                    (element as HTMLElement).style.color = 'black';
                }
            }
        }
        else{
           if((element as HTMLInputElement).value){
                if(element.getAttribute('name') === 'contact_number'){
                    let quantity = element.getAttribute('quantity');
                    if(quantity && quantity != '11'){
                        warning(element as HTMLElement);
                    }
                    else numberValue = (element as HTMLInputElement).value;
                }
                else{
                    nameValue = (element as HTMLInputElement).value;
                }
            }
            else{
                warning(element as HTMLElement);
            } 
        }
    });
    
    if(groupValue && numberValue && nameValue){
        if(isEditMode){
            editContactSaveToLocalStorage(originalGroup, originalName, originalNumber, groupValue, nameValue, numberValue);
            closeSidebar(addContactList);
            Toaster.show('Контакт успешно изменен');
            resetInput();
        }
        else{
            saveToLocalStorage(groupValue, nameValue, numberValue, addContactList);
            resetInput();
        }
    }
}

export function editContactSaveToLocalStorage(oldGroup: string, oldName: string, oldNumber: string, newGroup: string, newName: string, newNumber: string): void {
    removeContactFromLocalStorage(oldGroup, oldName, oldNumber);

    saveToLocalStorage(newGroup, newName, newNumber, addContactList);
}

function removeContactFromLocalStorage(groupName: string, contactName: string, number: string): void {
    const storageString = localStorage.getItem(groupName);
    if (storageString) {
        try {
            let existingData = JSON.parse(storageString);
            
            const updatedData = existingData.filter((item: any) => 
                !(item.contactName === contactName && item.number === number && item.groupName === groupName)
            );
            if (updatedData.length === 0) {
                localStorage.setItem(groupName, '');
                document.getElementById(`${groupName}-group`)?.remove();
            } else {
                localStorage.setItem(groupName, JSON.stringify(updatedData));
                document.querySelectorAll('.contact-info__number').forEach(item=>{
                    if((item as HTMLInputElement).value === number){
                        item.closest('.contact-item')?.remove();
                    }
                });
            }
        } catch (error) {
            console.error('Ошибка при удалении контакта:', error);
        }
    }
}

function deleteContact(deleteBtn: HTMLElement): void{

    createModal("Вы уверены, что хотите удалить этот контакт?", "Это приведет к удалению всех контактов, находящихся в этой группе.", null, true);
    let index = deleteBtn.closest('.container__group')?.id.indexOf('-');
    const groupName = deleteBtn.closest('.container__group')?.id.substring(0, index);
    const number = (deleteBtn.closest('.contact-item__info')?.querySelector('.contact-info__number') as HTMLInputElement)?.value;
    if(groupName && number){
        deleteBtn.setAttribute('group-name', groupName);
        deleteBtn.setAttribute('contact-number', number);
    }
}

export function checkAttribute(): void{
    main.querySelectorAll('.contact-info-btn__delete').forEach((button)=>{
        const groupName = button.getAttribute('group-name');
        const contactNumber = button.getAttribute('contact-number');
        if(groupName && contactNumber){
            confirmContactDelete(groupName, contactNumber);
            button.setAttribute('group-name', '');
            button.setAttribute('contact-number', '');
        }
    });
}

function confirmContactDelete(groupName: string, contactNumber: string): void{
    if(groupName && contactNumber){
        const deleteContact = document.getElementById(`${groupName}-group`)?.querySelector(`[value="${contactNumber}"]`)?.closest('.contact-item');
        deleteContact?.remove();
        let storageContact: string[] = [];
        for(let i = 0; i < localStorage.length; i++){
            let key = localStorage.key(i);
            if(key){
                if(key.match(groupName)){
                    let item = localStorage.getItem(key);
                    if(item)storageContact.push(JSON.parse(item));
                }
            }
        }

        storageContact.forEach(contacts=>{
            if(Array.isArray(contacts)){
                contacts.forEach((item, index)=>{
                    if (item?.groupName && item?.contactName && item?.number !== null) {
                        if(item?.number === contactNumber){
                            contacts.splice(index, 1);
                        }
                    }
                })
                for(let i = 0; i < localStorage.length; i++){
                    let key = localStorage.key(i);
                    if(key){
                        if(key.match(groupName)){
                            if(contacts.length === 0){
                                localStorage.setItem(key, '');
                                main.querySelector(`[id="${groupName}-group"]`)?.remove();
                                addInfoText();
                            }
                            else{
                                localStorage.setItem(key, JSON.stringify(contacts));
                            }
                        }
                    }
                }
            }
        });
        closeModal();
        Toaster.show("Контакт успешно удален");
    }
}

function editContact(editBtn: HTMLElement): void{
    let index = editBtn.closest('.container__group')?.id.indexOf('-');
    const groupName = editBtn.closest('.container__group')?.id.substring(0, index);

    const contactName = (editBtn.closest('.contact-item')?.querySelector('.contact-item__name') as HTMLInputElement).value;
    const number = (editBtn.closest('.contact-item__info')?.querySelector('.contact-info__number') as HTMLInputElement)?.value;
   
    editBtn.classList.add('active');
    if(groupName && contactName && number){
        editBtn.setAttribute('group-name', groupName);
        editBtn.setAttribute('contact-name', contactName);
        editBtn.setAttribute('contact-number', number);
    }
    showSidebar(addContactList);
}

function resetWarning(event: Event): void{
    saveContactBtn?.blur();
    const target = event.target as HTMLElement;
    if(!(target instanceof HTMLButtonElement) && !(target instanceof HTMLSpanElement)){
        target.closest('div')?.querySelector('span')?.remove();
        target.style.border = 'none';
    }
    else{
        target.style.color = 'black';
        let border = target.closest('div');
        if(border) {
            border.style.border = 'none';
        }
    }

    if(target.getAttribute('name') === 'contact_number'){
        const phoneMask = IMask(target, {
            mask: '+{7} (000) 000-00-00',
            lazy: false,
            placeholderChar: '_',
            overwrite: true,
            autofix: true
        });
        let originalValue = '';
        target.addEventListener('input', () => {
            originalValue = (target as HTMLInputElement).value;
        });
        
        target.addEventListener('blur', () => {
            const unmaskedValue = phoneMask.unmaskedValue;
            target.setAttribute('quantity', unmaskedValue.length.toString());
            if (unmaskedValue.length === 1  || unmaskedValue === '') {
                originalValue = (target as HTMLInputElement).value;
                
                phoneMask.destroy();
                
                if (originalValue.includes('_') || originalValue === '+7 (___) ___-__-__') {
                    (target as HTMLInputElement).value = '';
                } else {
                    (target as HTMLInputElement).value = originalValue;
                }
            }
        });
        target.addEventListener('focus', () => {
            if (phoneMask === null) {
                const newMask = IMask(target, {
                    mask: '+{7} (000) 000-00-00',
                    lazy: true,
                    placeholderChar: '_',
                    overwrite: true,
                    autofix: true
                });
            
                if ((target as HTMLInputElement).value && !(target as HTMLInputElement).value.includes('_')) {
                    newMask.value = (target as HTMLInputElement).value;
                }
            }
        });

    }
}

function resetInput(): void{
    contactForm?.querySelectorAll('.contact-list__element').forEach(element=>{
        if((element as HTMLInputElement).value){
            if(element.getAttribute('name') === 'contact_number'){
                const numberInput = (element as HTMLInputElement);
                if(numberInput){
                    numberInput.value = '';
                    numberInput.setAttribute('value', '');
                }
            }
            else{
                const nameInput = (element as HTMLInputElement);
                if(nameInput){
                    nameInput.value = '';
                    nameInput.setAttribute('value', '');
                }
                
            }
        }
    });
}


export function initManageContact(): void {
    saveContactBtn?.addEventListener('click', function(){
        checkInput();
    });
    
    contactForm?.addEventListener('click', function(event:Event){
        resetWarning(event);
    });

    main?.addEventListener('click', function(event:Event){
        const target = event.target as HTMLElement;
        if(target.classList.contains('contact-info-btn__delete')){
            deleteContact(target);  
        }
        if(target.classList.contains('contact-info-btn__edit')){
            editContact(target);  
        }
    });

    
}