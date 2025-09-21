import { getStorageList } from "./local-storage";
import { buttonHandlerLoad } from "./main";

interface ContactItem {
    groupName: string | null;
    contactName: string | null;
    number: string | null;
}

export function loadData(): void {
    const storageList = getStorageList();
    addInfoText();
    storageList.forEach((group: any) => {
        
        if (Array.isArray(group)) {
            group.forEach((item: ContactItem) => {
                if (item?.groupName && item?.contactName && item?.number !== null) {
                    loadGroup(item.groupName, item.contactName, item.number);
                }
            });
        }
    });
}

function loadGroup(groupName: string, contactName: string,  number:string): void{
    const contactContainer = document.getElementById('contactContainer');
    if(contactContainer){
        const groupSection = contactContainer.querySelectorAll('.container__group');
        let groupExists = false;

        groupSection.forEach(element=>{
            const groupId = element.getAttribute('id');
            if(groupId === `${groupName}-group`){
                loadContact(`${groupName}-group`, contactName, number);
                groupExists = true;
            }
        });
        if(!groupExists){
            const groupContactContainer = `
                <div id="${groupName}-group" class="container__group group">
                    <button class="group__open-btn open-btn" state="false">
                        <span class="open-btn__text">${groupName}</span>
                        <img class="open-btn__image" src="/images/dropdown.png" alt="open group button">
                    </button>
                    <div class="group__contact">
                    </div>
                </div>
            `;  
            contactContainer.innerHTML += groupContactContainer;
            loadContact(`${groupName}-group`, contactName, number);
            buttonHandlerLoad();
        }
    }

}

function loadContact(groupId:string, contactName: string,  number:string): void{
    const groupContainer = document.getElementById(groupId);
    const groupItem = groupContainer?.querySelector('.group__contact') as HTMLElement;

    if(groupContainer){
        let numberExist = false
        groupContainer?.querySelectorAll('.contact-info__number').forEach(element=>{
            if((element as HTMLInputElement).value === number){
                numberExist = true;
                (groupContainer.querySelector('.contact-item__name') as HTMLInputElement).value = contactName;
            }
        });
        if(!numberExist){
            const numberContainer = `
                <div class="group__contact-item contact-item">
                    <input value="${contactName}" class="contact-item__name" type="text" name="" placeholder="Фамилия Имя Отчество" disabled/>
                    <div class="contact-item__info contact-info">
                        <input value="${number}" class="contact-info__number" type="text" name="" placeholder="+7 (ХХХ) ХХХ - ХХ - ХХ" disabled/>
                        <div class="contact-info__button contact-info-btn">
                            <button type="button" class="contact-info-btn__edit" group-name="" contact-name="" contact-number=""></button>
                            <button type="button" class="contact-info-btn__delete" group-name="" contact-number=""></button>
                        </div>
                    </div>
                </div>
            `;
            groupItem.innerHTML += numberContainer;
            (groupItem.querySelector('.contact-info-btn__delete') as HTMLElement).focus();
        }
    }
}

export function addInfoText(): void{
    const storageList = getStorageList();
    const container = document.getElementById('contactContainer');
    if(storageList.length === 0){
        if(container){
            container.style.justifyContent = 'center';
            const existInfoText = container.querySelector('.info-main-text');
            if(!existInfoText){
                let infoText = document.createElement('span');
                infoText.textContent = 'Список контактов пуст';
                infoText.classList.add('info-main-text');
                infoText.style.color = 'grey';
                infoText.style.marginBottom = '80px';
                container?.appendChild(infoText);
            }
        } 
    }
    else{
        if(container){
            container.style.justifyContent = 'flex-start';
            document.querySelector('.info-main-text')?.remove();
        }
        
    }
}