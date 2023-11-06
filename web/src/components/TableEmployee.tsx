import { Iemployees } from '@/Iemployees'
import React, { useContext, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { PencilSimple, Trash, FilePdf } from '@phosphor-icons/react'
import MenuDrop from './MenuDrop'
import Link from 'next/link'
import { employeeContext } from '@/context/employeeContext'
import Image from 'next/image'

export default function Tableemployees() {
  const [employeeID, setemployeeID] = useState<string | undefined>('')

  const { employeesData } = useContext(employeeContext)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string | undefined,
  ) => {
    setAnchorEl(event.currentTarget)
    setemployeeID(id)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <TableContainer className="max-w-3xl" component={Paper}>
      {open && (
        <MenuDrop
          employeeID={employeeID}
          anchorEl={anchorEl}
          open={open}
          handleClose={handleClose}
          handleClick={handleClick}
        />
      )}
      <Table aria-label="simple table">
        <TableHead className="bg-primaryColor">
          <TableRow className="text-white">
            <TableCell className="text-white"></TableCell>
            <TableCell className="text-white w-40 min-w-full"></TableCell>
            <TableCell className="text-white">Nome</TableCell>
            <TableCell className="text-white">Email</TableCell>
            <TableCell className="text-white">Cargo</TableCell>
            <TableCell className="text-white">Status</TableCell>
            <TableCell className="text-white">PDF</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employeesData.map((employee: Iemployees) => (
            <TableRow
              key={employee?.id}
              className="hover:bg-primaryColor/10 transition-colors"
            >
              <TableCell className="text-xl">
                <PencilSimple
                  onClick={(e: any) => handleClick(e, employee?.id)}
                  className="cursor-pointer transition-all hover:text-primaryColor"
                />
              </TableCell>
              <TableCell>
                {typeof employee?.ContactInfo?.profilePicture === 'string' ? (
                  <Image
                    width={1000}
                    height={1000}
                    className={`w-12 h-12 object-cover rounded-full`}
                    src={employee?.ContactInfo?.profilePicture}
                    alt="profile picture"
                  />
                ) : (
                  ''
                )}
              </TableCell>
              <TableCell>
                {employee?.ContactInfo?.name} {employee?.ContactInfo?.lastName}
              </TableCell>
              <TableCell className="text-xs w-2">
                {employee?.ContactInfo?.email}
              </TableCell>
              <TableCell>{employee?.employeeInfo?.role}</TableCell>
              <TableCell>
                {employee?.employeeInfo?.isFired ? 'Demitido' : 'Ativo'}
              </TableCell>
              <TableCell className="text-lg">
                {employee?.employeePDF && (
                  <Link href={employee?.employeePDF} target="_blank">
                    <FilePdf
                      className={`hover:text-primaryColor cursor-pointer`}
                    />
                  </Link>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
