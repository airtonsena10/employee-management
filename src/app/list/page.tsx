'use client'
import { Iemployees } from '@/Iemployees'
import Header from '@/components/Header/Header'
import Tableemployees from '@/components/TableEmployee'
import { employeeContext } from '@/context/employeeContext'
import React, { useEffect, useState } from 'react'

import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

export default function Listemployees() {
  const [employeesData, setemployees] = useState<Iemployees[]>([])
  const [loading, setloading] = useState(false)

  const getemployees = async () => {
    try {
      setloading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}`)
      const data = await response.json()
      setemployees(data.employees)
      setloading(false)
      return data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getemployees()
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <Header />

      {loading ? (
        <Box className="flex justify-center items-center mt-20">
          <CircularProgress />
        </Box>
      ) : (
        <employeeContext.Provider value={{ employeesData }}>
          <div className="flex flex-col justify-center items-center p-5">
            <h1 className="text-3xl font-bold text-primaryColor flex items-center gap-3">
              Listar employees{' '}
              <span className="text-lg text-gray-500">
                ({employeesData?.length})
              </span>
            </h1>
            <Tableemployees />
          </div>
        </employeeContext.Provider>
      )}
    </div>
  )
}
