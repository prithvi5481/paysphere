'use client'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import Footer from './Footer'

const Sidebar = ({user}: SiderbarProps) => {
  const pathname = usePathname();
  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        <Link href='/' 
          className='mb-12 cursor-pointer flex items-center gap-2'
        >
          <Image
            src='/icons/logo.svg'
            alt='paysphere logo'
            width={34}
            height={34}
            className='size-[24px] max-xl:size-14'
          />
        <h1 className='sidebar-logo'>Paysphere</h1>
        </Link>
        {sidebarLinks.map((link, index) => {
          const isActive = pathname === link.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              key={index}
              href={link.route}
              className={cn('sidebar-link',{'bg-blue-500': isActive})}
            >
              <div className='relative size-6'>
                <Image 
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({'brightness-[5]': isActive})}
                />
              </div>
              <p className={cn("sidebar-label", { "!text-white": isActive })}>
                {link.label}
              </p>
            </Link>
        )})}
      </nav>
      <Footer user={user}/>
    </section>
  )
}

export default Sidebar