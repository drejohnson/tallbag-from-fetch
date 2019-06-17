# tallbag-from-fetch

Basically RxJS's fromFetch converted to a tallbag listenable source.

`AbortController` is required for this implementation to work and use cancellation appropriately

`npm install tallbag-from-fetch`

## example

```js
import pipe from 'tallbag-pipe'
import fromFetch from 'tallbag-from-fetch'
import observe from 'callbag-observe'

pipe(
  fromFetch('https://api.github.com/users?per_page=5'),
  map(response => response.json()),
  observe(async data => console.log(await data))
) // [{...}, {...}, {...}, {...}, {...}]
```
