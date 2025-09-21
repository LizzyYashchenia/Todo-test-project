import {  createModal } from "./modal";
import { Toaster } from "./toaster";
import { checkGroupList, closeSidebar } from "./sidebar";
import { loadData } from "./load-data";
import { updateDropdown } from "./manage-contact";

const saveGroupBtn = document.getElementById("save-group-btn");
const groupForm = document.getElementById('groupForm');
const groupList= document.getElementById('groupList');

export function getGroupStorageList(): string[]{
    let storageList: string[] = [];
    let length = localStorage.length;

    if(length > 0){
        for(let i = 0; i< length; i++){
            let key = localStorage.key(i);
            if(key) {
                storageList.push(key);
            }
        }
    }
    return storageList;
}

export function getStorageList():object[]{
    const storageGroupList = getGroupStorageList();
    const storageList:object[] = [];
    storageGroupList.forEach(item=>{
        const storageItem = localStorage.getItem(item)
        if(storageItem){
            storageList.push(JSON.parse(storageItem));
        }
    });
    return storageList;
}

function checkLocalStorage(): void{
    if(groupForm){
        if(localStorage.length > 0){
            for(let i = 0; i < localStorage.length; i++){
                let key = localStorage.key(i);
                
                if(key){
                    groupForm.innerHTML += `
                        <div id="${key}" class="group-list__element list-element">
                            <input type="text" value="${key}" name="group_name" class="list-element__name" />
                            <button class="list-element__button list-button" type="button"></button>
                        </div>
                    `;
                }
            }
        }
        else{
            checkGroupList('groupForm');
        }
    }
}

function saveGroupToLocalStorage(): void{
    saveGroupBtn?.blur();

    let existingGroups = getGroupStorageList();
    let groupCount = 0;
    let groupEditCount = 0;

    const seenGroups: Set<string> = new Set();
    const duplicateGroups: Set<string> = new Set(); 

    groupForm?.querySelectorAll('input').forEach((input) => {
        
        if(!input.value) {
            input.closest('div')?.remove();
            return;
        };

        if (seenGroups.has(input.value.toLowerCase())) {
            duplicateGroups.add(input.value);
            input.closest('div')?.remove();
            return;
        }
        seenGroups.add(input.value.toLowerCase());

        if (!existingGroups.includes(input.value.toLowerCase()) &&!existingGroups.includes(input.value)) {
            let groupContainer = input.closest('div');
            if(groupContainer){
                if(groupContainer.id != '' && input.value != groupContainer.id ){
                    editGroup(groupContainer.id, input.value);
                    groupEditCount++;
                    groupContainer.setAttribute('id', input.value);
                }
                if(groupContainer.id === ''){
                    groupContainer.setAttribute('id', input.value);
                    groupCount++;
                    saveToLocalStorage(input.value, null, null, groupList);
                }
            }
        }
    });

    if(duplicateGroups.size > 0){
        const duplicate = Array.from(duplicateGroups);
        if(duplicateGroups.size === 1) createModal(`Ошибка создания группы "${duplicate[0]}"!`, "Группа с таким названием уже существует.", null, false);
        else if(duplicateGroups.size > 1) createModal("Ошибка создания групп!", `Группы с такими названиями уже существуют: "${duplicate.join(', ')}".`, null, false);
    }
    if(groupCount === 1) Toaster.show(`Группа успешно создана`);
    else if(groupCount > 1) Toaster.show(`Группы успешно созданы`);

    if(groupEditCount === 1) Toaster.show(`Группа успешно изменена`);
    else if(groupEditCount > 1) Toaster.show(`Группы успешно изменены`);

}

function editGroup(oldName:string, newName: string): void{
    const data = getStorageList();
    data.forEach(group=>{
        if(Array.isArray(group)){
            group.forEach(item=>{
                if(item.groupName === oldName){
                    localStorage.removeItem(oldName);
                    saveToLocalStorage(newName, item.contactName, item.number, groupList)
                }
            });
        }
    });
    document.getElementById(`${oldName}-group`)?.remove();
}

export function saveToLocalStorage(groupName: string, contactName: string | null, number:string | null, sidebar: HTMLElement | null): void{
    const key = groupName;
    const dataItem={
        groupName:groupName,
        contactName:contactName,
        number:number
    };
    let storageString = localStorage.getItem(key);
    let existingData: any[] = [];

    if(storageString){
        try {
            existingData = JSON.parse(storageString);
            
            const filteredData = existingData.filter(item => 
                !(item?.contactName === null && item?.number === null)
            );
            
            if (filteredData.length !== existingData.length) {
                existingData = filteredData;
                localStorage.setItem(key, JSON.stringify(existingData));
            }

            if (!Array.isArray(existingData)) {
                existingData = [existingData];
            }
        } catch (error) {
            console.error('Ошибка парсинга данных:', error);
            existingData = [];
        }
    }

    const editButton = document.querySelector('.contact-info-btn__edit.active');
    const isEditing = editButton !== null;

    const duplicate = existingData.find(item => 
        item.number === number && number !== null && 
        (!isEditing || item.number !== editButton?.getAttribute('contact-number'))
    );

    if (duplicate) {
        createModal(`Ошибка сохранения контакта "${contactName}"!`, "Контакт с таким номером уже существует.", null, false); 
    }
    else{
        if (isEditing) {
            existingData.push(dataItem);
        }
        else{

            const existingContact = existingData.find(item => 
                item.contactName === contactName && item.number === number
            );
            
            if (!existingContact) {
                existingData.push(dataItem);
            }

        }

        const jsonString = JSON.stringify(existingData);
        localStorage.setItem(key, jsonString);
        
        if(isEditing){
            if(groupName && contactName && number) {
                Toaster.show('Контакт успешно создан');
            }
        }
        
        loadData();
    }

    updateDropdown();
    closeSidebar(sidebar);
    const activeEditButtons = document.querySelectorAll('.contact-info-btn__edit.active');
    activeEditButtons.forEach(btn => btn.classList.remove('active'));
}

export function initStorage(): void{
    saveGroupBtn?.addEventListener('click', saveGroupToLocalStorage);
    window.addEventListener('load', checkLocalStorage);
}