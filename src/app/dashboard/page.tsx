import { DashboardTiles } from '@/components/layout/dashboard'
import MainLayout from '@/components/layout/main-layout'
import React from 'react'

export default function Dashboard() {
    return (
        // <MainLayout
        //     title="Dashboard"
        //     subtitle="Dashboard"

        // >
        //     {/* <div className='flex text-4xl justify-center items-center min-h-1/2'>
        //         You will get this feature soon
        //     </div> */}
        // </MainLayout>
        <DashboardTiles />
    )
}
