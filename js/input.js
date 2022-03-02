export default class Input {

    #value;
    #flag;

    set value(value) {
        this.#value = value;
        this.view.querySelector('input').value = value;
    }

    get value() {
        return this.#value;
    }

    constructor (parent, title = '', value = '', placeholder = '', inputType = 'text', flag='by-init', disabled = '') {
        this.#flag = flag;
        this.parent = parent;
        this.title = title;
        this.placeholder = placeholder;
        this.inputType = inputType;
        
        this.disabled = disabled;

        this.view = document.createElement('p');
        this.view.classList.add('field');
        this.view.innerHTML = `
            <label class="label is-small">${this.placeholder}</label>
            <div class="control">
                <input class="input is-small" type=${this.inputType} placeholder=${this.placeholder} ${this.disabled}>
            </div>`;
        this.view.querySelector('input').addEventListener('change', (e) => {
            this.#flag = 'by-int';
            this.value = e.target.value;     
            this.parent.update(this.#flag);
        });
        this.value = value;
    }
}