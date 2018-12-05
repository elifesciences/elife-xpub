Awaiting file

```js
;<SupportingUpload
  hasManuscript={true}
  maxSupportingFiles={10}
  uploadFile={file =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve(file)
        } else {
          reject(new Error('Something went wrong'))
        }
      }, 1000)
    })
  }
/>
```
