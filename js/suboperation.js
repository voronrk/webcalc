import Input from "./input.js";

export default class Suboperation {

    render() {
        this.view.innerHTML = `<div class='block is-size-7'>${this.title}</div>`;

        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('field', 'is-grouped');

        inputsWrapper.appendChild(this.printrun.view);
        if (this.wasteNumber) {
            inputsWrapper.appendChild(this.wasteNumber.view);
        } else {
            inputsWrapper.appendChild(this.wastePersent.view);
        };       
        this.view.appendChild(inputsWrapper);
    }

    #calcField(field,value) {
        if (field=='printrun') {
            if (this.wastePersent) {
                return Math.ceil(value * (this.wastePersent.value/100));
            } else if (this.wasteNumber) {
                return this.wasteNumber.value;
            } else {
                return 0;
            }
            
        };
        if (field=='wastePersent') {
            return Math.ceil(Math.ceil(value / (1 - this.wastePersent.value/100))/this.mo.value);
        };
        return value;
    }

    update(field, value, flag='int') {

    }

    constructor(parent, title, data) {
        /*
        * title            Название
        * halfproducts     Полуфабрикаты
        * materials        Материалы
        * wastePersent     Процент техотходов
        * wasteNumber      Количество техотходов
        * printrun         Тираж
        * mo               Доля
        */

        this.parent = parent;
        this.title = title;

        if (data.wastePersent) {
            this.wastePersent = new Input(this, 'wastePersent', data.wastePersent, '% техотходов', 'number', 'init', '');
        };
        if (data.wasteNumber) {
            this.wasteNumber = new Input(this, 'wasteNumber', data.wasteNumber, 'Количество техотходов', 'number', 'init', '');
        };
        
        // this.mo = new Input(this, 'mo', 1, 'Доля', 'number', 'init');
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.printrun.value), 'Количество', 'number', 'init', 'disabled');

        this.view = document.createElement('div');
        this.view.classList.add('suboperation', 'column');
        this.render();
        
        //=========================DEBUG===================================
        this.view.addEventListener('click', (e)=> {
            if (e.target.classList.contains('box')) {
                e.stopPropagation();
                console.log(this);
            };
        });
    };
}