"use client"

import { GeneralModal } from '@/context/GeneralModal'
import React, { useState } from 'react'

const GeneralModalProvide = ({children}) => {
  const [closeModal, setCloseModal] = useState(false)
  const [compModal, setCompModal] = useState(null)
  return (
    <GeneralModal.Provider value={{closeModal, setCloseModal, compModal, setCompModal}}>{children}</GeneralModal.Provider>
  )
}

export default GeneralModalProvide