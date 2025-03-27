import { logoutAccount } from '@/lib/actions/user.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Footer = ({user} : FooterProps) => {
  const router = useRouter();
  const handleLogout = async () => {
    const loggedOutUser = await logoutAccount();
    if(loggedOutUser){
      router.push('/sign-in')
    }
  }
  return (
    <footer className='footer'>
      <div className='footer_name'>
        <p className='text-xl font-bold text-gray-600'>
          {user.name[0].toUpperCase()}
        </p>
      </div>
      <div className='footer_email'>
        <h1 className='text-14 truncate text-gray-800 font-semibold'>
          {user.name}
        </h1>
        <p className='text-14 truncate font-ibm-plex-serif text-gray-800'>
          {user.email}
        </p>
      </div>
      <div className='footer_image'
        onClick={handleLogout}
      >
        <Image
          src='/icons/logout.svg'
          alt='logout'
          fill
        />
      </div>
    </footer>
  )
}

export default Footer