import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import {
  TheContent,
  TheSidebar,
  TheAside,
  TheFooter,
  TheHeader,
  StatusToaster
} from './index'

const TheLayout = () => {
  const darkMode = useSelector(state => state.darkMode)
  const classes = classNames(
    'c-app c-default-layout',
    darkMode && 'c-dark-theme'
  )

  return (
    <div className={classes}>
      <TheSidebar/>
      <TheAside/>
      <StatusToaster/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default TheLayout
