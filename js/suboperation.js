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
        if ((field=='printrun') || (field=='mo')) {
            if (this.wastePersent) {
                return Math.ceil((value / this.parent.mo.value) * (this.wastePersent.value/100));
            } else if (this.wasteNumber) {
                return this.wasteNumber.value;
            } else {
                return 0;
            }
        };
        return value;
    }

    #updateOthers(entities, field, value, flag) {
        if (entities) {
            for(let entity of entities) {
                if (entity[field]) {
                    entity.update(field,value,flag);
                }
            }
        };
    }

    update(field, value, flag='by-int') {

        this[field].value = value;

        this.printrun.value = this.#calcField('printrun',this.parent.parent.printrun.value);
        this.parent.update(field, value, 'by-sub');
    }

    constructor(parent, data) {
        /*
        * title            Название
        * wastePersent     Процент техотходов
        * wasteNumber      Количество техотходов
        * printrun         Количество техотходов
        */

        this.parent = parent;

        if (data.title) {
            this.title = data.title;
        };
        if (data.wastePersent) {
            this.wastePersent = new Input(this, 'wastePersent', data.wastePersent, '% техотходов', 'number', 'by-init', '');
        };
        if (data.wasteNumber) {
            this.wasteNumber = new Input(this, 'wasteNumber', data.wasteNumber, 'Количество техотходов', 'number', 'by-init', '');
        };
        
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.parent.printrun.value), 'Количество', 'number', 'by-init', 'disabled');

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