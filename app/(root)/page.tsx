import React from 'react'
import '../globals.css'
import HeaderBox from '../components/HeaderBox'
import TotalBalanceBox from '../components/TotalBalanceBox'
import RightSidebar from '../components/RightSidebar'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { getAccount, getAccounts } from '@/lib/actions/bank.actions'
import RecentTransactions from '../components/RecentTransactions'

const Home = async ({searchParams: {id, page}} : SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ userId: loggedIn.$id})
  const currentPage = Number(page as string) || 1;

  if(!accounts) return;
  const accountsData = accounts?.data;
  const appwriteItemId = (id as string) || accounts?.data[0]?.appwriteItemId;

  const account = await getAccount({appwriteItemId});

  console.log({
    accountsData,
    account
  })

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type='greeting'
            title='Welcome to PaySphere'
            user={`${loggedIn.firstName} ${loggedIn.lastName}`  || 'Guest'}
            subtitle='PaySphere is a banking platform that allows users to make payments and transfer money.'
          />
          <TotalBalanceBox 
            accounts={accounts.data}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </header>
        <RecentTransactions 
          accounts={accounts?.data}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>
      <RightSidebar 
        user={loggedIn}
        transactions={account.transactions}
        banks={accounts?.data.slice(0,2)}
      />
    </section>
  )
}

export default Home