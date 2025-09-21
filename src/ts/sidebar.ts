import { resizeWindow } from "./layout";
import { addDropdown } from "./manage-contact";

const overlay = document.getElementById('overlay');
const groupList = document.getElementById('groupList');
const showGroupsBtn = document.getElementById("show-groups");
const closeGroupsBtn = document.getElementById("close-groups");
const addGroupBtn = document.getElementById("add-group-btn");

const contactList = document.getElementById('addContactList');
const showAddContactBtn = document.getElementById("show-add-contact-btn");
const closeAddContactBtn = document.getElementById("close-add-contact");

const container = document.getElementById('contactForm');

function setTransition(): void {
    if (groupList && overlay && contactList) {
        if(innerWidth > 450) {
            groupList.style.transition = 'left 0.3s ease';
            contactList.style.transition = 'left 0.3s ease';
        }
        else {
            groupList.style.transition = 'right 0.3s ease';
            contactList.style.transition = 'right 0.3s ease';
        }
    }
}

export function showSidebar(element: HTMLElement | null): void{
    if(element && overlay){
        setTransition();

        const dropdown = document.getElementById('dropdown');

        if(element === groupList) checkGroupList('groupForm');
        if(element === contactList){
            if(!dropdown) addDropdown(container, "dropdown");

            let groupName = '';
            let contactName = '';
            let contactNumber = '';
            document.querySelectorAll('.contact-info-btn__edit').forEach(button=>{
                for(let i = 0; i < button.attributes.length; i++){
                    if(button.attributes[i].name === 'group-name' && button.attributes[i].value != null){
                        groupName = button.attributes[i].value;
                    }
                    else if(button.attributes[i].name === 'contact-name' && button.attributes[i].value != null){
                        contactName = button.attributes[i].value;
                    }
                    else if(button.attributes[i].name === 'contact-number' && button.attributes[i].value != null){
                        contactNumber = button.attributes[i].value;
                    }
                }
                if(groupName && contactName && contactNumber){
                    (contactList.querySelector('.aside-header__title') as HTMLElement).textContent = 'Редактирование контакта';
                    const name = contactList.querySelector('[name="contact_name"]') as HTMLInputElement;
                    name.setAttribute('value', contactName);
                    name.value = contactName;

                    const number = contactList.querySelector('[name="contact_number"]') as HTMLInputElement;
                    number.setAttribute('value', contactNumber);
                    number.value = contactNumber;

                    (contactList.querySelector('.dropdown__selected-text') as HTMLElement).textContent = groupName;
                }
                else{
                    (contactList.querySelector('.aside-header__title') as HTMLElement).textContent = 'Добавление контакта';
                }
            });
        } 

        element.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

export function closeSidebar(element: HTMLElement | null): void {
    if (element && overlay) {
        element.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';

        if(contactList){
            document.querySelectorAll('.contact-info-btn__edit').forEach(button=>{
                for(let i = 0; i < button.attributes.length; i++){
                    if(button.attributes[i].name === 'group-name' ||
                       button.attributes[i].name === 'contact-name' ||
                       button.attributes[i].name === 'contact-number'){
                        button.attributes[i].value = '';
                    }
                }
            }); 
            const name = contactList.querySelector('[name="contact_name"]') as HTMLInputElement;
            name.setAttribute('value', '');
            name.value = '';

            const number = contactList.querySelector('[name="contact_number"]') as HTMLInputElement;
            number.setAttribute('value', '');
            number.value = '';

            const dropdownText = (contactList.querySelector('.dropdown__selected-text') as HTMLElement);
            if(dropdownText) dropdownText.textContent = 'Выберите группу';
        }
        setTimeout(() => 
            element.style.transition = 'none', 500
        )
    }
}

export function checkGroupList(formId: string): void{
    const groupForm = document.getElementById(formId)
    const formChildCount = groupForm?.querySelectorAll('.list-element');
    
    if(groupForm){
        const existingInfoText = groupForm.querySelector('.group-list__info-text');
        existingInfoText?.remove();
        if(formChildCount?.length === 0){
            if(!existingInfoText){
                const infoText = document.createElement('p');
                infoText.classList.add('group-list__info-text');
                infoText.textContent = 'Группы не найдены.';
                groupForm.appendChild(infoText);
                console.log(groupForm.childNodes);
                groupForm.style.gridTemplateRows = 'none';
            }
        }
    }
}

export function initSidebar(): void{
    window.addEventListener('resize', resizeWindow);
    resizeWindow();
    overlay?.addEventListener('click', function(){
        closeSidebar(groupList);
        closeSidebar(contactList);
    });
    showGroupsBtn?.addEventListener('click', function(){
        showSidebar(groupList);
    });
    addGroupBtn?.addEventListener('click', function(){
        checkGroupList('groupForm');
    });
    showAddContactBtn?.addEventListener('click', function(){
        showSidebar(contactList);
    });
    closeGroupsBtn?.addEventListener('click', function(){
        closeSidebar(groupList);
    });
    closeAddContactBtn?.addEventListener('click', function(){
        closeSidebar(contactList);
    });
}