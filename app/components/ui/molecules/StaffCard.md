Staff Card

```js
const Flex = require('grid-styled').Flex
const Box = require('grid-styled').Box
;<Flex>
  <Box Box width={1 / 3} px={2}>
    <StaffCard
      photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/weimun.jpg"
      name="Wei Mun Chan"
      jobTitle="Editorial Manager"
      telephone="+44 [0]1223 855379"
    />
  </Box>
  <Box Box width={1 / 3} px={2}>
    <StaffCard
      photoURL="https://prod--journal-cms.elifesciences.org/sites/default/files/iiif/person/2017-07/maria.jpg"
      name="Maria Guerreiro"
      jobTitle="Journal Development Editor"
      telephone="+44 [0]1223 855376"
    />
  </Box>
  <Box Box width={1 / 3} px={2}>
    <StaffCard
      name="John Smith"
      jobTitle="Journal Editor"
      telephone="+44 [0]1223 000000"
    />
  </Box>
</Flex>
```
