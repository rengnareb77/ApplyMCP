import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@apollo/client/react"
import { GET_PERSON } from "../graphql"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Link2,
  Code2,
  Globe,
  Phone,
  MapPin,
  Calendar,
  Mail,
  ChevronRight,
} from "lucide-react"

interface DashboardPageProps {
  profileId: string
}

interface Skill {
  name: string
  type: string
}

export default function DashboardPage({ profileId }: DashboardPageProps) {
  const { data, loading, error } = useQuery<any>(GET_PERSON, {
    variables: { id: profileId },
  })

  const profile = data?.getPerson

  const allSkills = useMemo(() => {
    if (!profile) return {}

    const skills: Skill[] = []
    if (profile.workExperiences) {
      profile.workExperiences.forEach((exp: any) => {
        if (exp.skills) skills.push(...exp.skills)
      })
    }
    if (profile.projects) {
      profile.projects.forEach((proj: any) => {
        if (proj.skills) skills.push(...proj.skills)
      })
    }

    return skills.reduce(
      (acc, skill) => {
        const { type, name } = skill
        if (!acc[type]) acc[type] = []
        if (!acc[type].includes(name)) acc[type].push(name)
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [profile])

  if (loading)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  if (error)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-destructive">Erreur: {error.message}</p>
      </div>
    )
  if (!profile)
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Profil non trouvé</p>
      </div>
    )

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      {/* Banner / Header Compact */}
      <Card className="border-muted bg-muted/10">
        <CardContent className="p-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {profile.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-4" />
                    {profile.email}
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-4" />
                    {profile.phoneNumber}
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-4" />
                    {profile.address}
                  </div>
                )}
                {profile.birthDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    {profile.birthDate}
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Alignés à droite */}
            {(profile.linkedinUrl ||
              profile.githubUrl ||
              profile.portfolioUrl) && (
              <div className="flex flex-wrap items-center gap-2">
                {profile.linkedinUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    render={
                      <a
                        href={profile.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      />
                    }
                  >
                    <Link2 className="size-4" />
                    <span>LinkedIn</span>
                  </Button>
                )}
                {profile.githubUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    render={
                      <a
                        href={profile.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      />
                    }
                  >
                    <Code2 className="size-4" />
                    <span>GitHub</span>
                  </Button>
                )}
                {profile.portfolioUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-3"
                    render={
                      <a
                        href={profile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      />
                    }
                  >
                    <Globe className="size-4" />
                    <span>Portfolio</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne Principale (Gauche) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Summary */}
          {profile.summary && (
            <Card>
              <CardHeader className="border-b bg-muted/5 py-4">
                <CardTitle className="text-lg">Résumé professionnel</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                  {profile.summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {Object.keys(allSkills).length > 0 && (
            <Card>
              <CardHeader className="border-b bg-muted/5 py-4">
                <CardTitle className="text-lg">
                  Toutes les compétences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                {Object.entries(allSkills).map(([type, skills]) => (
                  <div key={type}>
                    <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      {type}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, index) => (
                        <Badge
                          key={`${skill}-${index}`}
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne Latérale (Droite) */}
        <div className="space-y-6">
          {/* Navigation Rapide (Remplace les gros blocs) */}
          <Card>
            <CardHeader className="border-b bg-muted/5 py-4">
              <CardTitle className="text-lg">Gérer mon CV</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-1 p-2">
              <Button
                variant="ghost"
                className="h-10 w-full justify-start px-3 font-normal"
                render={
                  <Link to="/profile" className="flex w-full items-center" />
                }
              >
                <User className="mr-3 size-4 text-primary" />
                Informations
                <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-50" />
              </Button>
              <Button
                variant="ghost"
                className="h-10 w-full justify-start px-3 font-normal"
                render={
                  <Link
                    to="/experiences"
                    className="flex w-full items-center"
                  />
                }
              >
                <Briefcase className="mr-3 size-4 text-primary" />
                Expériences
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0 text-[10px]"
                >
                  {profile.workExperiences?.length || 0}
                </Badge>
                <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-50" />
              </Button>
              <Button
                variant="ghost"
                className="h-10 w-full justify-start px-3 font-normal"
                render={
                  <Link to="/educations" className="flex w-full items-center" />
                }
              >
                <GraduationCap className="mr-3 size-4 text-primary" />
                Diplômes
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0 text-[10px]"
                >
                  {profile.educations?.length || 0}
                </Badge>
                <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-50" />
              </Button>
              <Button
                variant="ghost"
                className="h-10 w-full justify-start px-3 font-normal"
                render={
                  <Link to="/projects" className="flex w-full items-center" />
                }
              >
                <FolderGit2 className="mr-3 size-4 text-primary" />
                Projets
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0 text-[10px]"
                >
                  {profile.projects?.length || 0}
                </Badge>
                <ChevronRight className="ml-auto size-4 text-muted-foreground opacity-50" />
              </Button>
            </div>
          </Card>

          {/* Languages & Hobbies compacts */}
          {((Array.isArray(profile.languages) &&
            profile.languages.length > 0) ||
            (Array.isArray(profile.hobbies) && profile.hobbies.length > 0)) && (
            <Card>
              <CardHeader className="border-b bg-muted/5 py-4">
                <CardTitle className="text-lg">Divers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                {Array.isArray(profile.languages) &&
                  profile.languages.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Langues
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.languages.map(
                          (lang: string, index: number) => (
                            <Badge
                              key={`${lang}-${index}`}
                              variant="outline"
                              className="text-xs font-normal"
                            >
                              {lang}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                {Array.isArray(profile.hobbies) &&
                  profile.hobbies.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Centres d'intérêt
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.hobbies.map((hobby: string, index: number) => (
                          <Badge
                            key={`${hobby}-${index}`}
                            variant="outline"
                            className="text-xs font-normal"
                          >
                            {hobby}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
