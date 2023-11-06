'use client'
import FormHeader from '@/components/Header/FormHeader'
import React, { ChangeEvent, useState } from 'react'

import {
  PencilSimple,
  UserCircle,
  Lightbulb,
  ToggleLeft,
  ArrowUp,
  User,
} from '@phosphor-icons/react'

import { Box, Button } from '@mui/material'

import { useForm, SubmitHandler } from 'react-hook-form'

import { Iemployees } from '@/Iemployees'
import axios from 'axios'
import ModalCreateemployee from '@/components/Modals/ModalCreateEmployee'

import { storage } from '@/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

// uuid
import { v4 } from 'uuid'

import employeeA4 from '@/components/employeeA4'

// gerar PDF
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import { getStates } from '@brazilian-utils/brazilian-utils'
import Image from 'next/image'

const initialemployeeState: Iemployees = {
  ContactInfo: {
    name: '',
    lastName: '',
    email: '',
    gender: '',
    address: {
      cep: '',
      logradouro: '',
      number: 0,
      uf: '',
    },
    phone: '',
    profilePicture: null,
    birthday: new Date(),
  },
  employeeInfo: {
    role: '',
    admissioDate: new Date(),
    sector: '',
    salary: 0,
  },
  employeePDF: '',
  histories: {
    user: '',
  },
}

