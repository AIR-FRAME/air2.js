# Light weight UI library
# Very light code, 2kb and 500 lines of code
 
## Air2.js USAGE

```js
import air2 from './air2.js';

var variables = {
  isLoading: false,
  lists: ['mango', 'pineapple', 'apple']
}

var events = {
  data: []
}

air2.createComponent('homepage', variables, events,  `
  <div>Home Page</div>
  <ul>
     events.data.map((item, i) => {
        <li>{item.name}</li>
     })
  </ul>
`);


```
