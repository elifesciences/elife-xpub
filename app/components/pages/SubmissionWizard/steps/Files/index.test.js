import { onFileDrop } from '.'

const fakeFunction = () => {}
const fakeResponse = fileName => ({
  data: {
    uploadManuscript: { meta: { tile: '' }, files: [{ filename: fileName }] },
  },
})

describe('FilesPageContainer', () => {
  it('onFileDrop sets new manuscript file value when there is no validation error and no existing manuscript file', async () => {
    const values = {
      files: [],
    }
    const setValues = (fieldName, value) => (values[fieldName] = value)
    const files = [
      {
        name: 'document1.docx',
      },
    ]
    await onFileDrop(
      files,
      'files',
      fakeFunction,
      fakeFunction,
      setValues,
      () => new Promise(resolve => resolve({})),
      data =>
        new Promise(resolve => resolve(fakeResponse(data.variables.file))),
    )
    expect(values.files).toHaveLength(1)
  })

  it('onFileDrop replaces manuscript file value when there is no validation error a file exists', async () => {
    const setValues = (fieldName, value) => (values[fieldName] = value)
    const values = {
      files: [
        {
          filename: 'document1.docx',
        },
      ],
    }
    const files = [
      {
        name: 'document2.docx',
      },
    ]
    await onFileDrop(
      files,
      'files',
      fakeFunction,
      fakeFunction,
      setValues,
      () => new Promise(resolve => resolve({})),
      data =>
        new Promise(resolve => resolve(fakeResponse(data.variables.file))),
    )
    expect(values.files).toHaveLength(1)
    expect(values.files[0].name).toEqual(files[0].fileName)
  })
  it('empties files field when passed no files', async () => {
    const setValues = (fieldName, value) => (values[fieldName] = value)
    const values = {
      files: [{ filename: 'document1.docx' }],
    }
    await onFileDrop(
      [],
      'files',
      fakeFunction,
      fakeFunction,
      setValues,
      () =>
        new Promise(resolve =>
          resolve({ data: { removeUploadedManuscript: { files: [] } } }),
        ),
      () => new Promise(resolve => resolve({})),
    )
    expect(values.files).toHaveLength(0)
  })
  it('empties files field when passed multiple files', async () => {
    const setValues = (fieldName, value) => (values[fieldName] = value)
    const values = {
      files: [{ filename: 'document1.docx' }],
    }
    const files = [
      {
        name: 'document2.docx',
      },
      {
        name: 'document3.docx',
      },
    ]
    await onFileDrop(
      files,
      'files',
      fakeFunction,
      fakeFunction,
      setValues,
      () =>
        new Promise(resolve =>
          resolve({ data: { removeUploadedManuscript: { files: [] } } }),
        ),
      () => new Promise(resolve => resolve({})),
    )
    expect(values.files).toHaveLength(0)
  })
})
