import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  ADD_WORK_EXPERIENCE,
  REMOVE_WORK_EXPERIENCE,
  UPDATE_WORK_EXPERIENCE,
  GET_PERSON,
} from "../graphql"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  X,
  MapPin,
  Calendar,
  Briefcase,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface WorkExperiencesPageProps {
  profileId: string
}

interface WorkExperienceForm {
  company: string
  role: string
  startDate: string
  endDate: string
  location: string
  contractType: string
  description: string
  achievement: string
}

interface SkillGroup {
  type: string
  names: string
}

const CONTRACT_TYPES = ["CDI", "CDD", "Stage", "Freelance", "Alternance"]

const emptyForm = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  location: "",
  contractType: "",
  description: "",
  achievement: "",
}

export default function WorkExperiencesPage({
  profileId,
}: WorkExperiencesPageProps) {
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<any>(GET_PERSON, {
    variables: { id: profileId },
  })

  const [addWorkExperience, { loading: addLoading, error: addError }] =
    useMutation(ADD_WORK_EXPERIENCE, {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    })

  const [updateWorkExperience, { loading: editLoading, error: editError }] =
    useMutation(UPDATE_WORK_EXPERIENCE, {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    })

  const [removeWorkExperience, { error: removeError }] = useMutation(
    REMOVE_WORK_EXPERIENCE,
    {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    }
  )

  const workExperiences = data?.getPerson?.workExperiences || []

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [formData, setFormData] = useState<WorkExperienceForm>(emptyForm)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([
    { type: "", names: "" },
  ])

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editFormData, setEditFormData] =
    useState<WorkExperienceForm>(emptyForm)
  const [editSkillGroups, setEditSkillGroups] = useState<SkillGroup[]>([
    { type: "", names: "" },
  ])

  const parseSkillGroups = (groups: SkillGroup[]) => {
    const skills: { type: string; name: string }[] = []
    groups.forEach((group) => {
      const skillNames = group.names
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
      skillNames.forEach((name) => {
        skills.push({ type: group.type, name })
      })
    })
    return skills
  }

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

  const handleSkillGroupChange = (
    index: number,
    field: "type" | "names",
    value: string
  ) => {
    const newSkillGroups = [...skillGroups]
    newSkillGroups[index][field] = value
    setSkillGroups(newSkillGroups)
  }

  const addSkillGroup = () =>
    setSkillGroups([...skillGroups, { type: "", names: "" }])
  const removeSkillGroup = (index: number) =>
    setSkillGroups(skillGroups.filter((_, i) => i !== index))

  const handleEditSkillGroupChange = (
    index: number,
    field: "type" | "names",
    value: string
  ) => {
    const newSkillGroups = [...editSkillGroups]
    newSkillGroups[index][field] = value
    setEditSkillGroups(newSkillGroups)
  }

  const addEditSkillGroup = () =>
    setEditSkillGroups([...editSkillGroups, { type: "", names: "" }])
  const removeEditSkillGroup = (index: number) =>
    setEditSkillGroups(editSkillGroups.filter((_, i) => i !== index))

  const startEdit = (index: number) => {
    const e = workExperiences[index] || {}
    setEditIndex(index)
    setEditFormData({
      company: e.company || "",
      role: e.role || "",
      startDate: e.startDate || "",
      endDate: e.endDate || "",
      location: e.location || "",
      contractType: e.contractType || "",
      description: e.description || "",
      achievement: e.achievement || "",
    })

    const groupedSkills = (e.skills || []).reduce(
      (
        acc: Record<string, string[]>,
        skill: { type: string; name: string }
      ) => {
        if (!acc[skill.type]) acc[skill.type] = []
        acc[skill.type].push(skill.name)
        return acc
      },
      {}
    )

    const groups = Object.entries(groupedSkills).map(([type, names]) => ({
      type,
      names: (names as any).join(", "),
    }))

    setEditSkillGroups(groups.length > 0 ? groups : [{ type: "", names: "" }])
    setIsEditOpen(true)
  }

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const experienceInput = {
        ...formData,
        skills: parseSkillGroups(skillGroups),
      }
      await addWorkExperience({
        variables: { profileId, input: experienceInput },
      })
      setFormData(emptyForm)
      setSkillGroups([{ type: "", names: "" }])
      setIsAddOpen(false)
      toast.success("Expérience ajoutée avec succès !")
    } catch (err: any) {
      // Error handled by addError
    }
  }

  const handleUpdateExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editIndex === null) return
    try {
      const experienceInput = {
        ...editFormData,
        skills: parseSkillGroups(editSkillGroups),
      }
      await updateWorkExperience({
        variables: { profileId, index: editIndex, input: experienceInput },
      })
      setIsEditOpen(false)
      setEditIndex(null)
      toast.success("Expérience modifiée avec succès !")
    } catch (err: any) {
      // Error handled by editError
    }
  }

  const handleRemoveExperience = async (index: number) => {
    try {
      await removeWorkExperience({
        variables: { profileId, index },
      })
      toast.success("Expérience supprimée avec succès !")
    } catch (err: any) {
      // Error handled by removeError
    }
  }

  if (queryLoading) {
    return (
      <div className="p-6 text-muted-foreground">
        Chargement des expériences...
      </div>
    )
  }

  const error =
    queryError?.message ||
    addError?.message ||
    editError?.message ||
    removeError?.message

  // Formulaire d'expérience réutilisable (rendu JSX pour éviter la duplication)
  const renderForm = (
    isEdit: boolean,
    data: WorkExperienceForm,
    handleDataChange: typeof handleInputChange,
    groups: SkillGroup[],
    handleGroupChange: typeof handleSkillGroupChange,
    addGroup: () => void,
    removeGroup: (idx: number) => void,
    onSubmit: (e: React.FormEvent) => void,
    loading: boolean
  ) => (
    <form
      onSubmit={onSubmit}
      className="max-h-[70vh] space-y-4 overflow-y-auto px-1 pt-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Entreprise *</Label>
          <Input
            name="company"
            value={data.company}
            onChange={handleDataChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Poste *</Label>
          <Input
            name="role"
            value={data.role}
            onChange={handleDataChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date de début *</Label>
          <Input
            type="date"
            name="startDate"
            value={data.startDate}
            onChange={handleDataChange}
            required
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Localisation</Label>
          <Input
            name="location"
            value={data.location}
            onChange={handleDataChange}
          />
        </div>
        <div className="space-y-2">
          <Label>Type de contrat</Label>
          <Select
            value={data.contractType}
            onValueChange={(val) =>
              handleDataChange({
                target: { name: "contractType", value: val },
              } as any)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner..." />
            </SelectTrigger>
            <SelectContent>
              {CONTRACT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={data.description}
          onChange={handleDataChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>Réalisation principale</Label>
        <Textarea
          name="achievement"
          value={data.achievement}
          onChange={handleDataChange}
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <Label>Compétences développées</Label>
        {groups.map((group, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={group.type}
              onChange={(e) => handleGroupChange(index, "type", e.target.value)}
              placeholder="Type (ex: Frontend)"
              className="w-1/3"
            />
            <Input
              value={group.names}
              onChange={(e) =>
                handleGroupChange(index, "names", e.target.value)
              }
              placeholder="Compétences (séparées par une virgule)"
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeGroup(index)}
            >
              <X className="size-4 text-destructive" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGroup}
          className="w-full border-dashed"
        >
          <Plus className="mr-2 size-4" />
          Ajouter un groupe de compétences
        </Button>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading
            ? "Enregistrement..."
            : isEdit
              ? "Mettre à jour"
              : "Ajouter l'expérience"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Briefcase className="size-8 text-primary" />
            Mes expériences
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gérez votre parcours professionnel de manière chronologique.
          </p>
        </div>

        {/* Modal d'ajout */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter une expérience
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter une expérience</DialogTitle>
            </DialogHeader>
            {renderForm(
              false,
              formData,
              handleInputChange,
              skillGroups,
              handleSkillGroupChange,
              addSkillGroup,
              removeSkillGroup,
              handleAddExperience,
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier l'expérience</DialogTitle>
          </DialogHeader>
          {renderForm(
            true,
            editFormData,
            handleEditInputChange,
            editSkillGroups,
            handleEditSkillGroupChange,
            addEditSkillGroup,
            removeEditSkillGroup,
            handleUpdateExperience,
            editLoading
          )}
        </DialogContent>
      </Dialog>

      {/* Timeline des expériences */}
      {workExperiences.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center">
          <Briefcase className="mx-auto mb-3 size-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">Aucune expérience</h3>
          <p className="mt-1 text-muted-foreground">
            Vous n'avez pas encore ajouté d'expérience professionnelle.
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
          {workExperiences.map((exp: any, index: number) => (
            <div
              key={index}
              className="group relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse"
            >
              {/* Timeline marker */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-background bg-primary shadow md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <Briefcase className="size-4 text-primary-foreground" />
              </div>

              {/* Card */}
              <div className="w-[calc(100%-4rem)] rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md md:w-[calc(50%-3rem)]">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="font-medium text-primary">{exp.company}</p>
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
                            Supprimer l'expérience ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. L'expérience chez{" "}
                            <strong>{exp.company}</strong> sera définitivement
                            effacée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveExperience(index)}
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
                  <span className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
                    <Calendar className="size-3.5" />
                    {exp.startDate} - {exp.endDate || "Présent"}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" /> {exp.location}
                    </span>
                  )}
                  {exp.contractType && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {exp.contractType}
                    </Badge>
                  )}
                </div>

                {exp.description && (
                  <p className="mb-4 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                    {exp.description}
                  </p>
                )}

                {exp.achievement && (
                  <div className="mb-4 rounded-lg border border-primary/10 bg-primary/5 p-3">
                    <p className="text-sm font-medium text-primary">
                      Réalisation clé
                    </p>
                    <p className="mt-1 text-sm">{exp.achievement}</p>
                  </div>
                )}

                {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exp.skills.map((skill: any, skillIndex: number) => (
                      <Badge
                        key={`${skill?.type || "Autre"}-${skill?.name || "skill"}-${skillIndex}`}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {skill?.type ? (
                          <span className="mr-1 opacity-50">{skill.type}</span>
                        ) : null}
                        {skill?.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
