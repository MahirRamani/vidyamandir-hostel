import MainLayout from '@/components/layout/main-layout'
import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Birthdays',
  description: 'View and manage birthday information',
}

export default function Birthdays() {
    return (
        <MainLayout
            title="Birthdays"
            subtitle="Birthdays"

        >
            <div className='flex text-4xl justify-center items-center min-h-1/2'>
                You will get this feature soon
            </div>
        </MainLayout>
    )
}
