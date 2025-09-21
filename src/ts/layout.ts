const headerBtnContainer = document.getElementById("header-btn");
const mainBtnContainer = document.getElementById("contactList");
const addContactBtn = document.getElementById("show-add-contact-btn");

function swapButton(): void{

    if(!addContactBtn) return;
    
    if(headerBtnContainer && addContactBtn && innerWidth > 480){
        headerBtnContainer.prepend(addContactBtn);
    }
    if(mainBtnContainer && addContactBtn && innerWidth < 480){
        mainBtnContainer.prepend(addContactBtn);
    }
}

export function initLayout(): void{
    window.addEventListener('resize', swapButton);
    swapButton();
}