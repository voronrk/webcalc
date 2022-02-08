import Material from "./material.js";
import Product from "./product.js";
import Button from "./button.js";
import Input from "./input.js";
import Suboperation from "./suboperation.js";

export default class Operation {

    suboperations = [];

    select_DEPRECATED() {
        const data=[
            ['Фальцовка', 'Фальцовка', 1],
            ['Подборка', 'Подборка', 2],
            ['Шитьё', 'Шитьё', 3],
            ['Печать', 'Печать', 4],
            ['Обрезка', 'Обрезка', 5],
            ['Ламинация', 'Ламинация', 6],
            ['Резка', 'Резка', 7]
        ];
        let select = document.createElement('div');
        select.classList.add('select', 'is-small');
        select.innerHTML = `
        <select>
            <option value='0'>Фальцовка</option>
            <option value='1'>Подборка</option>
            <option value='2'>Шитьё</option>
            <option value='3'>Печать</option>
            <option value='4'>Обрезка</option>
            <option value='5'>Ламинация</option>
            <option value='6'>Резка</option>
        </select>
        `;
        select.children[0].value = '';
        select.addEventListener('change', (e) => {
            this.update(data[e.target.value]);
        });
        return select;
    }

    // update(data) {
    //     this.title = data[0];
    //     this.type = data[1];
    //     this.wastePersent.value = data[2];
    //     this.printrun.value = this.#calcField('printrun', this.parent.printrun.value);
    // }

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

    #calcField(field,value) {
        if (field=='printrun') {
            let result = Math.ceil(this.parent.printrun.value / this.mo.value);
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

        this[field].value = value;
        this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);


        if (flag==='by-sub') {
            console.log('operation |',field, value, flag);
            this.printrun.value = this.#calcField('printrun',this.parent.printrun.value);
            this.#updateOthers(this.halfproducts, 'printrun', this.printrun.value, 'by-parent');
        };
        if (flag==='by-parent') {
            if (field==='printrun') {
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

        this.mo = new Input(this, 'mo', 4, 'Доля', 'number', 'by-init');
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