"use client"

import { Button } from "@/components/ui/button"

interface OpenExternalDashboardProps {
  integration: "supabase"
}

export const OpenExternalDashboard = ({ integration }: OpenExternalDashboardProps) => {
  const getDashboardUrl = () => {
    switch (integration) {
      case "supabase":
        return process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/project/${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}/database/tables`
          : null
      default:
        return null
    }
  }

  const dashboardUrl = getDashboardUrl()

  if (!dashboardUrl) {
    return <div>Dashboard URL not configured.</div>
  }

  return (
    <Button asChild>
      <a href={dashboardUrl} target="_blank" rel="noopener noreferrer">
        Open Supabase Dashboard
      </a>
    </Button>
  )
}

