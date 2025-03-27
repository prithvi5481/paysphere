import React from 'react'
import '../globals.css'
import HeaderBox from '../components/HeaderBox'
import TotalBalanceBox from '../components/TotalBalanceBox'
import RightSidebar from '../components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'

const Home = async () => {
  const loggedIn = await getLoggedInUser();
  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome to PaySphere'
            user={loggedIn?.name  || 'Guest'}
            subtitle='PaySphere is a banking platform that allows users to make payments and transfer money.'
          />
          <TotalBalanceBox 
            accounts={[]}
            totalBanks={1}
            totalCurrentBalance={1572.34}
          />
        </header>
        RECENT TRANSACTIONS
      </div>
      <RightSidebar 
        user={loggedIn}
        transactions={[]}
        banks={[{currentBalance: 450.34, name: 'Bank 1'}, {currentBalance: 650.34, name: 'Bank 2'}]}
      />
    </section>
  )
}

export default Home