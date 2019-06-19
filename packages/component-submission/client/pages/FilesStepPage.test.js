import React from 'react'
import { shallow } from 'enzyme'
import { FilesStepPageComponent } from './FilesStepPage'

const mockValues = {
  files: [
    {
      type: 'MANUSCRIPT_SOURCE',
      fileName: 'a',
    },
    {
      type: 'SUPPORTING_FILE',
      fileName: 'b',
    },
    {
      type: 'SUPPORTING_FILE',
      fileName: 'c',
    },
  ],
}

const uploadResponse = {
  data: {
    uploadManuscript: {
      meta: {},
    },
  },
}

const deleteResponse = {
  data: {
    removeUploadedManuscript: {},
  },
}

function createWrapper(valueOverrides, propOverrides) {
  return shallow(
    <FilesStepPageComponent
      {...{
        values: { ...mockValues, ...valueOverrides },
        errors: {},
        touched: {},
        setFieldTouched: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldError: jest.fn(),
        setIsUploading: jest.fn(),
        disableSave: jest.fn(),
        deleteManuscriptFile: jest.fn(
          () => new Promise(resolve => resolve(deleteResponse)),
        ),
        uploadManuscriptFile: jest.fn(async () => uploadResponse),
        uploadSupportingFile: jest.fn(() =>
          Promise.resolve({
            data: {
              uploadSupportingFile: { files: [], fileStatus: 'READY' },
            },
          }),
        ),
        ...propOverrides,
      }}
    />,
  )
}

