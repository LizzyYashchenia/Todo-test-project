import { checkAttribute } from "./manage-contact";
import { closeSidebar } from "./sidebar";

const overlay = document.getElementById('overlay');
const modal = document.getElementById('modal');
const groupList = document.getElementById('groupList');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');

export function createModal(header: string, text:string, elementId: string | null, btnState: boolean | null): void{
    if(overlay && modal){
        closeSidebar(groupList);

        const modalHeader = document.getElementById('modal-header');
        const modalContent = document.getElementById('modal-text');

        if(modalHeader && modalContent){
            modalHeader.textContent = header;
            modalContent.textContent = text;
        }

        modal.classList.add('active');
        if(elementId) modalConfirmBtn?.setAttribute("data-id", elementId);
        else{
            modalConfirmBtn?.addEventListener('click', function(){
                checkAttribute();
            })
        }
        document.body.style.overflow = 'hidden';

        let btnBlock = document.querySelector('.modal-button') as HTMLElement;
        let textBlock = document.querySelector('.modal-inner__text') as HTMLElement;

        if(!btnState){
            btnBlock.classList.add('none');
            textBlock.style.marginBottom = '20px';
        }
        else{
            btnBlock.classList.remove('none');
            textBlock.style.marginBottom = '10px';
        }
    }
}

export function closeModal(): void{
    if (modal && overlay) {
        modal.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}
