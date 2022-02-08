import Button from "./button.js";
import Input from "./input.js";
import Operation from "./operation.js";

export default class Product {

    children = [];

    #selectOperation() {
        const data=[
            ['Фальцовка', [{title: 'Приладка', wasteNumber:10}, {title: 'Прогон', wastePersent:1}]],
            ['Подборка', [{title: 'Приладка', wasteNumber:1}, {title: 'Прогон', wastePersent:2}]],
            ['Шитьё', [{title: 'Приладка', wasteNumber:5}, {title: 'Прогон', wastePersent:5}]],
            ['Печать', [{title: 'Приладка', wasteNumber:20}, {title: 'Прогон', wastePersent:2}]],
            ['Обрезка', [{title: 'Приладка', wasteNumber:1}, {title: 'Прогон', wastePersent:1}]],
            ['Ламинация', [{title: 'Приладка', wasteNumber:5}, {title: 'Прогон', wastePersent:3}]],
            ['Резка', [{title: 'Приладка', wasteNumber:1}, {title: 'Прогон', wastePersent:1}]]
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
            let newOperation = new Operation({parent:this, title: operParam[0], suboperations: operParam[1]});
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

    update(field, value, flag='by-int') {     //flag = ['int', 'by-parent', 'by-child', 'init']
        console.log('product |',field, value, flag);
        if (!(flag==='by-int') && (!(flag==='by-init'))) {
            this[field].value = value;
        };
        if ((flag==='by-parent') || (flag==='by-int')){
            this.#updateOthers(this.children, field, value, 'by-parent');
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

        this.title = new Input(this, 'title', '', 'Название', 'text', 'by-init');
        this.printrun = new Input(this, 'printrun', '', 'Тираж', 'number', 'by-init');
        this.x = new Input(this, 'x', '', 'X', 'number', 'by-init');
        this.y = new Input(this, 'y', '', 'Y', 'number', 'by-init');
        // this.z = new Input(this, 'z', '', 'Z', 'number', 'by-init');
        
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