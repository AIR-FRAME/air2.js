# Light weight UI library
# Very light code, 2kb and 500 lines of code
 
## Air2.js USAGE

### TRIGGER FROM COMPONENT A

```js
import air2 from './air2.js';

air2.variables = {
  isLoading: false,
  lists: ['mango', 'pineapple', 'apple']
}

air2.events = {
  data: []
}

air2.createComponent('homepage', `
  <div>Home Page</div>
  <ul>
  air2.data.map((item, i) => {
     <li>{item.name}</li>
  })
  </ul>
`);


```
