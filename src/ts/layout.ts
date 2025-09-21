const headerBtnContainer = document.getElementById("header-btn");
const mainBtnContainer = document.getElementById("contactList");
const addContactBtn = document.getElementById("show-add-contact-btn");

export function resizeWindow(): void{
    const innerWidth = document.documentElement.clientWidth;
}

function swapButton(): void{

    resizeWindow();
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