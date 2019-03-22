List item in the dashboard. It shows the manuscript title, submission status & the date of the last status change.

```js
const manuscript = {
  created: '2018-10-25T14:53:29.857Z',
  clientStatus: 'CONTINUE_SUBMISSION',
  meta: {
    title:
      'Shearing in flow environment promotes evolution of social behaviour in microbial populations',
  },
}
;<DashboardListItem manuscript={manuscript} />
```

```js
const manuscript = {
  created: '2018-10-25T14:53:29.857Z',
  clientStatus: 'SUBMITTED',
  meta: {
    title:
      'Cross-talk between PRMT1-mediated methylation and ubiquitylation on RBM15 controls RNA splicing',
  },
}
;<DashboardListItem manuscript={manuscript} />
```

```js
const manuscript = {
  created: '2018-10-25T14:53:29.857Z',
  clientStatus: 'SUBMITTED',
  meta: {
    title:
      'INAVA-ARNO complexes bridge mucosal barrier function with inflammatory signaling',
  },
}
;<DashboardListItem manuscript={manuscript} />
```

```js
const manuscript = {
  created: '2018-10-25T14:53:29.857Z',
  clientStatus: 'REJECTED',
  meta: {
    title:
      'Affinity capture of polyribosomes followed by RNAseq (ACAPseq), a discovery platform for protein-protein interactions',
  },
}
;<DashboardListItem manuscript={manuscript} />
```
