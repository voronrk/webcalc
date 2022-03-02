import Material from "./Material.js";
import Product from "./Product.js";
import Button from "./Button.js";
import Input from "./Input.js";
import Suboperation from "./Suboperation.js";

export default class Operation {

    suboperations = [];

    render() {

        this.view.innerHTML = `<div class='block is-size-7 has-text-weight-bold'>${this.title}</div>`;

        let suboperationsWrapper = document.createElement('div');
        suboperationsWrapper.classList.add('columns', 'box');
        if (this.suboperations) {
            for (let suboperation of this.suboperations) {
                suboperationsWrapper.appendChild(suboperation.view);    
            };
        }        
        this.view.appendChild(suboperationsWrapper);
        
        let materialsWrapper = document.createElement('div');
        materialsWrapper.classList.add('columns', 'box');
        materialsWrapper.appendChild(new Button(this, 'Добавить материал', Material, this.materials = [], {parent: this.materials}));
        if (this.materials) {
            for (let material of this.materials) {
                materialsWrapper.appendChild(material.view);    
            };
        }        
        this.view.appendChild(materialsWrapper);

        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('field', 'is-grouped');

        inputsWrapper.appendChild(this.printrun.view);
        inputsWrapper.appendChild(this.mo.view);

        this.view.appendChild(inputsWrapper);

        let btnWrapper = document.createElement('div');
        btnWrapper.classList.add('buttons');
        
        btnWrapper.appendChild(new Button(this, 'Добавить полуфабрикат', Product, this.halfproducts = [], {parent: this, title:''}));
        this.view.appendChild(btnWrapper);        
    }

    get purePrintrun() {
        let moParent = this.parent.parent ? this.parent.parent.mo.value : 1;
        return Math.ceil(this.parent.printrun.value / (this.mo.value/moParent));
    }

    #calcField(field,value) {
        if (field=='printrun') {
            let result = 0;
            for (let suboperation of this.suboperations) {
                result += +suboperation.printrun.value;
            };
            return result;
        };
        return value;
    }

    #updateOthers(entities, flag) {
        if (entities) {
            if (typeof(entities)=='object') {
                for(let entity of entities) {
                    entity.update(flag);
                }
            } else {
                entity.update(flag);
            }            
        };
    }

    update(flag) {

        switch (flag) {
            case 'by-sub':
                this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);
                this.#updateOthers(this.halfproducts, 'by-parent');
                break;
            case 'by-int':
                this.#updateOthers(this.suboperations, 'by-parent');
                break;
            case 'by-parent':
                this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);
                this.#updateOthers(this.suboperations, 'by-parent');
                break;
        }
    }

    constructor(data) {
        /*
        * title            Название
        *
        * products         Полуфабрикаты
        * materials        Материалы
        * suboperations    Субоперации
        * 
        * printrun         Тираж (входной)
        * mo               Доля
        */

        this.parent = data.parent;
        this.title = data.title;
        this.moParent = this.parent.parent ? this.parent.parent.mo.value : 1;

        this.mo = new Input(this, 'mo', data.mo, 'Доля', 'number', 'by-init');
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.printrun.value), 'Тираж', 'number', 'by-init', 'disabled');

        if (data.suboperations) {
            for (let suboperation of data.suboperations.reverse()) {
                this.suboperations.unshift(new Suboperation(this, this.purePrintrun, suboperation));
            };
        };
        
        if (data.materials) {
            for (let material of data.materials) {
                this.materials.push(new Material(this, material));
            };
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