export default class Button {

    constructor(parent, title = '', layout, thisItem, params = {}, once=false) {
        /*  parent      Parent entity
        *   title       Title of button
        *   layout      Class of creating entity
        *   thisItem    Name of param of parent entity
        *   params      Params for creating entity
        *   once        Is button's handler run once?
        */

        let btn = document.createElement('button');
        btn.classList.add('button', 'is-small', 'is-rounded');
        btn.innerText = title;
        btn.addEventListener('click', () => {
            let newItem = new layout(params);
            parent.view.appendChild(newItem.view);
            thisItem.push(newItem);
        }, {once:once});
        return btn;
    }
}