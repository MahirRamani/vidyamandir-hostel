"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Building,
  Users,
  UserCheck,
  Briefcase,
  RefreshCw,
  Cake,
  BarChart3,
  Settings,
  Bed,
  CalendarCheck,
  ArrowRight,
  UserPlus,
  House,
  BriefcaseBusiness,
} from "lucide-react";

const dashboardItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "View system overview and statistics",
    color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    name: "Student Registration",
    href: "/register-students",
    icon: UserPlus,
    description: "Register new students to the hostel",
    color: "bg-green-50 hover:bg-green-100 border-green-200",
    iconColor: "text-green-600",
  },
  {
    name: "Student Profiles",
    href: "/student-profiles",
    icon: Users,
    description: "Manage and view student information",
    color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    name: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    description: "Track and manage student attendance",
    color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
    iconColor: "text-orange-600",
  },
  {
    name: "Departments",
    href: "/departments",
    icon: BriefcaseBusiness,
    description: "Manage academic departments",
    color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
    iconColor: "text-indigo-600",
  },
  {
    name: "Buildings",
    href: "/buildings",
    icon: Building,
    description: "Manage hostel buildings and structures",
    color: "bg-gray-50 hover:bg-gray-100 border-gray-200",
    iconColor: "text-gray-600",
  },
  {
    name: "Room Allocation",
    href: "/room-allocation",
    icon: House,
    description: "Assign and manage room allocations",
    color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
    iconColor: "text-pink-600",
  },
  {
    name: "Birthdays",
    href: "/birthdays",
    icon: Cake,
    description: "View upcoming student birthdays",
    color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
    iconColor: "text-yellow-600",
  },
  {
    name: "ID Conversion",
    href: "/id-conversion",
    icon: RefreshCw,
    description: "Convert and manage student IDs",
    color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
    iconColor: "text-teal-600",
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    description: "Generate and view system reports",
    color: "bg-red-50 hover:bg-red-100 border-red-200",
    iconColor: "text-red-600",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Configure system settings",
    color: "bg-slate-50 hover:bg-slate-100 border-slate-200",
    iconColor: "text-slate-600",
  },
];

export function DashboardTiles() {
  return (
    <div className="p-6 py-3">
      <div className="mb-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Hostel Management System
        </h1>
        <p className="text-gray-600">Select a module</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <div
              className={`
              relative p-7 rounded-2xl border-2 transition-all duration-300 cursor-pointer
              transform hover:scale-[1.02] hover:shadow-xl group min-h-[180px] flex
              ${item.color}
            `}
            >
              <div className="flex items-start">
                <div
                  className={`p-3 rounded-lg mb-4 mr-4 ${item.iconColor} bg-white shadow-sm`}
                >
                  <item.icon className="h-28 w-28" />
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-2xl font-semibold text-gray-900 mt-2 mb-2 group-hover:text-gray-800">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 mb-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 mt-auto">
                  <span>Open</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div> */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// "use client"
// import Link from "next/link"
// import {
//   LayoutDashboard,
//   Building,
//   Users,
//   UserCheck,
//   Briefcase,
//   RefreshCw,
//   Cake,
//   BarChart3,
//   Settings,
//   Bed,
//   CalendarCheck,
//   ArrowRight
// } from "lucide-react"

// const dashboardItems = [
//   {
//     name: "Dashboard",
//     href: "/dashboard",
//     icon: LayoutDashboard,
//     description: "View system overview and statistics",
//     color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
//     iconColor: "text-blue-600"
//   },
//   {
//     name: "Student Registration",
//     href: "/register-students",
//     icon: Users,
//     description: "Register new students to the hostel",
//     color: "bg-green-50 hover:bg-green-100 border-green-200",
//     iconColor: "text-green-600"
//   },
//   {
//     name: "Student Profiles",
//     href: "/student-profiles",
//     icon: UserCheck,
//     description: "Manage and view student information",
//     color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
//     iconColor: "text-purple-600"
//   },
//   {
//     name: "Attendance",
//     href: "/attendance",
//     icon: CalendarCheck,
//     description: "Track and manage student attendance",
//     color: "bg-orange-50 hover:bg-orange-100 border-orange-200",
//     iconColor: "text-orange-600"
//   },
//   {
//     name: "Departments",
//     href: "/departments",
//     icon: Briefcase,
//     description: "Manage academic departments",
//     color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200",
//     iconColor: "text-indigo-600"
//   },
//   {
//     name: "Buildings",
//     href: "/buildings",
//     icon: Building,
//     description: "Manage hostel buildings and structures",
//     color: "bg-gray-50 hover:bg-gray-100 border-gray-200",
//     iconColor: "text-gray-600"
//   },
//   {
//     name: "Room Allocation",
//     href: "/room-allocation",
//     icon: Bed,
//     description: "Assign and manage room allocations",
//     color: "bg-pink-50 hover:bg-pink-100 border-pink-200",
//     iconColor: "text-pink-600"
//   },
//   {
//     name: "Birthdays",
//     href: "/birthdays",
//     icon: Cake,
//     description: "View upcoming student birthdays",
//     color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200",
//     iconColor: "text-yellow-600"
//   },
//   {
//     name: "ID Conversion",
//     href: "/id-conversion",
//     icon: RefreshCw,
//     description: "Convert and manage student IDs",
//     color: "bg-teal-50 hover:bg-teal-100 border-teal-200",
//     iconColor: "text-teal-600"
//   },
//   {
//     name: "Reports",
//     href: "/reports",
//     icon: BarChart3,
//     description: "Generate and view system reports",
//     color: "bg-red-50 hover:bg-red-100 border-red-200",
//     iconColor: "text-red-600"
//   },
//   {
//     name: "Settings",
//     href: "/settings",
//     icon: Settings,
//     description: "Configure system settings",
//     color: "bg-slate-50 hover:bg-slate-100 border-slate-200",
//     iconColor: "text-slate-600"
//   }
// ]

// export function DashboardTiles() {
//   return (
//     <div className="p-6">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Hostel Management System</h1>
//         <p className="text-gray-600">Select a module to get started</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {dashboardItems.map((item) => (
//           <Link key={item.name} href={item.href}>
//             <div className={`
//               relative p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer
//               transform hover:scale-105 hover:shadow-lg group
//               ${item.color}
//             `}>
//               <div className="flex flex-col items-start">
//                 <div className={`p-3 rounded-lg mb-4 ${item.iconColor} bg-white shadow-sm`}>
//                   <item.icon className="h-6 w-6" />
//                 </div>

//                 <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
//                   {item.name}
//                 </h3>

//                 <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//                   {item.description}
//                 </p>

//                 <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900 mt-auto">
//                   <span>Open</span>
//                   <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
//                 </div>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>

//       {/* Quick Stats Section */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Users className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-600">Total Students</p>
//               <p className="text-2xl font-bold text-gray-900">1,234</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <Building className="h-5 w-5 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-600">Buildings</p>
//               <p className="text-2xl font-bold text-gray-900">8</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Bed className="h-5 w-5 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-600">Rooms Available</p>
//               <p className="text-2xl font-bold text-gray-900">42</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <div className="flex items-center">
//             <div className="p-2 bg-orange-100 rounded-lg">
//               <CalendarCheck className="h-5 w-5 text-orange-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm text-gray-600">Attendance Rate</p>
//               <p className="text-2xl font-bold text-gray-900">94%</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
