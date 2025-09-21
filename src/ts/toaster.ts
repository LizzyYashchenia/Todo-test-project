export class Toaster {
    private static queue: string[] = [];
    private static isShowing = false;

    static show(text: string): void {
        this.queue.push(text);
        
        if (!this.isShowing) {
            this.showNext();
        }
    }

    private static showNext(): void {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const text = this.queue[0];

        const mainBlock = document.getElementById('contactList');
        const toaster = this.createToasterElement(text);

        mainBlock?.appendChild(toaster);

        setTimeout(() => {
            this.removeToaster();
            this.queue.shift();
            this.showNext();
        }, 3000);
    }

    private static createToasterElement(text: string): HTMLElement {
        const toasterBlock = document.createElement('div');
        toasterBlock.classList.add('toaster');

        const image = document.createElement('img');
        image.classList.add('toaster__image');
        image.src = '/images/success.png';
        image.alt = 'Success';

        const textElement = document.createElement('span');
        textElement.classList.add('toaster__text');
        textElement.textContent = text;

        toasterBlock.append(image, textElement);
        return toasterBlock;
    }

    private static removeToaster(): void {
        const toaster = document.querySelector('.toaster');
        if (toaster) {
            toaster.remove();
        }
    }
}