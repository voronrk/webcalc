import Material from "./material.js";
import Product from "./product.js";
import Button from "./button.js";
import Input from "./input.js";
import Suboperation from "./suboperation.js";

export default class Operation {

    suboperations = [];

    render() {

        this.view.innerHTML = `<div class='block is-size-7 has-text-weight-bold'>${this.title}</div>`;

        let suboperationsWrapper = document.createElement('div');
        suboperationsWrapper.classList.add('columns');
        for (let suboperation of this.suboperations) {
            suboperationsWrapper.appendChild(suboperation.view);    
        };
        this.view.appendChild(suboperationsWrapper);

        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('field', 'is-grouped');

        inputsWrapper.appendChild(this.printrun.view);
        inputsWrapper.appendChild(this.mo.view);

        this.view.appendChild(inputsWrapper);

        let btnWrapper = document.createElement('div');
        btnWrapper.classList.add('buttons');
        btnWrapper.appendChild(new Button(this, 'Добавить материал', Material, this.materials = [], {parent: this}));
        btnWrapper.appendChild(new Button(this, 'Добавить полуфабрикат', Product, this.halfproducts = [], {parent: this, title:''}));
        this.view.appendChild(btnWrapper);        
    }

    get clearPrintrun() {
        let moParent = this.parent.parent ? this.parent.parent.mo.value : 1;
        return Math.ceil(this.parent.printrun.value / (this.mo.value/moParent));
    }

    #calcField(field,value) {
        if (field=='printrun') {
            let result = this.clearPrintrun;
            for (let suboperation of this.suboperations) {
                result += +suboperation.printrun.value;
            };
            return result;
        };
        return value;
    }

    #updateOthers(entities, field, value, flag) {
        if (entities) {
            if (typeof(entities)=='object') {
                for(let entity of entities) {
                    if (entity[field]) {
                        entity.update(field,value,flag);
                    }
                }
            } else {
                if (entity[field]) {
                    entity.update(field,value,flag);
                }
            }            
        };
    }

    update(field, value, flag='by-int') {     //flag = ['int', 'by-parent', 'by-child', 'by-sub', 'init', 'by-this']
        console.log('operation |',field, value, flag);

        if (this[field]) {
            this[field].value = value;
        };        
        this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);

        if (flag==='by-sub') {
            
            this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);
            this.#updateOthers(this.halfproducts, 'printrun', this.printrun.value, 'by-parent');
        };
        if ((flag==='by-parent') || (flag==='by-int')){
            if ((field==='printrun') || (field==='mo')) {
                this.#updateOthers(this.suboperations, 'printrun', value, 'by-parent');
            }
        };
    }

    constructor(data) {
        /*
        * title            Название
        * halfproducts     Полуфабрикаты
        * materials        Материалы
        * wastePersent     Процент техотходов
        * wasteNumber      Количество техотходов
        * printrun         Тираж (входной)
        * mo               Доля
        */

        this.parent = data.parent;
        this.title = data.title;
        this.moParent = this.parent.parent ? this.parent.parent.mo.value : 1;

        this.mo = new Input(this, 'mo', data.mo, 'Доля', 'number', 'by-init');
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.printrun.value), 'Тираж', 'number', 'by-init', 'disabled');

        for (let suboperation of data.suboperations) {
            this.suboperations.push(new Suboperation(this, suboperation));
        };
        
        this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);

        this.view = document.createElement('div');
        this.view.classList.add('box', 'operation');
        this.render();
        
        //=========================DEBUG===================================
        this.view.addEventListener('click', (e)=> {
            if (e.target.classList.contains('box')) {
                e.stopPropagation();
                console.log(this);
            };
        });
    }
}