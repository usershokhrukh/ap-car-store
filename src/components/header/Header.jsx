import React from 'react'
import "./header.modules.scss"
import ThemeToggle from '../ThemeToggle'

const Header = () => {
  return (
    <div className='header container'>
      <ThemeToggle/>
    </div>
  )
}

export default Header