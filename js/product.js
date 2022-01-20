import Operation from "./operation.js";

export default class Product {
    
    #btnCreate(title = '', layout, thisItem, params = {}, once=false) {
        let btn = document.createElement('button');
        btn.classList.add('button', 'is-small', 'is-rounded');
        btn.innerText = title;
        btn.addEventListener('click', () => {
            let newItem = new layout(params);
            this.view.appendChild(newItem.view);
            !once ? thisItem.push(newItem) : this[thisItem] = newItem;
        }, {once:once});
        return btn;
    }

    #inputCreate(inputType = 'text', placeholder = '', thisProperty) {
        const field = document.createElement('input');
        field.type = inputType;
        field.placeholder = placeholder;
        field.value = thisProperty ? thisProperty : '';
        field.addEventListener('blur', () => {
            thisProperty = field.value;
        });
        return field;
    }

    render() {
        let elements = [];
        let buttons = [];
        elements.push(this.#inputCreate('text', 'Название', this.title))
        elements.push(this.#inputCreate('number', 'Тираж', this.printrun))
        buttons.push(this.#btnCreate('Добавить техоперацию', Operation, 'operation',{parent: this},true));

        let inputs = document.createElement('div');
        inputs.classList.add('block');
        for(let element of elements) {
            inputs.appendChild(element);
        };
        this.view.appendChild(inputs);

        let btnBlock = document.createElement('div');
        btnBlock.classList.add('buttons');
        for (let button of buttons) {
            btnBlock.appendChild(button);
        };
        this.view.appendChild(btnBlock);
    }

    #printrunCalc(printrun=0) {
        if (this.parent) {
            this.printrun = Math.ceil(this.parent.printrun / (1 - this.parent.wastePersent/100));
        } else {
            this.printrun = printrun;
        }
    }

    constructor(data) {
        /*
        *   title
        *   printrun
        * 
        * 
        * 
        */
        for (let key in data) {
            this[key] = data[key];
        };
        this.view = document.createElement('div');
        this.view.classList.add('box', 'product');
        this.#printrunCalc(this.printrun ? this.printrun : 0);
        this.render();

        //=========================DEBUG===================================
        this.view.addEventListener('keyup', (event)=> {
            if (event.code=='PrintScreen') {
                console.log(this);
            };
        });
    }
}