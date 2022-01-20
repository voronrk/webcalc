'use strict';

import Product from "./product.js";

const wrapper = document.querySelector('#wrapper');

let booklet = new Product({title: 'Брошюра',printrun: 1000});

wrapper.appendChild(booklet.view);