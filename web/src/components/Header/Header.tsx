import { Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

import { House } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [authUser, setAuthUser] = useState<User | null>(null)

  const router = useRouter()

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user)
      } else {
        setAuthUser(null)
      }
    })
    return () => {
      listen()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between shadow-sm">
      <div className="flex items-center flex-col lg:flex-row ">
        <Link href={'/'} className="hover:scale-105 transition-all">
          <Image
            src={'/marca-taugor.png'}
            alt="logo Taugor"
            width={180}
            height={109}
          />
        </Link>
      </div>

      <div className="flex justify-center items-center gap-5">
        {authUser && (
          <>
            <Button className="hover:scale-105 transition-all">
              <Link href={'/Register'}>Cadastrar Funcinário</Link>
            </Button>
            <Button className="hover:scale-105 transition-all">
              <Link href={'/list'}>Listar Funcinário</Link>
            </Button>
            <Button
              className="hover:scale-105 transition-all"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </>
        )}
      </div>

      <Link href={'/'} className="hidden text-xl text-gray-400 p-5 md:block">
        <House className="cursor-pointer transition-all hover:text-primaryColor hover:scale-105" />
      </Link>
    </header>
  )
}
