import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className='logo'>
            <Image
                src="/icons/logo.png"
                alt='logo'
                width={24}
                height={24}
            />
            <p>DevEvents</p>

            </Link>
            <ul>
             <Link href="/">Home</Link>
             <Link href="#event">Events</Link>
             <Link href="#create">Create Event</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar