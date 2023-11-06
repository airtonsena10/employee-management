'use client'
import { useEffect, useState } from 'react'

import Link from 'next/link'

// Material UI
import { Button } from '@mui/material'
import Header from '@/components/Header/Header'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'
import { BsGithub, BsLinkedin } from 'react-icons/bs'

export default function Home() {
  const [authUser, setAuthUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user)
        setIsLoading(false)
      } else {
        setAuthUser(null)
        setIsLoading(false)
      }
    })
    return () => {
      listen()
    }
  }, [])

  return (
    <main className="flex flex-col justify-center">
      <Header />

      <section className="flex flex-col gap-3 justify-center items-center my-10">
        <h1 className="text-5xl font-semibold text-primaryColor">Taugor</h1>
        <h2 className="text-lg font-semibold text-gray-700">
          Gerenciamento de funcionários
        </h2>

        {authUser ? (
          <div className="flex justify-around items-center w-full mt-10 gap-5">
            <div className="flex flex-col text-center gap-3">
              <h3 className="font-bold text-2xl">Bem Vindo!</h3>
              <span className="text-primaryColor">{authUser.email}</span>

              <div className="flex justify-center text-3xl gap-5">
                <Link
                  href="https://www.linkedin.com/in/airtonsena/"
                  target="_blank"
                >
                  <BsGithub className="text-gray-800 hover:text-gray-600 hover:scale-105" />
                </Link>
                <Link href="https://github.com/airtonsena10" target="_blank">
                  <BsLinkedin className="text-primaryColor hover:text-primaryColor/80 hover:scale-105" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Link href={'/login'}>
              <Button variant="outlined" type="submit" size="large">
                Entra
              </Button>
            </Link>
            <div>
              <p>
                Ou
                <Link href={'/sign-up'}>
                  <Button variant="text" type="submit" size="small">
                    Cadastre-se
                  </Button>
                </Link>
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
