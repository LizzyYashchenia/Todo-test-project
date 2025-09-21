import '../scss/styles.scss'
import { initLayout } from './layout';
import { checkGroupList, initSidebar } from './sidebar';
import { initManageGroup } from './manage-group';
import { initStorage } from './local-storage';
import { loadData } from './load-data';
import { initManageContact } from './manage-contact';

export function buttonHandlerLoad(): void{
    document.querySelectorAll('.open-btn').forEach(button=>{
    
        if (!button.getAttribute('state')) {
            button.setAttribute('state', 'false');
        }
        button.addEventListener('click', function(){
            const currentButton =  button as HTMLElement;
            const isOpen = currentButton.getAttribute('state') === 'true';
            const openBtnContainer = currentButton.closest('div');
            const currentDropdownContact = openBtnContainer?.querySelector('.group__contact') as HTMLElement;
    
            if(isOpen){
                closeMenu(currentButton, currentDropdownContact);
            }
            else{
                closeAllMenu();
                
                openMenu(currentButton, currentDropdownContact);
            }

        });
    });
}

function closeMenu(button:HTMLElement, dropdown:HTMLElement | null):void{
    if(dropdown){
        dropdown.classList.remove('open');
    }
    button.style.color = 'black';
    const img = button.querySelector('img');
    if(img) img.classList.remove('rotate');
    button.setAttribute('state', 'false');
}

function openMenu(button:HTMLElement, dropdown: HTMLElement | null): void{
    if(dropdown){
        dropdown.classList.add('open');
    }
    button.style.color = '#005BFE';
    const img = button.querySelector('img');
    if(img) img.classList.add('rotate');
    button.setAttribute('state', 'true');
}

function closeAllMenu(): void{
    document.querySelectorAll('.open-btn').forEach(btn =>{
        const currentButton = btn as HTMLElement;
        const container = currentButton.closest('div');
        const dropdown = container?.querySelector('.group__contact') as HTMLElement;
        closeMenu(currentButton, dropdown);
    });
}


document.addEventListener("DOMContentLoaded", () =>{
    initLayout();
    initSidebar();
    initManageGroup();
    initStorage();
    window.addEventListener('load', function(){
        loadData();
        checkGroupList('groupForm');
    });
    initManageContact();
});