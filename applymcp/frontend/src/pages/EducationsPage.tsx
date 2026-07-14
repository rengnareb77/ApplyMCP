import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  ADD_EDUCATION,
  REMOVE_EDUCATION,
  UPDATE_EDUCATION,
  GET_PERSON,
} from "../graphql"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  AlertCircle,
  Plus,
  MapPin,
  Calendar,
  GraduationCap,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface EducationsPageProps {
  profileId: string
}

interface EducationForm {
  institution: string
  description: string
  degree: string
  location: string
  startDate: string
  endDate: string
}

const emptyForm = {
  institution: "",
  description: "",
  degree: "",
  location: "",
  startDate: "",
  endDate: "",
}

export default function EducationsPage({ profileId }: EducationsPageProps) {
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<any>(GET_PERSON, {
    variables: { id: profileId },
  })

  const [addEducation, { loading: addLoading, error: addError }] = useMutation(
    ADD_EDUCATION,
    {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    }
  )

  const [updateEducation, { loading: editLoading, error: editError }] =
    useMutation(UPDATE_EDUCATION, {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    })

  const [removeEducation, { error: removeError }] = useMutation(
    REMOVE_EDUCATION,
    {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    }
  )

  const educations = data?.getPerson?.educations || []

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [formData, setFormData] = useState<EducationForm>(emptyForm)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<EducationForm>(emptyForm)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const startEdit = (index: number) => {
    const e = educations[index] || {}
    setEditIndex(index)
    setEditFormData({
      institution: e.institution || "",
      description: e.description || "",
      degree: e.degree || "",
      location: e.location || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
    })
    setIsEditOpen(true)
  }

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addEducation({
        variables: { profileId, input: formData },
      })
      setFormData(emptyForm)
      setIsAddOpen(false)
      toast.success("Diplôme ajouté avec succès !")
    } catch (err: any) {
      // Handled by addError
    }
  }

  const handleUpdateEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editIndex === null) return
    try {
      await updateEducation({
        variables: { profileId, index: editIndex, input: editFormData },
      })
      setIsEditOpen(false)
      setEditIndex(null)
      toast.success("Diplôme modifié avec succès !")
    } catch (err: any) {
      // Handled by editError
    }
  }

  const handleRemoveEducation = async (index: number) => {
    try {
      await removeEducation({
        variables: { profileId, index },
      })
      toast.success("Diplôme supprimé avec succès !")
    } catch (err: any) {
      // Handled by removeError
    }
  }

  if (queryLoading) {
    return (
      <div className="p-6 text-muted-foreground">
        Chargement des diplômes...
      </div>
    )
  }

  const error =
    queryError?.message ||
    addError?.message ||
    editError?.message ||
    removeError?.message

  // Formulaire réutilisable
  const renderForm = (
    isEdit: boolean,
    data: EducationForm,
    handleDataChange: typeof handleInputChange,
    onSubmit: (e: React.FormEvent) => void,
    loading: boolean
  ) => (
    <form
      onSubmit={onSubmit}
      className="max-h-[70vh] space-y-4 overflow-y-auto px-1 pt-4"
    >
      <div className="space-y-2">
        <Label>Établissement *</Label>
        <Input
          name="institution"
          value={data.institution}
          onChange={handleDataChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Diplôme / Certification</Label>
        <Input name="degree" value={data.degree} onChange={handleDataChange} />
      </div>

      <div className="space-y-2">
        <Label>Localisation</Label>
        <Input
          name="location"
          value={data.location}
          onChange={handleDataChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de début</Label>
          <Input
            type="date"
            name="startDate"
            value={data.startDate}
            onChange={handleDataChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Date de fin</Label>
          <Input
            type="date"
            name="endDate"
            value={data.endDate}
            onChange={handleDataChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={data.description}
          onChange={handleDataChange}
          placeholder="Cours principaux, projets, mentions..."
          rows={4}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading
            ? "Enregistrement..."
            : isEdit
              ? "Mettre à jour"
              : "Ajouter le diplôme"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <GraduationCap className="size-8 text-primary" />
            Mes diplômes
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez vos formations et certifications.
          </p>
        </div>

        {/* Modal d'ajout */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter un diplôme
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Ajouter un diplôme</DialogTitle>
            </DialogHeader>
            {renderForm(
              false,
              formData,
              handleInputChange,
              handleAddEducation,
              addLoading
            )}
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Modal d'édition */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Modifier le diplôme</DialogTitle>
          </DialogHeader>
          {renderForm(
            true,
            editFormData,
            handleEditInputChange,
            handleUpdateEducation,
            editLoading
          )}
        </DialogContent>
      </Dialog>

      {/* Timeline des diplômes */}
      {educations.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center">
          <GraduationCap className="mx-auto mb-3 size-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">Aucun diplôme</h3>
          <p className="mt-1 text-muted-foreground">
            Vous n'avez pas encore ajouté de formation.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsAddOpen(true)}
          >
            Commencer à remplir
          </Button>
        </div>
      ) : (
        <div className="relative space-y-6 pb-6 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent md:before:mx-auto md:before:translate-x-0">
          {educations.map((edu: any, index: number) => (
            <div
              key={index}
              className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              {/* Timeline marker */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <GraduationCap className="size-4 text-primary-foreground" />
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md md:w-[calc(50%-3rem)]">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {edu.institution}
                    </h3>
                    {edu.degree && (
                      <p className="font-medium text-primary">{edu.degree}</p>
                    )}
                  </div>

                  {/* Actions (apparaissent au hover sur desktop) */}
                  <div className="flex gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => startEdit(index)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="hover:text-destructive-foreground text-destructive transition-colors hover:bg-destructive"
                          />
                        }
                      >
                        <Trash2 className="size-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer ce diplôme ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le diplôme de{" "}
                            <strong>{edu.institution}</strong> sera
                            définitivement effacé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveEducation(index)}
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {(edu.startDate || edu.endDate) && (
                    <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                      <Calendar className="size-3.5" />
                      {edu.startDate}{" "}
                      {edu.endDate ? `- ${edu.endDate}` : " - Actuellement"}
                    </span>
                  )}
                  {edu.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {edu.location}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
