"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      state: "",
      postalCode: "",
      dateOfBirth: "",
      ssn: ""
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // sign up with appwrite and create plain link
      if(type === 'sign-up'){
        // const newUser = await signUp(data);
        // setUser(newUser)
      }
      if(type === 'sign-in'){
        // const response = await signIn({ email: data.email, password: data.password })
        // if(response){
        //   router.push('/');
        // }
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="paysphere logo"
            width={34}
            height={34}
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold">Paysphere</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h2 className="text-24 lg:text-32 font-semibold text-gray-800">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to get started"
                : "Please enter your details below"}
            </p>
          </h2>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">PlaidLink</div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col gap-4">
              {
                type === 'sign-up' && (
                  <>
                  <div className="flex justify-between gap-2">
                    <CustomInput
                      form={form}
                      label="First Name"
                      placeholder="Enter your first name"
                      name="firstName"
                    />
                    <CustomInput
                      form={form}
                      label="Last Name"
                      placeholder="Enter your last name"
                      name="lastName"
                    />
                  </div>
                    <CustomInput
                      form={form}
                      label="Address"
                      placeholder="Enter your address"
                      name="address"
                    />
                    <CustomInput
                      form={form}
                      label="City"
                      placeholder="Enter your city"
                      name="city"
                    />
                    <div className="flex justify-between gap-4">
                      <CustomInput
                        form={form}
                        label="state"
                        placeholder="ex: NY"
                        name="state"
                      />
                      <CustomInput
                        form={form}
                        label="Postal Code"
                        placeholder="ex: 324833"
                        name="postalCode"
                      />
                    </div>
                    <div className='flex justify-between gap-4'>
                      <CustomInput
                        form={form}
                        label="Date of Birth"
                        placeholder="yyyy-mm-dd"
                        name="dateOfBirth"
                      />
                      <CustomInput
                        form={form}
                        label="SSN"
                        placeholder="ex: 2925"
                        name="ssn"
                      />
                    </div>
                  </>
                )
              }
              <CustomInput
                form={form}
                label="Email"
                placeholder="Enter your email"
                name="email"
              />
              <CustomInput
                form={form}
                label="Password"
                placeholder="Enter your password"
                name="password"
              />
              <Button type="submit" disabled={isLoading} className="form-btn">
                {
                  isLoading 
                  ?
                  <>
                    <Loader className="animate-spin"/> Loading...
                  </>
                  : type === 'sign-in'
                  ?
                  'Sign In'
                  : 
                  'Sign Up'
                }
              </Button>
            </form>
          </Form>

          <footer className="flex justify-center gap-1">
            <p className="text-14 font-normal text-gray-600">
              {
                type === 'sign-in'
                ? "Don't have an account?"
                : "Already have an account?"
              }
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : 'sign-in'}
              className="form-link"
            >
              {type === 'sign-in' ? 'Sign Up' : 'Sign In'}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
