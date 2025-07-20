"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface HeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
  actions?: React.ReactNode
}

export function Header({ title, subtitle, onMenuClick, actions }: HeaderProps) {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center space-x-4">{actions}</div>
    </header>
  )
}
