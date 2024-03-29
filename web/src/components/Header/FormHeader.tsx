import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { House } from '@phosphor-icons/react'

export default function FormHeader() {
  return (
    <header className="flex flex-col lg:flex-row items-center justify-between ">
      <div className="flex items-center flex-col lg:flex-row ">
        <Image
          src={'/marca-taugor.png'}
          alt="logo Taugor"
          width={180}
          height={109}
          className="lg:border-r"
        />

        <div className="ml-10">
          <h3 className="text-lg font-semibold">Informação de contato</h3>
        </div>
      </div>

      <Link
        href={'/'}
        className="hidden text-xl text-gray-400 p-5 border-l lg:block"
      >
        <House className="cursor-pointer transition-all hover:text-primaryColor" />
      </Link>
    </header>
  )
}
