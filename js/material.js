export default class Material {

    constructor(title, type, mainUnit, price, count = 0, usageRate, currency) {
        this.title = title;         // Название
        this.type = type;           // Тип (?)
        this.mainUnit = mainUnit;   // Единица измерения основная
        this.price = price;         // Цена за основную единицу
        this.count = count;         // Количество
        this.usageRate = usageRate; // Норма расхода
        this.currency = currency;   // Валюта цены
    }
}