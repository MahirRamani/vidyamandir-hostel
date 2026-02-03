"use client"
import MainLayout from '@/components/layout/main-layout'
import { Metadata } from 'next'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// export const metadata: Metadata = {
//   title: 'Attendance',
//   description: 'View and manage attendance information',
// }

interface AttendanceDay {
  date: number
  status: 'present' | 'absent' | 'late' | 'leave' | 'holiday' | 'not-yet' | 'blocked'
}

const statusConfig = {
  present: { label: 'Present', color: 'bg-teal-500 hover:bg-teal-600', textColor: 'text-white' },
  absent: { label: 'Absent', color: 'bg-red-500 hover:bg-red-600', textColor: 'text-white' },
  late: { label: 'Late/Defaulter', color: 'bg-pink-500 hover:bg-pink-600', textColor: 'text-white' },
  leave: { label: 'Leave', color: 'bg-orange-500 hover:bg-orange-600', textColor: 'text-white' },
  holiday: { label: 'Holiday', color: 'bg-blue-500 hover:bg-blue-600', textColor: 'text-white' },
  'not-yet': { label: 'Not Yet', color: 'bg-yellow-500 hover:bg-yellow-600', textColor: 'text-black' },
  blocked: { label: 'Blocked', color: 'bg-gray-500 hover:bg-gray-600', textColor: 'text-white' },
}

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate()
}

const generateAttendanceData = (month: number, year: number): AttendanceDay[] => {
  const daysInMonth = getDaysInMonth(month, year)
  const data: AttendanceDay[] = []
  
  for (let i = 1; i <= daysInMonth; i++) {
    // Sample data - in real app this would come from API
    let status: AttendanceDay['status']
    if (i <= 10) status = 'present'
    else if (i <= 15) status = 'absent' 
    else if (i <= 20) status = 'late'
    else if (i <= 25) status = 'leave'
    else if (i <= 28) status = 'holiday'
    else status = 'not-yet'
    
    data.push({ date: i, status })
  }
  
  return data
}

export default function Attendance() {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  
  const attendanceData = generateAttendanceData(selectedMonth, selectedYear)
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  return (
    <MainLayout
      title="Attendance"
      subtitle="Employee Attendance Management"
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-semibold">MR</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Mahir M Ramani</h3>
            <div className="flex gap-2 mt-1">
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">Emp ID: EMP001</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">Tech - Computer</Badge>
            </div>
          </div>
        </div>

        {/* Month Navigation and Penalties */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex gap-1">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={selectedMonth === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMonth(index)}
                  className={`text-xs ${selectedMonth === index ? 'bg-teal-500 hover:bg-teal-600' : ''}`}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Penalties and Actions */}
          <div className="flex gap-2">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
              Penalty
            </Badge>
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              ₹ 320 + 320
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              Exemption
            </Badge>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 items-center">
          {Object.entries(statusConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1">
              <div className={`w-4 h-4 rounded ${config.color}`}></div>
              <span className="text-sm">{config.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">
            {months[selectedMonth]} {selectedYear}
          </h4>
          
          {/* Date Headers */}
          <div className="grid grid-cols-31 gap-1 text-center text-sm font-medium">
            {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => (
              <div key={i + 1} className="p-1">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Attendance Grid */}
          <div className="grid grid-cols-31 gap-1">
            {attendanceData.map((day) => {
              const config = statusConfig[day.status]
              return (
                <Button
                  key={day.date}
                  variant="outline"
                  size="sm"
                  className={`h-8 w-8 p-0 ${config.color} ${config.textColor} border-none`}
                >
                  {day.date}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Session Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">
            <span className="font-semibold">Morning Sabha:</span> 7 &nbsp;
            <span className="font-semibold">Evening Sabha:</span> 3 &nbsp;
            <span className="font-semibold">Lunch:</span> 8 &nbsp;
            <span className="font-semibold">Dinner:</span> 6 &nbsp;
            <span className="font-semibold">Chesta:</span> 31
          </div>
        </div>
      </div>
    </MainLayout>
  )
}