import Input from "./Input.js";

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

    #calcField(field) {
        if ((field=='printrun') || (field=='mo')) {
            if (this.wastePersent) {
                return this.printrunOut + Math.ceil(this.printrunOut * (this.wastePersent.value/100));
            } else if (this.wasteNumber) {
                return this.wasteNumber.value;
            } else {
                return 0;
            }
        };
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

    update(flag) {
        switch (flag) {
            case 'by-int':
                this.printrun.value = this.#calcField('printrun');
                this.parent.update('by-sub');
                break;
            case 'by-parent':
                this.printrunOut = this.parent.purePrintrun;
                this.printrun.value = this.#calcField('printrun');
                this.parent.update('by-sub');
                break;
        }
    }

    constructor(parent, printrunOut, data) {
       /*
        * title            Название
        * wastePersent     Процент техотходов
        * wasteNumber      Количество техотходов
        * printrun         Тираж (потребность)
        * printrunOut      Тираж (выходной)
        */

        this.parent = parent;
        this.printrunOut = printrunOut;

        if (data.title) {
            this.title = data.title;
        };
        if (data.wastePersent) {
            this.wastePersent = new Input(this, 'wastePersent', data.wastePersent, 'Норма техотходов, %', 'number', 'by-init', '');
        };
        if (data.wasteNumber) {
            this.wasteNumber = new Input(this, 'wasteNumber', data.wasteNumber, 'Норма техотходов, шт.', 'number', 'by-init', '');
        };
        
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun'), 'Кол-во', 'number', 'by-init', 'disabled');

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