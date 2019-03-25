Footer which is stuck to the bottom of the viewport.

...look to the bottom of the viewport to see this component :)

```js
initialState = { show: false }
const Button = require('@pubsweet/ui').Button
const { Flex, Box } = require('@rebass/grid')
;<div>
  <button onClick={() => setState({ show: !state.show })}>Toggle</button>
  {state.show && (
    <StickyFooter>
      <Flex>
        <Box mr={3}>
          <Button onClick={() => console.log('cancelled')}>Never mind</Button>
        </Box>
        <Box>
          <Button primary onClick={() => console.log('accepted')}>
            Click on me!
          </Button>
        </Box>
      </Flex>
    </StickyFooter>
  )}
</div>
```
