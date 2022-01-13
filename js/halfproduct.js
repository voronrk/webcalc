export default class Halfproduct {

    get inputCount() {
        return this.outputCount + this.waste;
    }

    constructor(outputCount, waste) {
        this.outputCount = outputCount;
        this.waste = waste;
    }
}