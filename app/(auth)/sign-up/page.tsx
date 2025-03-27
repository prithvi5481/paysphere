import AuthForm from '@/app/components/AuthForm'
import { getLoggedInUser } from '@/lib/actions/user.actions'
import React from 'react'

const SignUp = async () => {
  const loggedInUser = await getLoggedInUser();
  console.log('loggedInUser', loggedInUser); // Log the user info on the server
  return (
    <section className='flex-center max-sm:px-6 size-full'>
      <AuthForm type='sign-up'/>
    </section>
  )
}

export default SignUp