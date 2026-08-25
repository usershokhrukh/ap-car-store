"use client"

import { GeneralModal } from '@/context/GeneralModal'
import React, { useState } from 'react'

const GeneralModalProvide = ({children}) => {
  const [closeModal, setCloseModal] = useState(false)
  const [compModal, setCompModal] = useState(null)
  const [closeSpan, setCloseSpan] = useState(true)
  const [modalStopped, setModalStopped] = useState(false)
  return (
    <GeneralModal.Provider value={{closeModal,setModalStopped, modalStopped, setCloseModal, compModal, setCompModal, closeSpan, setCloseSpan}}>{children}</GeneralModal.Provider>
  )
}

export default GeneralModalProvide