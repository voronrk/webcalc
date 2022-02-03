import Button from "./button.js";
import Input from "./input.js";
import Operation from "./operation.js";

export default class Product {

    children = [];

    #selectOperation() {
        const data=[
            ['Фальцовка', {wasteNumber:10}, {wastePersent:1}],
            ['Подборка', {wasteNumber:1}, {wastePersent:2}],
            ['Шитьё', {wasteNumber:5}, {wastePersent:5}],
            ['Печать', {wasteNumber:20}, {wastePersent:2}],
            ['Обрезка', {wasteNumber:1}, {wastePersent:1}],
            ['Ламинация', {wasteNumber:5}, {wastePersent:3}],
            ['Резка', {wasteNumber:1}, {wastePersent:1}]
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
            let operParam = data[e.target.value];
            let newOperation = new Operation({parent:this, title: operParam[0], priladka: operParam[1], click: operParam[2]});
            this.children = [newOperation];
            this.operationWrapper.innerHTML = '';
            this.operationWrapper.appendChild(newOperation.view);
        });
        return select;
    }
    
    render() {
        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('field', 'is-grouped');
        for(let key in this) {
            if ((!(key=='parent')) && (!(key=='children')) && (this[key].view)) {
                inputsWrapper.appendChild(this[key].view)
            };
        };
        this.view.appendChild(inputsWrapper);

        let btnWrapper = document.createElement('div');
        btnWrapper.classList.add('buttons');
        btnWrapper.appendChild(this.#selectOperation());
        this.view.appendChild(btnWrapper);

        this.operationWrapper = document.createElement('div');
        this.view.appendChild(this.operationWrapper);
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
            this[field].value = value;
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
        *   title
        *   printrun
        *   x
        *   y
        *   z
        */

        this.title = new Input(this, 'title', '', 'Название', 'text', 'init');
        this.printrun = new Input(this, 'printrun', '', 'Тираж', 'number', 'init');
        this.x = new Input(this, 'x', '', 'X', 'number', 'init');
        this.y = new Input(this, 'y', '', 'Y', 'number', 'init');
        // this.z = new Input(this, 'z', '', 'Z', 'number', init);
        
        if (data.parent) {
            this.printrun.value = data.parent.printrun.value;
            this.x.value = data.parent.x;
            this.y.value = data.parent.y;
            // this.z.value = data.parent.z;
        } else {
            this.title.value = data.title;
            this.printrun.value = data.printrun;
            this.x.value = data.x;
            this.y.value = data.y;
            // this.z.value = data.z;
        }

        this.view = document.createElement('div');
        this.view.classList.add('box', 'product');
        this.render();

        //=========================DEBUG===================================
        this.view.addEventListener('click', (e)=> {
            if (e.target.classList.contains('box')) {
                e.stopPropagation();
                console.log(this);
            };
        },{bubble:false});
    }
}