# Light weight UI framework
# Very light code, 2kb and 500 lines of code

### Creating components
```js
Events.bind('eventname', myFunction);
```

### Creating Events
```js
Events.trigger('eventname');
```


 
## Air2.js usage

### TRIGGER FROM COMPONENT A

```js
import Events from './events.js';

showData = (key) => {
   Events.trigger('showdata');
}

flashMessage = (key) => {
   Events.trigger('flashmessage');
}
```

### TRIGGERED AT COMPONENT B

```js
import Events from './events.js';

componentDidMount = () => {
   Events.bind('showdata', this.fnFetchData);
};
```

### TRIGGERED AT COMPONENT C

```js
import Events from './events.js';

componentDidMount = () => {
   Events.bind('flashmessage', this.fnFlashMessage);
};
```
