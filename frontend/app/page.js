"use client";
import Image from 'next/image'
import Link from 'next/link'
import Modal from './components/Modal'
import Table from './components/Table';
import { useState } from 'react'

export default function Home() {

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900'>
      
      <div className="mt-4">
        <Table />
      </div>
    </div>
  )
}
