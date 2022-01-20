export default class Material {

    select(data) {
        let arTypes = [];

        let field = document.createElement('div');
        // field.classList.add('field');

        let selectTypeWrapper = document.createElement('div');
        selectTypeWrapper.classList.add('select');
        let selectType = document.createElement('select');
        let selectWrapper = document.createElement('div');
        selectWrapper.classList.add('select');
        let selectMaterial = document.createElement('select');

        for (let i in data) {
            if (!(arTypes.indexOf(data[i]['TYPE'])>-1)) {
                arTypes.push(data[i]['TYPE']);
                let option = document.createElement('option');
                option.value = data[i]['TYPE'];
                option.innerText = data[i]['TYPE'];
                selectType.appendChild(option);
            };
        };
        selectType.value = '';
        selectTypeWrapper.appendChild(selectType);
        field.appendChild(selectTypeWrapper);
        selectWrapper.appendChild(selectMaterial);
        field.appendChild(selectWrapper);

        selectType.addEventListener('change', (e) => {
            selectMaterial.innerHTML='';
            for (let i in data) {
                if (data[i]['TYPE'] === selectType.value) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.innerText = data[i]['TITLE'];
                    selectMaterial.appendChild(option);
                };                
            };
            selectMaterial.value = '';
            selectMaterial.addEventListener('change', (e) => {
                this.init(data[e.target.value]);
            });
        });
        this.view.appendChild(field);
    }

    async #getPaper() {
        const response = await fetch ('back/getPaperCalc.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        return await response.json();
    }

    async #getMaterials() {
        const response = await fetch ('back/getMaterials.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        return await response.json();
    }

    init(data) {
        this.title = data['TITLE'];
        this.type = data['TYPE'];
        this.mainUnit = data['UNIT'];
        this.price = data['PRICE'];
        this.usageRate = data['NORMA'];
        this.currency = 'RUR';
    }

    constructor(title='', type='', mainUnit='', price=0, count = 0, usageRate=1, currency='RUR') {
        this.title = title;         // Название
        this.type = type;           // Тип (?)
        this.mainUnit = mainUnit;   // Единица измерения основная
        this.price = price;         // Цена за основную единицу
        this.count = count;         // Количество
        this.usageRate = usageRate; // Норма расхода
        this.currency = currency;   // Валюта цены
        this.view = document.createElement('div');
        this.view.classList.add('select', 'is-small');
        // this.#getPaper()
        this.#getMaterials()
            .then(data =>{
                this.select(data);
            });
    }
}