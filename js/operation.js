import Material from "./material.js";
import Product from "./product.js";
import Button from "./button.js";
import Input from "./input.js";

export default class Operation {

    select() {
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
        this.view.appendChild(select);
    }

    init(data = []) {
        // this.title = data[0] ? data[0] : '';
        // this.type = data[1] ? data[1] : '';
        // this.wastePersent.value = data[2] ? data[2] : '';
        this.view.appendChild(this.mo.view);
        this.view.appendChild(this.printrun.view);
        this.view.appendChild(this.wastePersent.view);
        this.view.appendChild(new Button(this, 'Добавить материал', Material, this.materials = [], {parent: this}));
        this.view.appendChild(new Button(this, 'Добавить полуфабрикат', Product, this.halfproducts = [], {parent: this, title:''}));
    }

    update(data) {
        this.title = data[0];
        this.type = data[1];
        this.wastePersent.value = data[2];
        this.printrun.value = this.#printrunCalc(this.parent.printrun.value);
    }

    render() {
        this.select();
    }

    #printrunCalc(value) {
        return Math.ceil(value / (1 - this.wastePersent.value/100));
    }

    updateField(field, value, internal=false) {
        if (!internal) {
            this[field].value = value;
        };
        if (this.halfproducts) {
            for(let halfproduct of this.halfproducts) {
                if (halfproduct[field]) {
                    halfproduct.updateField(field,value,false);
                }
            }
        }        
    }

    constructor(data) {
        /*
        * title            Название
        * halfproducts     Полуфабрикаты
        * materials        Материалы
        * wastePersent     Процент техотходов
        * wasteQuantity    Количество техотходов
        * printrunOutput   Выходной тираж
        * printrunInput    Входной тираж
        * mo               Доля
        */
        for (let key in data) {
            this[key] = data[key];
        };
        this.wastePersent = new Input(this, 'wastePersent', this.parent.wastePersent ? this.parent.wastePersent.value : 0, '% техотходов', 'number', true, 'disabled');
        this.mo = new Input(this, 'mo', '', 'Доля', 'number', true);
        this.printrun = new Input(this, 'printrun', this.#printrunCalc(this.parent.printrun.value), 'Тираж', 'number', true, 'disabled');

        this.view = document.createElement('div');
        this.view.classList.add('box', 'operation');
        this.render();
        this.init();        
        
        //=========================DEBUG===================================
        this.view.addEventListener('click', (e)=> {
            if (e.target.classList.contains('box')) {
                e.stopPropagation();
                console.log(this);
            };
        });
    }
}