export default function Regsiter() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Iemployees>()

  const ufs = getStates()

  // criar employee
  const [employee, setemployee] = useState<Iemployees>(initialemployeeState)
  const createemployee = async (employeeData: Iemployees) => {
    try {
      if (process.env.NEXT_PUBLIC_API_KEY) {
        const response = await axios.post<Iemployees>(
          process.env.NEXT_PUBLIC_API_KEY,
          {
            ContactInfo: {
              name: employeeData.ContactInfo.name,
              lastName: employeeData.ContactInfo.lastName,
              email: employeeData.ContactInfo.email,
              gender: employeeData.ContactInfo.gender,
              address: {
                cep: employeeData.ContactInfo.address.cep,
                logradouro: employeeData.ContactInfo.address.logradouro,
                number: Number(employeeData.ContactInfo.address.number),
                uf: employeeData.ContactInfo.address.uf,
              },
              phone: employeeData.ContactInfo.phone,
              profilePicture: pictureURL,
              birthday: employeeData.ContactInfo.birthday,
            },
            employeeInfo: {
              role: employeeData.employeeInfo.role,
              admissioDate: employeeData.employeeInfo.admissioDate,
              sector: employeeData.employeeInfo.sector,
              salary: Number(employeeData.employeeInfo.salary),
            },
            employeePDF: employeePdfUrl,
          },
        )
        return response
      }
    } catch (error) {
      alert('Error ao Criar Funcionário')
      console.log(error)
    }
  }

  const onSubmit: SubmitHandler<Iemployees> = (employeeData: Iemployees) => {
    setemployee(employeeData)
    uploadImage()
    generateAndUploadPdf()
    handleOpen()
  }

  const syncronizeWithDocument = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const nameKeys = name.split('.')
    if (nameKeys.length === 1) {
      setemployee((prevState) => ({
        ...prevState,
        ContactInfo: {
          ...prevState.ContactInfo,
          [name]: value,
        },
      }))
    } else if (nameKeys.length === 2) {
      const [parent, child] = nameKeys
      setemployee((prevState) => ({
        ...prevState,
        [parent]: {
          // @ts-ignore
          ...prevState[parent as keyof typeof prevState],
          [child]: value,
        },
      }))
    } else if (nameKeys.length === 3) {
      const [parent, child, subChild] = nameKeys
      setemployee((prevState) => ({
        ...prevState,
        [parent]: {
          // @ts-ignore
          ...prevState[parent as keyof typeof prevState],
          [child]: {
            // @ts-ignore
            ...prevState[parent as keyof typeof prevState][child],
            [subChild]: value,
          },
        },
      }))
    }
  }

  // modal
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  // selecionar imagem
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isRounded, setIsRounded] = useState<boolean>(false)
  const [pictureURL, setPictureURL] = useState<string>('')
  function handleSelectedPicture(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const picture = e.target.files[0]
      setemployee((prev) => ({
        ...prev,
        ContactInfo: {
          ...prev.ContactInfo,
          profilePicture: picture,
        },
      }))

      if (picture) {
        const imageUrl = URL.createObjectURL(picture)
        setSelectedImage(imageUrl)
      }
    }
  }
  const uploadImage = async () => {
    if (
      employee.ContactInfo.profilePicture &&
      typeof employee.ContactInfo.profilePicture !== 'string'
    ) {
      const picture: File = employee.ContactInfo.profilePicture
      const imageRef = ref(storage, `profile-pictures/${picture + v4()}`)
      await uploadBytes(imageRef, picture)
      const pictureURL = await getDownloadURL(imageRef)
      setPictureURL(pictureURL)
    }
  }

  const handleRounded = () => {
    setIsRounded((prev) => !prev)
  }

  // gerar PDF
  // const [pdfData, setPdfData] = useState<Blob | null>(null);
  const [employeePdfUrl, setemployeePDFUrl] = useState<string>('')
  const generateAndUploadPdf = async () => {
    if (!employee) {
      return
    }

    const input = document.getElementById('document')
    if (input) {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const inputWidthPx = input.offsetWidth
      const inputHeightPx = input.offsetHeight

      const pdfWidthMm = 210
      const pdfHeightMm = pdfWidthMm * (inputHeightPx / inputWidthPx)

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        width: inputWidthPx,
        height: inputHeightPx,
      })

      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm)
      const pdfData = pdf.output('blob')
      if (pdfData) {
        const pdfRef = ref(
          storage,
          `employees-pdf/${employee.ContactInfo.name}${employee.ContactInfo.lastName}.pdf` +
            v4(),
        )
        await uploadBytes(pdfRef, pdfData)
        const pdfURL = await getDownloadURL(pdfRef)
        setemployeePDFUrl(pdfURL)
      }
    }
  }

  return (
    <div>
      <FormHeader />
      <div className="w-full h-2 bg-gray-200"></div>

      <main className=" p-3 md:p-10 w-full flex flex-col lg:flex-row lg:gap-5 lg:p-10 lg:max-w-7xl lg:mx-auto">
        <section className="lg:w-1/2 my-3 md:my-0">
          <h1 className="text-xl font-bold">Fale-nos um pouco sobre você</h1>
          <p className="text-sm text-gray-500">
            Diga quem você é, como os empregadores podem entrar em contato com
            você e qual a sua profissão.
          </p>

          <div className="flex items-center gap-3 my-5">
            <h2 className="text-xl font-bold">Informação de contato</h2>
            <PencilSimple className="text-gray-400 text-lg" />
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center w-full gap-5 "
          >
            <div className="flex flex-col md:flex-row md:gap-5 w-full">
              <div className="flex flex-col lg:gap-5 lg:w-1/2">
                <div className="w-full flex flex-col">
                  <div className="flex flex-col w-full">
                    <input
                      {...register('ContactInfo.name', { required: true })}
                      type="text"
                      className="input bg-slate-100 rounded"
                      placeholder="Nome"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.ContactInfo?.name && (
                      <span className="text-red-500 text-xs">
                        Nome é obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">ex: Tiago</p>
                </div>
                <div className="w-full flex flex-col">
                  <div className="flex flex-col w-full">
                    <input
                      {...register('ContactInfo.lastName', { required: false })}
                      type="text"
                      className="input  bg-slate-100 rounded"
                      placeholder="Sobrenome"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.ContactInfo?.lastName && (
                      <span className="text-red-500 text-xs">
                        Sobrenome é obrigatório
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">ex: Souza</p>
                </div>
              </div>

              {/* FOTO DE PERFIL */}
              <div className="flex flex-col md:flex-row justify-center  lg:gap-3 lg:w-1/2">
                <div
                  className={`${
                    selectedImage ? '' : 'px-5 py-10 bg-gray-50'
                  } h-full flex justify-center items-center  rounded-md`}
                >
                  {selectedImage ? (
                    <div className="flex flex-col gap-3">
                      <Image
                        width={1000}
                        height={1000}
                        src={selectedImage}
                        alt="Selected"
                        className={`h-40 w-40 object-cover ${
                          isRounded ? 'rounded-full' : ''
                        }`}
                      />
                      <div className="flex items-center gap-3">
                        {isRounded ? (
                          <ToggleLeft
                            onClick={handleRounded}
                            className="text-3xl text-primaryColor cursor-pointer rotate-180"
                          />
                        ) : (
                          <ToggleLeft
                            onClick={handleRounded}
                            className="text-3xl text-gray-400 cursor-pointer"
                          />
                        )}
                        <p className="text-sm">Foto Redonda</p>
                      </div>
                    </div>
                  ) : (
                    <UserCircle className="text-gray-400 text-6xl" />
                  )}
                </div>
                <div>
                  {selectedImage ? (
                    <></>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-3">
                        <p className="">Foto do Perfil</p>
                        <div className="rounded-full p-1 bg-gray-200">
                          <Lightbulb className="text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor="upload-photo"
                          className="flex items-center gap-3"
                        >
                          <div className="rounded-full p-1 bg-blue-500 cursor-pointer hover:bg-blue-300 transition-colors">
                            <ArrowUp className="text-white " />
                          </div>
                        </label>
                        <p className="text-sm">Adicionar Foto</p>
                        <input
                          type="file"
                          id="upload-photo"
                          // @ts-ignore
                          onChangeCapture={(e) => handleSelectedPicture(e)}
                          style={{ display: 'none' }}
                          {...register('ContactInfo.profilePicture')}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <div className="w-full flex flex-col">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex flex-col w-full text-gray-500">
                    <input
                      {...register('employeeInfo.role', { required: true })}
                      type="text"
                      className={`input  bg-slate-100 rounded  `}
                      placeholder="Cargo"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.employeeInfo?.role && (
                      <span className="text-red-500 text-xs">
                        Cargo é obrigatório
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col w-full">
                    <input
                      {...register('employeeInfo.sector', { required: true })}
                      type="text"
                      className="input w-full  bg-slate-100 rounded"
                      placeholder="Setor"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.employeeInfo?.sector && (
                      <span className="text-red-500 text-xs">
                        Setor é obrigatório
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col w-fulL">
                    <input
                      {...register('employeeInfo.salary', {
                        required: true,
                        valueAsNumber: true,
                      })}
                      type="number"
                      className="input w-full bg-slate-100 rounded"
                      placeholder="Salário"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.employeeInfo?.salary && (
                      <span className="text-red-500 text-xs">
                        Salário é obrigatório
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">ex: Coordenador</p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <div className="flex flex-col md:flex-row gap-3 w-full">
                  <div className="flex flex-col w-full">
                    <input
                      {...register('ContactInfo.address.cep', {
                        required: true,
                      })}
                      type="text"
                      className="input w-full  bg-slate-100 rounded"
                      placeholder="CEP"
                      onChange={syncronizeWithDocument}
                    />
                    {errors.ContactInfo?.address?.cep && (
                      <span className="text-red-500 text-xs">
                        CEP é obrigatório
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col w-full">
                      <input
                        {...register('ContactInfo.address.number', {
                          required: true,
                          valueAsNumber: true,
                        })}
                        type="number"
                        className="input w-full  bg-slate-100 rounded"
                        placeholder="Número"
                        onChange={syncronizeWithDocument}
                      />
                      {errors.ContactInfo?.address?.number && (
                        <span className="text-red-500 text-xs">
                          Número é obrigatório
                        </span>
                      )}
                    </div>

                    {/* @ts-ignore */}
                    <select
                      {...register('ContactInfo.address.uf', {
                        required: true,
                      })}
                      type="text"
                      className="input w-full  bg-slate-100 rounded"
                      placeholder="Gênero"
                      onChange={syncronizeWithDocument}
                    >
                      <option value="">-- Selecione</option>
                      {ufs.map((uf) => (
                        <option key={uf.code.toString()} value={uf.code}>
                          {uf.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <input
                    {...register('ContactInfo.address.logradouro', {
                      required: true,
                    })}
                    type="text"
                    className="input  bg-slate-100 rounded"
                    placeholder="Logradouro"
                    onChange={syncronizeWithDocument}
                  />
                  {errors.ContactInfo?.address?.logradouro && (
                    <span className="text-red-500 text-xs">
                      Logadouro é obrigatório
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  ex: Rua 5 de Gotham City
                </p>
              </div>

              <div className="flex flex-col justify-center w-full gap-3">
                <div className="flex flex-col gap-3">
                  <div className="w-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="flex flex-col w-full">
                        <input
                          {...register('ContactInfo.phone', { required: true })}
                          type="text"
                          className="input w-full  bg-slate-100 rounded"
                          placeholder="Telefone"
                          onChange={syncronizeWithDocument}
                        />
                        {errors.ContactInfo?.phone && (
                          <span className="text-red-500 text-xs">
                            Telefone é obrigatório
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col w-full">
                        <input
                          {...register('ContactInfo.email', { required: true })}
                          type="email"
                          className="input w-full  bg-slate-100 rounded"
                          placeholder="Email"
                          onChange={syncronizeWithDocument}
                        />
                        {errors.ContactInfo?.email && (
                          <span className="text-red-500 text-xs">
                            Email é obrigatório
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col w-full">
                        {/* @ts-ignore */}
                        <select
                          {...register('ContactInfo.gender', {
                            required: true,
                          })}
                          type="text"
                          className="input w-full  bg-slate-100 rounded"
                          placeholder="Gênero"
                          onChange={syncronizeWithDocument}
                        >
                          <option value="">-- Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                        </select>
                        {errors.ContactInfo?.gender && (
                          <span className="text-red-500 text-xs">
                            Gênero é obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">ex: Souza</p>
                  </div>
                  <div className="w-full flex flex-col">
                    <div className="flex gap-3">
                      <div className="flex flex-col w-full">
                        <input
                          {...register('employeeInfo.admissioDate', {
                            required: true,
                          })}
                          type="date"
                          className="input w-full  bg-slate-100 rounded"
                          placeholder="Data de Admissão"
                          onChange={syncronizeWithDocument}
                        />
                        {errors.employeeInfo?.admissioDate && (
                          <span className="text-red-500 text-xs">
                            Data de Admissão é obrigatório
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col w-full text-gray-500">
                        <input
                          {...register('ContactInfo.birthday', {
                            required: true,
                          })}
                          type="date"
                          className="input w-full  bg-slate-100 rounded"
                          placeholder="Data de Nascimento  bg-slate-100 rounded"
                          onChange={syncronizeWithDocument}
                        />
                        {errors.ContactInfo?.birthday && (
                          <span className="text-red-500 text-xs">
                            Data de Nascimento é obrigatório
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">ex: Souza</p>
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" variant="outlined">
              Salvar
            </Button>
          </form>
        </section>

        {/* @ts-ignore */}
        <employeeA4
          employee={employee}
          profilePicture={selectedImage}
          isRounded={isRounded}
        />
      </main>
      {open && pictureURL != '' && employeePdfUrl != '' && (
        <ModalCreateemployee
          employee={employee}
          createemployee={createemployee}
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
        />
      )}
    </div>
  )
}
