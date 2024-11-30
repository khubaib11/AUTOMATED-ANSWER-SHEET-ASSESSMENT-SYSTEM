import React from 'react'
import { useSelector } from 'react-redux'

export default function About() {
  const user=useSelector((state) => state.user )
  return (
    <div>
      {JSON.stringify(user)}
    </div>
  )
}
