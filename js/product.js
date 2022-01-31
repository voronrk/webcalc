import Button from "./button.js";
import Input from "./input.js";
import Operation from "./operation.js";

export default class Product {
    
    render() {
        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('block');
        for(let key in this) {
            if ((!(key=='parent')) && (!(key=='children')) && (this[key].view)) {
                inputsWrapper.appendChild(this[key].view)
            };
        };
        this.view.appendChild(inputsWrapper);

        let btnWrapper = document.createElement('div');
        btnWrapper.classList.add('buttons');
        btnWrapper.appendChild(new Button(this, 'Выбрать техоперацию', Operation, this.children=[], {parent: this}, true));
        this.view.appendChild(btnWrapper);
    }

    updateField(field, value, internal=true) {
        if (!internal) {
            console.log(this[field]);
            this[field].value = value;
        };
        if (this.children) {
            for(let child of this.children) {
                if (child[field]) {
                    child.updateField(field,value,false);
                }
            }
        }        
    }

    constructor(data) {
        /*
        *   title
        *   printrun
        *   x
        *   y
        *   z
        */

        this.title = new Input(this, 'title', '', 'Название', 'text', true);
        this.printrun = new Input(this, 'printrun', '', 'Тираж', 'number', true);
        this.x = new Input(this, 'x', '', 'X', 'number', true);
        this.y = new Input(this, 'y', '', 'Y', 'number', true);
        this.z = new Input(this, 'z', '', 'Z', 'number', true);
        
        if (data.parent) {
            this.printrun.value = data.parent.printrun;
            this.x.value = data.parent.x;
            this.y.value = data.parent.y;
            this.z.value = data.parent.z;
        } else {
            this.title.value = data.title;
            this.printrun.value = data.printrun;
            this.x.value = data.x;
            this.y.value = data.y;
            this.z.value = data.z;
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