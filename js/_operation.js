import Material from "./material.js";
import Product from "./product.js";
import Button from "./button.js";
import Input from "./input.js";

export default class Operation {

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

    update(data) {
        this.title = data[0];
        this.type = data[1];
        this.wastePersent.value = data[2];
        this.printrun.value = this.#calcField('printrun', this.parent.printrun.value);
    }

    render() {

        this.view.innerHTML = `<div class='block'>${this.title}</div>`;

        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('field', 'is-grouped');

        // inputsWrapper.appendChild(this.select());
        inputsWrapper.appendChild(this.mo.view);
        inputsWrapper.appendChild(this.wastePersent.view);
        inputsWrapper.appendChild(this.printrun.view);

        this.view.appendChild(inputsWrapper);

        let btnWrapper = document.createElement('div');
        btnWrapper.classList.add('buttons');
        btnWrapper.appendChild(new Button(this, 'Добавить материал', Material, this.materials = [], {parent: this}));
        btnWrapper.appendChild(new Button(this, 'Добавить полуфабрикат', Product, this.halfproducts = [], {parent: this, title:''}));
        this.view.appendChild(btnWrapper);        
    }

    #calcField(field,value) {
        if (field=='printrun') {
            return Math.ceil(Math.ceil(value / (1 - this.wastePersent.value/100))/this.mo.value);
        };
        if (field=='wastePersent') {
            return Math.ceil(Math.ceil(value / (1 - this.wastePersent.value/100))/this.mo.value);
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

    update(field, value, flag='int') {     //flag = ['int', 'by-parent', 'by-child', 'init']
        console.log(field, value, flag);
        if (!(flag==='int') && (!(flag==='init'))) {
            this[field].value = this.#calcField(field,value);
        };
        if ((flag==='by-parent') || (flag==='int')){
            this.#updateOthers(this.children, field, value, 'by-parent');
        };
        if ((flag==='by-child') || (flag==='int')){
            this.#updateOthers(this.parent, field, value, 'by-child');
        };        
    }

    constructor(data) {
        /*
        * title            Название
        * halfproducts     Полуфабрикаты
        * materials        Материалы
        * wastePersent     Процент техотходов
        * wasteCount       Количество техотходов
        * printrun         Тираж
        * mo               Доля
        */

        this.parent = data.parent;
        this.title = data.title;

        if (data.wastePersent) {
            this.wastePersent = new Input(this, 'wastePersent', data.wastePersent, '% техотходов', 'number', 'init', '');
        };
        if (data.wasteCount) {
            this.wasteCount = new Input(this, 'wasteCount', data.wasteCount, 'Количество техотходов', 'number', 'init', '');
        };
        
        this.mo = new Input(this, 'mo', 1, 'Доля', 'number', 'init');
        this.printrun = new Input(this, 'printrun', this.#calcField('printrun',this.parent.printrun.value), 'Тираж', 'number', 'init', 'disabled');

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