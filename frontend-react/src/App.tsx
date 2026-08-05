import { Routes, Route } from "react-router-dom"
import { useQuery } from "@apollo/client/react"

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Separator } from "@/components/ui/separator"

import { GET_FIRST_PROFILE } from "./graphql"
import DashboardPage from "./pages/DashboardPage"
import ProfileEditPage from "./pages/ProfileEditPage"
import WorkExperiencesPage from "./pages/WorkExperiencesPage"
import EducationsPage from "./pages/EducationsPage"
import ProjectsPage from "./pages/ProjectsPage"

export function App() {
  const { data, loading, error } = useQuery<any>(GET_FIRST_PROFILE)

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-destructive">Erreur: {error.message}</p>
      </div>
    )
  }

  const profileId = data?.getFirstProfile?.id

  if (!profileId) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-muted-foreground">Aucun profil disponible.</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            ApplyMCP
          </span>
        </header>
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<DashboardPage profileId={profileId} />} />
            <Route
              path="/profile"
              element={<ProfileEditPage profileId={profileId} />}
            />
            <Route
              path="/experiences"
              element={<WorkExperiencesPage profileId={profileId} />}
            />
            <Route
              path="/educations"
              element={<EducationsPage profileId={profileId} />}
            />
            <Route
              path="/projects"
              element={<ProjectsPage profileId={profileId} />}
            />
          </Routes>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default App
