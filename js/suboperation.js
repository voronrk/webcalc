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

    update(field, value, flag='int') {
        console.log('suboperation |',field,value,flag);
        if (!(flag==='int') && (!(flag==='init'))) {
            this[field].value = value;
        };
        if (flag==='int') {
            if ((field==='wastePersent') || (field==='wasteNumber')) {
                this.update('printrun', this.#calcField('printrun',this.parent.parent.printrun.value), 'by-this');
            };
        };
        if (flag==='by-this') {
            if (field==='printrun') {                
                this.parent.update('printrun', this.printrun.value, 'by-sub');
            };  
        };
        if (flag==='by-parent') {
            if (field==='printrun') {                
                this.update('printrun', this.#calcField('printrun',this.parent.parent.printrun.value), 'by-this');
            };  
        };
    }

    constructor(parent, data) {
        /*
        * title            Название
        * wastePersent     Процент техотходов
        * wasteNumber      Количество техотходов
        * printrun         Количество техотходов
        * mo               Доля
        */

        this.parent = parent;

        if (data.title) {
            this.title = data.title;
        };
        if (data.wastePersent) {
            this.wastePersent = new Input(this, 'wastePersent', data.wastePersent, '% техотходов', 'number', 'init', '');
        };
        if (data.wasteNumber) {
            this.wasteNumber = new Input(this, 'wasteNumber', data.wasteNumber, 'Количество техотходов', 'number', 'init', '');
        };
        
        // this.mo = new Input(this, 'mo', 1, 'Доля', 'number', 'init');
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.parent.printrun.value), 'Количество', 'number', 'init', 'disabled');

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