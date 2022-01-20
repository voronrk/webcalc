import Material from "./material.js";
import Product from "./product.js";

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
            this.init(data[e.target.value]);
        });
        this.view.appendChild(select);
    }

    #btnCreate(title, layout, thisItem, params = {}, once=false) {
        let btn = document.createElement('button');
        btn.classList.add('button', 'is-small', 'is-rounded');
        btn.innerText = title;
        btn.addEventListener('click', () => {
            let newItem = new layout({parent:this});
            this.view.appendChild(newItem.view);
            !once ? thisItem.push(newItem) : this[thisItem] = newItem;
        }, {once:once});
        return btn;
    }

    init(data) {
        this.title = data[0];         
        this.type = data[1];           
        this.wastePersent = data[2];
        console.log(this);
    }

    get printrunInput() {
        return Math.ceil(this.printrunOutput / (1 - this.wastePersent/100));
    }

    render() {
        this.select();
        this.view.appendChild(this.#btnCreate('Добавить материал', Material, this.materials = []));
        this.view.appendChild(this.#btnCreate('Добавить полуфабрикат', Product, this.halfproducts = []));
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
        */
        for (let key in data) {
            this[key] = data[key];
        };
        console.log(this);
        this.printrun = this.parent.printrun;

        this.view = document.createElement('div');
        this.view.classList.add('box', 'operation');
        this.render();        
    }
}