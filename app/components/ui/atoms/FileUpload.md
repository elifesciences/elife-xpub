Awaiting file

```
const onDrop = (files) => console.log(files);
const conversion = {};

<FileUpload onDrop={onDrop} conversion={conversion} instruction = {'Upload file'} />
```

Conversion completed

```
const onDrop = (files) => console.log(files);
const conversion = {completed: true};
<FileUpload onDrop={onDrop} conversion={conversion} instruction = {'Upload file'} />
```

Conversion failed

```
const onDrop = (files) => console.log(files);
const conversion = {error: new Error('Conversion failed')};
<FileUpload onDrop={onDrop} conversion={conversion} instruction = {'Upload file'} />
```