describe('FileStepPage', () => {
  it('getManuscriptSourceFile returns the file object with type MANUSCRIPT_SOURCE from an array of files', () => {
    const wrapper = createWrapper()
    expect(wrapper.instance().getManuscriptSourceFile()).toBe(
      mockValues.files[0],
    )
  })
  it('getManuscriptSourceFile returns an empty object if no file object with type MANUSCRIPT_SOURCE is found', () => {
    const wrapper = createWrapper({ files: [] })
    expect(wrapper.instance().getManuscriptSourceFile()).toEqual({})
  })

  it('onFileDrop sets files field to touched', () => {
    const mockSetFieldTouched = jest.fn()
    const wrapper = createWrapper({}, { setFieldTouched: mockSetFieldTouched })
    wrapper.instance().onFileDrop([])
    expect(mockSetFieldTouched).toHaveBeenCalled()
    expect(mockSetFieldTouched).toBeCalledWith('files', true, false)
  })

  it('onFileDrop sets fileStatus to CHANGING', () => {
    const mockSetFieldValue = jest.fn()
    const wrapper = createWrapper({}, { setFieldValue: mockSetFieldValue })
    wrapper.instance().onFileDrop([{}])
    expect(mockSetFieldValue).toBeCalledWith('fileStatus', 'CHANGING')
  })

  it('onFileDrop calls setIsUploading when upload succeds', () => {
    const mockSetIsUploading = jest.fn()
    const promise = Promise.resolve().then(() => {
      expect(mockSetIsUploading.mock.calls).toHaveLength(2)
      expect(mockSetIsUploading.mock.calls[0][0]).toBe(true)
      expect(mockSetIsUploading.mock.calls[1][0]).toBe(false)
    })
    const wrapper = createWrapper(
      {},
      {
        setIsUploading: mockSetIsUploading,
        uploadManuscriptFile: jest.fn(() => promise),
      },
    )
    wrapper.instance().onFileDrop([{}])
  })

  it('onFileDrop calls setIsUploading when upload fails', () => {
    const mockSetIsUploading = jest.fn()
    const promise = Promise.reject().then(() => {
      expect(mockSetIsUploading.mock.calls).toHaveLength(2)
      expect(mockSetIsUploading.mock.calls[0][0]).toBe(true)
      expect(mockSetIsUploading.mock.calls[1][0]).toBe(false)
    })
    const wrapper = createWrapper(
      {},
      {
        setIsUploading: mockSetIsUploading,
        uploadManuscriptFile: jest.fn(() => promise),
      },
    )
    wrapper.instance().onFileDrop([{}])
  })

  it('onFileDrop calls uploadManuscriptFile if one file is dropped', () => {
    const mockUploadManuscriptFile = jest.fn(
      () => new Promise(resolve => resolve(uploadResponse)),
    )
    const wrapper = createWrapper(
      {},
      { uploadManuscriptFile: mockUploadManuscriptFile },
    )
    wrapper.instance().onFileDrop([{}])
    expect(mockUploadManuscriptFile).toBeCalledTimes(1)
  })

  it('onFileDrop does not call uploadManuscriptFile if more than one file is dropped', () => {
    const mockUploadManuscriptFile = jest.fn()
    const wrapper = createWrapper(
      {},
      { uploadManuscriptFile: mockUploadManuscriptFile },
    )
    wrapper.instance().onFileDrop([{}, {}])
    expect(mockUploadManuscriptFile).toBeCalledTimes(0)
  })

  it('onFileDrop does not call uploadManuscriptFile if no files are dropped', () => {
    const mockUploadManuscriptFile = jest.fn()
    const wrapper = createWrapper(
      {},
      { uploadManuscriptFile: mockUploadManuscriptFile },
    )
    wrapper.instance().onFileDrop([])
    expect(mockUploadManuscriptFile).toBeCalledTimes(0)
  })

  it('upload supporting file sets the formik value for files on success', async () => {
    const mockSetFieldValue = jest.fn()
    const wrapper = createWrapper(
      {},
      {
        uploadSupportingFile: jest.fn(() =>
          Promise.resolve({
            data: {
              uploadSupportingFile: { files: ['foo'], fileStatus: 'READY' },
            },
          }),
        ),
        setFieldValue: mockSetFieldValue,
      },
    )

    await wrapper.instance().onSupportingFileUpload([{}])

    expect(mockSetFieldValue).toBeCalledTimes(3)
    expect(mockSetFieldValue.mock.calls[0]).toEqual(['fileStatus', 'CHANGING'])
    expect(mockSetFieldValue.mock.calls[1]).toEqual(['files', ['foo']])
    expect(mockSetFieldValue.mock.calls[2]).toEqual(['fileStatus', 'READY'])
  })

  it('sets fileStatus to CHANGING on supporting upload start', async () => {
    const mockSetFieldValue = jest.fn()
    const wrapper = createWrapper(
      {},
      {
        setFieldValue: mockSetFieldValue,
      },
    )

    await wrapper.instance().onSupportingFileUpload([{}])
    expect(mockSetFieldValue.mock.calls[0]).toEqual(['fileStatus', 'CHANGING'])
  })

  it('sets fileStatus to the returned fileStatus value on supporting upload success', async () => {
    const mockSetFieldValue = jest.fn()
    const options = {
      setFieldValue: mockSetFieldValue,
    }
    let wrapper = createWrapper({}, options)

    await wrapper.instance().onSupportingFileUpload([{}])
    expect(mockSetFieldValue).toBeCalledTimes(3)
    expect(mockSetFieldValue.mock.calls[0]).toEqual(['fileStatus', 'CHANGING'])
    expect(mockSetFieldValue.mock.calls[2]).toEqual(['fileStatus', 'READY'])
    mockSetFieldValue.mockReset()

    options.uploadSupportingFile = jest.fn(() =>
      Promise.resolve({
        data: {
          uploadSupportingFile: { files: ['foo'], fileStatus: 'CHANGING' },
        },
      }),
    )
    wrapper = createWrapper({}, options)

    await wrapper.instance().onSupportingFileUpload([{}])
    expect(mockSetFieldValue.mock.calls[0]).toEqual(['fileStatus', 'CHANGING'])
    expect(mockSetFieldValue.mock.calls[2]).toEqual(['fileStatus', 'CHANGING'])
  })

  it('set fileStatus to READY if uploading supporting file fails and no manuscript is uploading', async () => {
    const mockSetFieldValue = jest.fn()
    const errorToThrow = new Error('error')
    const wrapper = createWrapper(
      {},
      {
        isUploading: false,
        uploadSupportingFile: jest.fn(() => Promise.reject(errorToThrow)),
        setFieldValue: mockSetFieldValue,
      },
    )
    expect.assertions(4)
    try {
      await wrapper.instance().onSupportingFileUpload([{}])
    } catch (error) {
      expect(error).toBe(errorToThrow)
      expect(mockSetFieldValue).toBeCalledTimes(2)
      expect(mockSetFieldValue.mock.calls[0]).toEqual([
        'fileStatus',
        'CHANGING',
      ])
      expect(mockSetFieldValue.mock.calls[1]).toEqual(['fileStatus', 'READY'])
    }
  })
})
