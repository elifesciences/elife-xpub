List item in the dashboard. It shows the manuscript title, submission status & the date of the last status change.

```js
const today = new Date()
;<DashboardListItem
  statusCode={'CONTINUE_SUBMISION'}
  title={
    'Shearing in flow environment promotes evolution of social behaviour in microbial populations'
  }
  date={today}
/>
```

```js
const today = new Date()
;<DashboardListItem
  statusCode={'SUBMITTED'}
  title={
    'Cross-talk between PRMT1-mediated methylation and ubiquitylation on RBM15 controls RNA splicing'
  }
  date={new Date(today.setDate(today.getDate() - 1))}
/>
```

```js
const today = new Date()
;<DashboardListItem
  statusCode={'SUBMITTED'}
  title={
    'INAVA-ARNO complexes bridge mucosal barrier function with inflammatory signaling'
  }
  date={new Date(today.setDate(today.getDate() - 3))}
/>
```

```js
;<DashboardListItem
  statusCode={'REJECTED'}
  title={
    'Affinity capture of polyribosomes followed by RNAseq (ACAPseq), a discovery platform for protein-protein interactions'
  }
  date={'2018-10-09T16:10:00.000Z'}
/>
```
