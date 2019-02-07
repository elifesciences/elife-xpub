import styled from 'styled-components'
import {
  Tab as UnstyledTab,
  TabList as UnstyledTabList,
  Tabs as UnstyledTabs,
  TabPanel as UnstyledTabPanel,
} from 'react-tabs'
import { th } from '@pubsweet/ui-toolkit'
import media from 'global/layout/media'

const Tabs = styled(UnstyledTabs)``

const TabList = styled(UnstyledTabList)`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
`

const Tab = styled(UnstyledTab).attrs({
  selectedClassName: 'selected',
  disabledClassName: 'disabled',
})`
  padding: ${th('space.3')};
  list-style: none;
  cursor: pointer;
  border-bottom: 4px solid transparent;
  margin-bottom: -1px;
  color: ${th('colorTextSecondary')};
  &:hover {
    color: ${th('colorPrimary')};
  }

  &.selected {
    border-bottom-color: ${th('colorPrimary')};
    color: ${th('colorText')};
  }

  &.disabled {
    cursor: default;
  }
`

const TabPanel = styled(UnstyledTabPanel).attrs({
  selectedClassName: 'selected',
})`
  display: none;
  &.selected {
    ${media.mobileUp`
      border-top: 1px solid ${th('colorBorder')};
    `} display: block;
  }
`

Tabs.tabsRole = 'Tabs'
TabList.tabsRole = 'TabList'
Tab.tabsRole = 'Tab'
TabPanel.tabsRole = 'TabPanel'

Tabs.Tab = Tab
Tabs.List = TabList
Tabs.Panel = TabPanel

export default Tabs
