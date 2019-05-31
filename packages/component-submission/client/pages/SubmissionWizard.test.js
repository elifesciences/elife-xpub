import { shallow } from 'enzyme'
import React from 'react'

import { SubmissionWizard } from './SubmissionWizard'

describe('SubmissionWizard autosave toggling', async () => {
  const mockMatch = {
    url: '',
    params: { id: '' },
    path: '',
  }

  it('disables autosave when a file is uploading', async () => {
    const mockUpdate = jest.fn()
    const props = {
      match: mockMatch,
      updateManuscript: mockUpdate,
      history: jest.fn(),
      initialValues: { fileStatus: 'READY' },
    }

    const thing = shallow(<SubmissionWizard {...props} />)

    expect(thing.instance().state.isUploading).toBe(false)
    expect(thing.instance().state.suspendSave).toBe(false)

    thing.instance().setIsUploading(true)
    thing.instance().onNextClick({ submitted_should_be: false })

    expect(mockUpdate).toHaveBeenCalledTimes(0)
  })

  it('enables autosave when a file is finished uploading', async () => {
    const mockUpdate = jest.fn()
    const props = {
      match: mockMatch,
      updateManuscript: mockUpdate,
      history: jest.fn(),
      initialValues: { fileStatus: 'READY' },
    }

    const thing = shallow(<SubmissionWizard {...props} />)

    expect(thing.instance().state.isUploading).toBe(false)
    expect(thing.instance().state.suspendSave).toBe(false)

    thing.instance().setIsUploading(true)

    expect(mockUpdate).toHaveBeenCalledTimes(0)
    thing.instance().setIsUploading(false)

    thing.instance().onNextClick({ submitted_should_be: false })
    expect(mockUpdate).toHaveBeenCalledTimes(1)
  })

  it('Keeps and retries the latest save when disabled', async () => {
    const mockUpdate = jest.fn()
    const props = {
      match: mockMatch,
      updateManuscript: mockUpdate,
      history: jest.fn(),
      initialValues: { fileStatus: 'READY' },
    }

    const thing = shallow(<SubmissionWizard {...props} />)

    expect(thing.instance().state.isUploading).toBe(false)
    expect(thing.instance().state.suspendSave).toBe(false)

    thing.instance().setIsUploading(true)

    expect(mockUpdate).toHaveBeenCalledTimes(0)

    thing.instance().onNextClick({ submitted_should_be: false })
    thing.instance().setIsUploading(false)

    expect(mockUpdate).toHaveBeenCalledTimes(1)
    expect(mockUpdate.mock.calls).toEqual([[{ submitted_should_be: false }]])
  })
})
