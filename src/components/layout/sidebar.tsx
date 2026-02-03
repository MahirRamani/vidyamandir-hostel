"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bed,
  CalendarCheck,
} from "lucide-react"

interface SidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Student Registration", href: "/register-students", icon: Users },
  { name: "Student Profiles", href: "/student-profiles", icon: UserCheck },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  { name: "Departments", href: "/departments", icon: Briefcase },
  { name: "Buildings", href: "/buildings", icon: Building },
  { name: "Room Allocation", href: "/room-allocation", icon: Bed },
  { name: "Birthdays", href: "/birthdays", icon: Cake },
  { name: "ID Conversion", href: "/id-conversion", icon: RefreshCw },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-54",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-2 pr-3 border-b">
        {!collapsed && <h2 className="text-lg font-semibold">Hostel Management</h2>}
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Admin Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Administrator</p>
              <p className="text-xs text-muted-foreground truncate">Hostel Manager</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn("w-full justify-start", collapsed && "px-2")}
                  >
                    <item.icon className="h-4 w-4" />
                    {!collapsed && <span className="ml-2">{item.name}</span>}
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button variant="ghost" className={cn("w-full justify-start", collapsed && "px-2")}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  )
}