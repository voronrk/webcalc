export default class Product {
    
    countGet() {
        const field = document.createElement('input');
        field.type = 'text';
        field.placeholder = 'Count';
        field.value = this.count;
        field.addEventListener('blur', () => {
            this.count = field.value;
            this.countHalfproduct();
            console.log(this);
        });
        return field;
    }

    titleGet() {
        const field = document.createElement('input');
        field.type = 'text';
        field.placeholder = 'Title';
        field.value = this.title;
        field.addEventListener('blur', () => {
            this.title = field.value;
            this.countHalfproduct();
            console.log(this);
        });
        return field;
    }

    widthGet() {
        const field = document.createElement('input');
        field.type = 'text';
        field.placeholder = 'Width';
        field.value = this.width;
        field.addEventListener('blur', () => {
            this.width = field.value;
            this.countHalfproduct();
            console.log(this);
        });
        return field;
    }

    heightGet() {
        const field = document.createElement('input');
        field.type = 'text';
        field.placeholder = 'Height';
        field.value = this.height;
        field.addEventListener('blur', () => {
            this.height = field.value;
            this.countHalfproduct();
            console.log(this);
        });
        return field;
    }

    render() {
        this.view.appendChild(this.titleGet());
        this.view.appendChild(this.countGet());
        this.view.appendChild(this.widthGet());
        this.view.appendChild(this.heightGet());
    }

    countHalfproduct() {
        this.halfproduct.title = 'Print Sheet';
        this.halfproduct.count = this.count / 4;
        this.halfproduct.width = this.height * 2;
        this.halfproduct.height = this.width * 2;
    }

    constructor(halfproduct = null, title = '', count = '', width = '', height = '') {
        this.title = title;
        this.count = count;
        this.width = width;
        this.height = height;
        this.view = document.createElement('div');
        this.render();
        this.halfproduct = halfproduct;
    }
}