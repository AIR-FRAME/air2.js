# Light weight UI library
# Very light code, 2kb and 500 lines of code
 
  
## product.js COMPONENT

```js
import air2 from './air2.js';

var variables = {
  isLoading: false,
  lists: ['mango', 'pineapple', 'apple']
}

var events = {
  data: []
}

air2.render('homepage', variables, events,  `
  <div>Our Products</div>
  <ul>
     events.data.map((item, i) => {
        <li>{item.name}</li>
     })
  </ul>
`);
```

## home.js PUBLISH

```js
import air2 from './air2.js';

air2.render(rootElement, `
  <div>Home Page</div>
  <homepage />
`);
```
