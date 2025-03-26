'use client'
import React from 'react'
import { formatAmount } from '@/lib/utils'
import CountUp from 'react-countup'
import DoughnutChart from './DoughnutChart'

const TotalBalanceBox = ({accounts, totalBanks, totalCurrentBalance}: TotalBalanceBoxProps) => {
  return (
    <section className='total-balance'>
        <div className='total-balance-chart'>
            <DoughnutChart accounts={accounts} />
        </div>
        <div className='flex flex-col gap-6'>
            <h2 className='header-2'>
                Bank Accounts: {totalBanks}
            </h2>
            <div className='flex flex-col gap-2'>
                <p>
                    Total Current Balance
                </p>
                <p className='total-balance-amount flex-center gap-2'>
                    <CountUp end={totalCurrentBalance} duration={1} decimals={2} prefix='$' separator=',' />
                    {/* {formatAmount(totalCurrentBalance)} */}
                </p>
            </div>
        </div>
    </section>
  )
}

export default TotalBalanceBox