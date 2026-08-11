"use client"

import { useNotify } from '@/hooks/useNotify'
import React, { useEffect } from 'react'

const Dashboard = () => {
  const {notice} = useNotify();
  useEffect(() => {
    notice({
      stop: "true"
    })
  }, [])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard