import { Iemployees } from '@/Iemployees'
import React, { useEffect, useRef, useState } from 'react'

// gerar PDF
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Image from 'next/image'

type Props = {
  employee: Iemployees
  profilePicture: string
  isRounded: boolean
}

export default function employeeA4({
  employee,
  profilePicture,
  isRounded,
}: Props) {
  const [employeeToRender, setemployeeToRender] = useState<Iemployees>(employee)

  useEffect(() => {
    setemployeeToRender(employee)
  }, [employee])
  return (
    <section className="bg-gray-100 flex justify-center items-center lg:w-1/2">
      <div
        className="bg-white a4 shadow-lg rounded-sm p-10 flex flex-col gap-3"
        id="document"
      >
        <div className="without-border-top px-3 pb-5 flex flex-col gap-5">
          {profilePicture && (
            <div className="flex justify-center items-center">
              <Image
                width={1000}
                height={1000}
                className={`w-40 h-40 object-cover ${
                  isRounded ? 'rounded-full' : ''
                }`}
                src={profilePicture}
                alt="profile picture"
              />
            </div>
          )}
          <div>
            <h1 className="text-blue-600 text-xl font-bold">
              {employeeToRender?.ContactInfo?.name}{' '}
              {employeeToRender?.ContactInfo?.lastName}
            </h1>
            <p className="text-xs text-gray-500">
              Telefone: {employeeToRender?.ContactInfo?.phone}
            </p>
            <p className="text-xs text-gray-500">
              Email: {employeeToRender?.ContactInfo?.email}
            </p>
            <p className="text-xs text-gray-500">Aniversário: 25/12/2001</p>
          </div>
        </div>
        <div className="border border-primaryColor px-3 pb-5">
          <h1 className="text-blue-600 text-xl font-bold">Profissional:</h1>
          <p className="text-xs text-gray-500">
            Cargo: {employeeToRender?.employeeInfo?.role}
          </p>
          <p className="text-xs text-gray-500">
            Setor: {employeeToRender?.employeeInfo?.sector}
          </p>
          <p className="text-xs text-gray-500">
            Salário: {employeeToRender?.employeeInfo?.salary}
          </p>
        </div>
        <div className="border border-primaryColor px-3 pb-5">
          <h1 className="text-blue-600 text-xl font-bold">Endereço:</h1>
          <p className="text-xs text-gray-500">
            CEP: {employeeToRender?.ContactInfo?.address?.cep}
          </p>
          <p className="text-xs text-gray-500">
            Número: {employeeToRender?.ContactInfo?.address?.number}
          </p>
          <p className="text-xs text-gray-500">
            UF: {employeeToRender?.ContactInfo?.address?.uf}
          </p>
        </div>
      </div>
    </section>
  )
}
