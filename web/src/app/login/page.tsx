'use client'

import { auth } from '../../firebase'
import { Button, TextField } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Link from 'next/link'
import Image from 'next/image'

import { useRouter } from 'next/navigation'

import React from 'react'
import { useForm } from 'react-hook-form'

export default function Login() {
  const router = useRouter()
  const { register, handleSubmit } = useForm()
  const onSubmit = (logInData: any) => {
    const { email, password } = logInData
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push('/')
      })
      .catch((error) => {
        alert('Usuário não existe!')
        console.log(error)
      })
  }

  return (
    <div className="flex flex-col justify-center items-center gap-3 h-screen">
      <Link href={'/'} className="hover:scale-105 transition-all">
        <Image
          src={'/marca-taugor.png'}
          alt="logo Taugor"
          width={180}
          height={109}
        />
      </Link>

      <h1 className="text-3xl font-semibold text-primaryColor">
        Gestão de Funcionários
      </h1>
      <p className=" text-zinc-400">
        {' '}
        Entre com suas credenciais para acessar o sistema de gestão de
        colaboradores
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 w-4/5 md:w-1/3 lg:w-1/4"
      >
        <TextField
          inputProps={{
            className: 'bg-gray-50 rounded w-full',
          }}
          required
          label="Email"
          variant="filled"
          size="small"
          type="email"
          {...register('email')}
        />
        <TextField
          inputProps={{
            className: 'bg-gray-50 rounded w-full',
          }}
          required
          label="password"
          variant="filled"
          size="small"
          type="password"
          {...register('password')}
        />

        <Button variant="outlined" type="submit">
          Entra
        </Button>
      </form>
      <div className="text-gray-400 ">
        ou
        <Link href={'/sign-up'}>
          <Button>Cadastre-se</Button>
        </Link>
      </div>
    </div>
  )
}
