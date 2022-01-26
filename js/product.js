import Button from "./button.js";
import Input from "./input.js";
import Operation from "./operation.js";

export default class Product {
    
    render() {
        let inputsWrapper = document.createElement('div');
        inputsWrapper.classList.add('block');
        for(let key in this) {
            if ((!(key=='parent')) && (this[key].view)) {
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
        */
        for (let key in data) {
            if (!(typeof(data[key])==='object')) {
                let placeholder = '';
                let type = 'text';
                if (key==='title') {
                    placeholder = 'Название';
                };
                if (key==='printrun') {
                    placeholder = 'Тираж';
                    type = 'number';
                }
                this[key] = new Input(this, key, data[key], placeholder, type, true);
            } else {
                this[key] = data[key];
            };
        };
        if (!this.printrun) {
            this.printrun = new Input(this, 'printrun', this.parent.printrun.value, 'Тираж', 'number', true);
        };
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