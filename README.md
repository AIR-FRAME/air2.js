# Ultra light weight UI library, very light code (2kb)

  
## COMPONENT

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


## ROUTING & PUBLISHING

```js
import air2 from './air2.js';

air2.render(rootElement, `
  <div>Home Page</div>
  <header />
  <routes>
     <route path="home"><homepage /></route>
     <route path="products"><products /></route>
     <route path="aboutus"><aboutus /></route>
  </routes>
  <footer />
`);
```
