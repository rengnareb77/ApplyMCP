import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { UPDATE_PERSON, GET_PERSON } from "../graphql"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, User, Link2, FileText, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

interface ProfileEditPageProps {
  profileId: string
}

export default function ProfileEditPage({ profileId }: ProfileEditPageProps) {
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<any>(GET_PERSON, {
    variables: { id: profileId },
  })

  const [updatePerson, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_PERSON)

  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    summary: "",
  })

  // State pour les tags
  const [languages, setLanguages] = useState<string[]>([])
  const [hobbies, setHobbies] = useState<string[]>([])

  // State pour les inputs temporaires des tags
  const [langInput, setLangInput] = useState("")
  const [hobbyInput, setHobbyInput] = useState("")

  useEffect(() => {
    if (data?.getPerson) {
      const person = data.getPerson
      setFormData({
        firstName: person.firstName || "",
        lastName: person.lastName || "",
        email: person.email || "",
        phoneNumber: person.phoneNumber || "",
        address: person.address || "",
        linkedinUrl: person.linkedinUrl || "",
        githubUrl: person.githubUrl || "",
        portfolioUrl: person.portfolioUrl || "",
        summary: person.summary || "",
      })
      setLanguages(Array.isArray(person.languages) ? [...person.languages] : [])
      setHobbies(Array.isArray(person.hobbies) ? [...person.hobbies] : [])
    }
  }, [data])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  // --- Gestion des tags (Langues) ---
  const handleLangKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addLanguage()
    }
  }

  const addLanguage = () => {
    const val = langInput.trim()
    if (val && !languages.includes(val)) {
      setLanguages([...languages, val])
    }
    setLangInput("")
  }

  const removeLanguage = (langToRemove: string) => {
    setLanguages(languages.filter((l) => l !== langToRemove))
  }

  // --- Gestion des tags (Hobbies) ---
  const handleHobbyKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addHobby()
    }
  }

  const addHobby = () => {
    const val = hobbyInput.trim()
    if (val && !hobbies.includes(val)) {
      setHobbies([...hobbies, val])
    }
    setHobbyInput("")
  }

  const removeHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter((h) => h !== hobbyToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Si l'utilisateur a tapé quelque chose mais oublié de faire "Entrée" avant de sauvegarder
    const finalLanguages = [...languages]
    if (langInput.trim() && !languages.includes(langInput.trim())) {
      finalLanguages.push(langInput.trim())
      setLanguages(finalLanguages)
      setLangInput("")
    }

    const finalHobbies = [...hobbies]
    if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
      finalHobbies.push(hobbyInput.trim())
      setHobbies(finalHobbies)
      setHobbyInput("")
    }

    try {
      const input = {
        ...formData,
        languages: finalLanguages,
        hobbies: finalHobbies,
      }
      await updatePerson({
        variables: {
          id: profileId,
          input,
        },
      })
      toast.success("Profil mis à jour avec succès !")
    } catch (err: any) {
      // Error is handled by useMutation error state
    }
  }

  if (queryLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="animate-pulse text-muted-foreground">
          Chargement du profil...
        </p>
      </div>
    )
  }

  const error = updateError?.message || queryError?.message

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <User className="size-8 text-primary" />
          Modifier mon profil
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gardez vos informations personnelles et professionnelles à jour.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-8 no-scrollbar flex h-auto w-full justify-start overflow-x-auto overflow-y-hidden p-1">
            <TabsTrigger value="general" className="px-6 whitespace-nowrap">
              <User className="mr-2 size-4" />
              Général
            </TabsTrigger>
            <TabsTrigger value="social" className="px-6 whitespace-nowrap">
              <Link2 className="mr-2 size-4" />
              Réseaux
            </TabsTrigger>
            <TabsTrigger value="summary" className="px-6 whitespace-nowrap">
              <FileText className="mr-2 size-4" />
              Résumé
            </TabsTrigger>
            <TabsTrigger value="misc" className="px-6 whitespace-nowrap">
              <Sparkles className="mr-2 size-4" />
              Divers
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="general"
            className="animate-in duration-300 fade-in-50 slide-in-from-bottom-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>
                  Vos informations d'identité et de contact de base.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Téléphone</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse postale</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ville, Pays..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="social"
            className="animate-in duration-300 fade-in-50 slide-in-from-bottom-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Réseaux & Liens</CardTitle>
                <CardDescription>
                  Liens vers vos profils professionnels et portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">Profil LinkedIn</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl">Profil GitHub</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    type="url"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">
                    Site personnel / Portfolio
                  </Label>
                  <Input
                    id="portfolioUrl"
                    name="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                    placeholder="https://mon-portfolio.com"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="summary"
            className="animate-in duration-300 fade-in-50 slide-in-from-bottom-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Résumé professionnel</CardTitle>
                <CardDescription>
                  Présentez brièvement votre parcours et vos ambitions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="summary">Texte de présentation</Label>
                  <Textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    rows={8}
                    placeholder="Développeur passionné avec 5 ans d'expérience..."
                    className="resize-none"
                  />
                  <p className="mt-2 text-right text-xs text-muted-foreground">
                    Un bon résumé fait généralement entre 3 et 5 phrases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="misc"
            className="animate-in duration-300 fade-in-50 slide-in-from-bottom-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Langues & Centres d'intérêt</CardTitle>
                <CardDescription>
                  Pour donner un peu plus de personnalité à votre profil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* --- Input Langues --- */}
                <div className="space-y-3">
                  <Label htmlFor="languages">Langues parlées</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="languages"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        onKeyDown={handleLangKeyDown}
                        placeholder="Ex: Français, Anglais..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addLanguage}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Appuyez sur "Entrée" ou "," pour ajouter une langue.
                    </p>

                    {languages.length > 0 && (
                      <div className="mt-2 flex min-h-[3rem] flex-wrap gap-2 rounded-md border bg-muted/20 p-3">
                        {languages.map((lang, index) => (
                          <Badge
                            key={index}
                            variant="default"
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium"
                          >
                            {lang}
                            <button
                              type="button"
                              onClick={() => removeLanguage(lang)}
                              className="text-primary-foreground/70 transition-colors outline-none hover:text-primary-foreground"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* --- Input Hobbies --- */}
                <div className="space-y-3 border-t pt-4">
                  <Label htmlFor="hobbies">Centres d'intérêt</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="hobbies"
                        value={hobbyInput}
                        onChange={(e) => setHobbyInput(e.target.value)}
                        onKeyDown={handleHobbyKeyDown}
                        placeholder="Ex: Photographie, Échecs..."
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={addHobby}
                      >
                        Ajouter
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Appuyez sur "Entrée" ou "," pour ajouter un centre
                      d'intérêt.
                    </p>

                    {hobbies.length > 0 && (
                      <div className="mt-2 flex min-h-[3rem] flex-wrap gap-2 rounded-md border bg-muted/20 p-3">
                        {hobbies.map((hobby, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium"
                          >
                            {hobby}
                            <button
                              type="button"
                              onClick={() => removeHobby(hobby)}
                              className="text-secondary-foreground/70 transition-colors outline-none hover:text-secondary-foreground"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bouton de sauvegarde global */}
        <div className="mt-8 flex items-center justify-end gap-4 rounded-xl border border-dashed bg-muted/30 p-4">
          <p className="hidden flex-1 text-sm text-muted-foreground sm:block">
            N'oubliez pas de sauvegarder vos modifications.
          </p>
          <Button
            type="submit"
            disabled={updateLoading}
            size="lg"
            className="w-full shadow-md sm:w-auto"
          >
            {updateLoading
              ? "Enregistrement en cours..."
              : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  )
}
