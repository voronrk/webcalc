export default class Input {

    #value;
    #internal;

    set value(value) {
        this.#value = value;
        this.view.querySelector('input').value = value;
        this.parent.updateField(this.title, value, this.#internal);
        // this.#internal = false;
    }

    get value() {
        return this.#value;
    }

    constructor (parent, title = '', value = '', placeholder = '', inputType = 'text', internal=false, disabled = '') {
        this.#internal = internal;
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
        this.view.querySelector('input').addEventListener('blur', (e) => {
            this.value = e.target.value;
            this.#internal = true;
        });
        this.value = value;
    }
}