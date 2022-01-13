'use strict';

import Product from "./product.js";

const body = document.querySelector('#body');

let printSheet = new Product();
let flyer = new Product(printSheet,'Листовка');


body.appendChild(flyer.view);