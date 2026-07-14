import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Profil", url: "/profile", icon: User },
  { title: "Expériences", url: "/experiences", icon: Briefcase },
  { title: "Diplômes", url: "/educations", icon: GraduationCap },
  { title: "Projets", url: "/projects", icon: FolderGit2 },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor
  const themeLabel =
    theme === "dark" ? "Sombre" : theme === "light" ? "Clair" : "Système"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate text-base font-semibold text-foreground">
              ApplyMCP
            </span>
            <span className="truncate text-xs text-muted-foreground">
              Gestion de CV
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname === item.url}
                    render={<NavLink to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={`Thème: ${themeLabel}`}
              onClick={cycleTheme}
            >
              <ThemeIcon />
              <span>Thème: {themeLabel}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
