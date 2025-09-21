import { getAbsoluteUrl } from "./main";

export class Dropdown{
    private container: HTMLElement;
    private dropdownName: string;
    private dataItems: any[] = [];
    private selectedItem: any = null;
    private isOpen: boolean = false;

    private events: any ={
        change: [],
        open: [],
        close: []
    };

    constructor(container:HTMLElement, dropdownName:string){
        this.container = container;
        this.dropdownName = dropdownName;
        this.init();
    }

    init(): void{
        this.container.innerHTML += `
        <div class="contact-list__item item">
            <div id = "${this.dropdownName}" class="contact-list__element dropdown-container">
                <button class="dropdown__button" type="button">
                    <span class="dropdown__selected-text">Выберите группу</span>
                    <img src="${getAbsoluteUrl('images/dropdown.png')}" alt="dropdown button" class="dropdown__arrow"/>
                </button>
                <div class="dropdown__menu menu" style="visibility: hidden;">
                    <div class="menu__list list"></div>
                </div>
            </div>
        </div>
        `;

        this.bindEvents();
    }

    bindEvents(){
        const dropdownBtn = this.container.querySelector('.dropdown__button') as HTMLButtonElement;
        const dropdownMenu = this.container.querySelector('.menu') as HTMLElement;
        const dropdownImg = dropdownBtn.querySelector('img') as HTMLImageElement;
         
        dropdownBtn.addEventListener('click', ()=>{
            if(this.isOpen){
                dropdownMenu.style.visibility = 'hiden';
                this.isOpen = false;
                this.triggerEvent('close');
                dropdownImg.style.transform = 'rotate(0)';
                dropdownMenu.style.animation = 'hiding 0.5s forwards';
            }
            else{
                dropdownMenu.style.visibility = 'visible';
                this.isOpen = true;
                this.triggerEvent('open');
                dropdownImg.style.transform = 'rotate(180deg)';
                dropdownMenu.style.animation = 'emersion 0.5s forwards';
            }
        });

        document.addEventListener('click', (e)=>{
            if(!this.container.contains(e.target as Node) && this.isOpen){
                dropdownMenu.style.animation = 'hiding 0.5s forwards';
                dropdownMenu.style.visibility = 'hiden';
                dropdownImg.style.transform = 'rotate(0)';
                this.isOpen = false;
                this.triggerEvent('close');
            }
        });
    }

    private renderItems(): void{
        const itemsContainer = this.container.querySelector('.menu__list') as HTMLElement;
        itemsContainer.innerHTML = '';

        this.dataItems.forEach(item =>{
            const itemElement = document.createElement('div');
            itemElement.classList.add('list__items');
            itemElement.textContent = item;

            itemElement.addEventListener('click', ()=>{
                this.selectedItem = item;
                this.updateSelectedText();

                const dropdownMenu = this.container.querySelector('.menu') as HTMLElement;
                const dropdownImg = this.container.querySelector('.dropdown__arrow') as HTMLImageElement;
                dropdownMenu.style.animation = 'hiding 0.5s forwards';
                dropdownMenu.style.visibility = 'hidden';
                dropdownImg.style.transform = 'rotate(0)';
                
                this.isOpen = false;
                this.triggerEvent('change', item);
            });

            itemsContainer.appendChild(itemElement);
        });
    }

    private updateSelectedText(): void{
        const selectedText = this.container.querySelector('.dropdown__selected-text') as HTMLElement;
        if(selectedText) selectedText.textContent = this.selectedItem || 'Выберите группу';
    }

    triggerEvent(event: string, data?: any): void{
        if(this.events[event]){
            this.events[event].forEach((handler: any)=>{
                handler(data);
            });
        }
    }

    public bind(event: string, handler: Function): void{
        if(this.events[event]){
            this.events[event].push(handler);
        };
    }

    public set dataItem(items: any[]) {
        this.dataItems = items;
        this.renderItems();
    }

    public getSelectedValue(): any{
        return this.selectedItem;
    }
}
export const style = `
    .dropdown-container{
        position: relative;
        padding:0 !important;
        max-height:30px;
    }
    .dropdown__button{
        width: -webkit-fill-available;
        border: none;
        background-color: transparent;
        padding: 8px 10px;
        padding-top:9px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .dropdown__button img{
        height: 6px;
        transition: 0.3s ease-in;
    }
    .menu{
        position: absolute;
        top: 40px;
        left: 0;
        width: 100%;
        max-height: 150px;
        overflow-y: auto;
        z-index: 500;
        border-radius: 5px;
        background-color: #F2F2F2;
        transform: translateY(-15%);
        opacity:0;
    }

    @keyframes emersion {
        0% {transform: translateY(-15%); opacity:0;}
        100% {transform: translateY(0); opacity:1;}
    }
    @keyframes hiding {
        0% {transform: translateY(0); opacity:1;}
        100% {transform: translateY(-15%); opacity:0;}
    }
    
    .list__items{
        padding: 8px;
        cursor: pointer;
    }
    .list__items:hover{
        background-color: #e3e1e1ff;
    }
`;