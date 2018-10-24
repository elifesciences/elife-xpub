Switches between top and side navs according to screen width. Also adjusts side and main container widths.

```js
<SectionalLayout
  top={
    <div style={{ backgroundColor: 'darkseagreen' }}>This is the top nav</div>
  }
  side={
    <div style={{ backgroundColor: 'palegreen' }}>
      This is
      <br />
      The side
      <br />
      Nav
    </div>
  }
  main={
    <div style={{ backgroundColor: 'yellowgreen' }}>
      This is the main content
    </div>
  }
/>
```
