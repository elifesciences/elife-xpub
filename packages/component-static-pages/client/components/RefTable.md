Table with footer

```js
<React.Fragment>
  <RefTable>
    <RefTable.Tr>
      <RefTable.Th />
      <RefTable.Th>Journal</RefTable.Th>
      <RefTable.Th>Book</RefTable.Th>
    </RefTable.Tr>
    <RefTable.Tr>
      <RefTable.Th>Authors</RefTable.Th>
      <RefTable.Td>Yes *</RefTable.Td>
      <RefTable.Td>Yes † </RefTable.Td>
    </RefTable.Tr>
    <RefTable.Tr>
      <RefTable.Th>Editors</RefTable.Th>
      <RefTable.Td />
      <RefTable.Td>Yes</RefTable.Td>
    </RefTable.Tr>
  </RefTable>
  <RefTable.Footer>
    <RefTable.FooterItem>
      * Not required, but if exists please include.
    </RefTable.FooterItem>
    <RefTable.FooterItem>
      † Only required for chapter reference.
    </RefTable.FooterItem>
  </RefTable.Footer>

  <p>Some more content</p>
</React.Fragment>
```

Horizontally scrolling table

```js
<div style={{ width: 400 }}>
  <RefTable>
    <RefTable.Tr>
      <RefTable.Th />
      <RefTable.Th>Longest word</RefTable.Th>
      <RefTable.Th>Longest place name</RefTable.Th>
    </RefTable.Tr>
    <RefTable.Tr>
      <RefTable.Th>English</RefTable.Th>
      <RefTable.Td>Antidisestablishmentarianism</RefTable.Td>
      <RefTable.Td>Sutton-under-Whitestonecliffe</RefTable.Td>
    </RefTable.Tr>
    <RefTable.Tr>
      <RefTable.Th>Welsh</RefTable.Th>
      <RefTable.Td>Cyfrwngddarostyngedigaethau</RefTable.Td>
      <RefTable.Td>
        Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch
      </RefTable.Td>
    </RefTable.Tr>
  </RefTable>
</div>
```
