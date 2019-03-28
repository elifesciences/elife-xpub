import { onFileDrop } from '.'

const fakeResponse = file => ({
  data: {
    uploadManuscript: { meta: { tile: '' }, files: [{ fileName: file.name }] },
  },
})

describe('FilesPageContainer', () => {
  // Mock props that would be passed by formik wrapper
  let values = {
    files: [],
  }
  const fakeFormFunctions = {
    setFieldTouched: () => {},
    setFieldError: () => {},
    setFieldValue: (fieldName, value) => (values[fieldName] = value),
  }

  // Mock mutation props
  const deleteFile = () =>
    new Promise(resolve =>
      resolve({ data: { removeUploadedManuscript: { files: [] } } }),
    )
  const saveFile = data =>
    new Promise(resolve => resolve(fakeResponse(data.variables.file)))

  // Simulate dropzone callback
  const dropSingleFile = async files => {
    await onFileDrop(files, fakeFormFunctions, deleteFile, saveFile)
  }

  const initialFile = [
    {
      name: 'document1.docx',
    },
  ]

  beforeEach(() => {
    values = { files: [] }
  })

  it('onFileDrop sets new manuscript file value when there is no validation error and no existing manuscript file', async () => {
    expect(values.files).toHaveLength(0)

    await dropSingleFile(initialFile)

    expect(values.files).toHaveLength(1)
    expect(values.files[0].fileName).toBe(initialFile[0].name)
  })

  it('onFileDrop replaces manuscript file value when there is no validation error a file exists', async () => {
    expect(values.files).toHaveLength(0)

    await dropSingleFile(initialFile)
    expect(values.files).toHaveLength(1)
    expect(values.files[0].fileName).toEqual(initialFile[0].name)

    const replacementFile = [
      {
        name: 'document2.docx',
      },
    ]

    await dropSingleFile(replacementFile)
    expect(values.files).toHaveLength(1)
    expect(values.files[0].fileName).toEqual(replacementFile[0].name)
  })

  it('empties files field when passed no files', async () => {
    expect(values.files).toHaveLength(0)

    await dropSingleFile(initialFile)
    expect(values.files).toHaveLength(1)

    await dropSingleFile([])
    expect(values.files).toHaveLength(0)
  })

  it('empties files field when passed multiple files', async () => {
    expect(values.files).toHaveLength(0)
    await dropSingleFile(initialFile)
    expect(values.files).toHaveLength(1)
    const multipleFiles = [
      {
        name: 'document2.docx',
      },
      {
        name: 'document3.docx',
      },
    ]
    await dropSingleFile(multipleFiles)
    expect(values.files).toHaveLength(0)
  })
})
