import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import {
  ADD_PROJECT,
  REMOVE_PROJECT,
  UPDATE_PROJECT,
  GET_PERSON,
} from "../graphql"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  X,
  Globe,
  Code2,
  FolderGit2,
  Pencil,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

interface ProjectsPageProps {
  profileId: string
}

interface ProjectForm {
  title: string
  description: string
  year: string
  repositoryUrl: string
  liveDemoUrl: string
}

interface SkillGroup {
  type: string
  names: string
}

const emptyForm = {
  title: "",
  description: "",
  year: "",
  repositoryUrl: "",
  liveDemoUrl: "",
}

export default function ProjectsPage({ profileId }: ProjectsPageProps) {
  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useQuery<any>(GET_PERSON, {
    variables: { id: profileId },
  })

  const [addProject, { loading: addLoading, error: addError }] = useMutation(
    ADD_PROJECT,
    {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    }
  )

  const [updateProject, { loading: editLoading, error: editError }] =
    useMutation(UPDATE_PROJECT, {
      refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
    })

  const [removeProject, { error: removeError }] = useMutation(REMOVE_PROJECT, {
    refetchQueries: [{ query: GET_PERSON, variables: { id: profileId } }],
  })

  const projects = data?.getPerson?.projects || []

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)

  const [formData, setFormData] = useState<ProjectForm>(emptyForm)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([
    { type: "", names: "" },
  ])

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState<ProjectForm>(emptyForm)
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
    const p = projects[index] || {}
    setEditIndex(index)
    setEditFormData({
      title: p.title || "",
      description: p.description || "",
      year: p.year || "",
      repositoryUrl: p.repositoryUrl || "",
      liveDemoUrl: p.liveDemoUrl || "",
    })

    const groupedSkills = (p.skills || []).reduce(
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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const projectInput = {
        ...formData,
        skills: parseSkillGroups(skillGroups),
      }
      await addProject({
        variables: { profileId, input: projectInput },
      })
      setFormData(emptyForm)
      setSkillGroups([{ type: "", names: "" }])
      setIsAddOpen(false)
      toast.success("Projet ajouté avec succès !")
    } catch (err: any) {
      // Handled by addError
    }
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editIndex === null) return
    try {
      const projectInput = {
        ...editFormData,
        skills: parseSkillGroups(editSkillGroups),
      }
      await updateProject({
        variables: { profileId, index: editIndex, input: projectInput },
      })
      setIsEditOpen(false)
      setEditIndex(null)
      toast.success("Projet modifié avec succès !")
    } catch (err: any) {
      // Handled by editError
    }
  }

  const handleRemoveProject = async (index: number) => {
    try {
      await removeProject({
        variables: { profileId, index },
      })
      toast.success("Projet supprimé avec succès !")
    } catch (err: any) {
      // Handled by removeError
    }
  }

  if (queryLoading) {
    return (
      <div className="p-6 text-muted-foreground">Chargement des projets...</div>
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
    data: ProjectForm,
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
      <div className="space-y-2">
        <Label>Titre du projet *</Label>
        <Input
          name="title"
          value={data.title}
          onChange={handleDataChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={data.description}
          onChange={handleDataChange}
          placeholder="Rôle, contexte, fonctionnalités..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Année</Label>
        <Input
          name="year"
          value={data.year}
          onChange={handleDataChange}
          placeholder="ex: 2024"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>URL du code (Repository)</Label>
          <Input
            type="url"
            name="repositoryUrl"
            value={data.repositoryUrl}
            onChange={handleDataChange}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="space-y-2">
          <Label>URL de la démo (Live)</Label>
          <Input
            type="url"
            name="liveDemoUrl"
            value={data.liveDemoUrl}
            onChange={handleDataChange}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Technologies et Compétences</Label>
        {groups.map((group, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={group.type}
              onChange={(e) => handleGroupChange(index, "type", e.target.value)}
              placeholder="Type (ex: Backend)"
              className="w-1/3"
            />
            <Input
              value={group.names}
              onChange={(e) =>
                handleGroupChange(index, "names", e.target.value)
              }
              placeholder="Technos (séparées par une virgule)"
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
          Ajouter un groupe de technologies
        </Button>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading
            ? "Enregistrement..."
            : isEdit
              ? "Mettre à jour"
              : "Ajouter le projet"}
        </Button>
      </div>
    </form>
  )

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <FolderGit2 className="size-8 text-primary" />
            Mon portfolio
          </h1>
          <p className="mt-1 text-muted-foreground">
            Mettez en valeur vos réalisations et projets personnels.
          </p>
        </div>

        {/* Modal d'ajout */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter un projet
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter un projet</DialogTitle>
            </DialogHeader>
            {renderForm(
              false,
              formData,
              handleInputChange,
              skillGroups,
              handleSkillGroupChange,
              addSkillGroup,
              removeSkillGroup,
              handleAddProject,
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
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          {renderForm(
            true,
            editFormData,
            handleEditInputChange,
            editSkillGroups,
            handleEditSkillGroupChange,
            addEditSkillGroup,
            removeEditSkillGroup,
            handleUpdateProject,
            editLoading
          )}
        </DialogContent>
      </Dialog>

      {/* Grille des projets */}
      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 py-12 text-center">
          <FolderGit2 className="mx-auto mb-3 size-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">Aucun projet</h3>
          <p className="mt-1 text-muted-foreground">
            Vous n'avez pas encore ajouté de projet à votre portfolio.
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
            >
              {/* Header Card */}
              <div className="relative border-b bg-muted/20 p-5">
                <div className="flex items-start justify-between">
                  <div className="pr-12">
                    <h3 className="mb-1 text-xl leading-tight font-bold text-foreground">
                      {project.title}
                    </h3>
                    {project.year && (
                      <Badge
                        variant="outline"
                        className="bg-background text-xs font-normal"
                      >
                        {project.year}
                      </Badge>
                    )}
                  </div>

                  {/* Actions (absolues pour ne pas décaler le titre, opacité 0 par défaut) */}
                  <div className="absolute top-4 right-4 flex gap-1 rounded-md bg-background/80 p-0.5 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 h-7 w-7"
                      onClick={() => startEdit(index)}
                    >
                      <Pencil className="size-3.5" />
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
                            Supprimer ce projet ?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Le projet{" "}
                            <strong>{project.title}</strong> sera définitivement
                            effacé.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRemoveProject(index)}
                            className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>

              {/* Body Card */}
              <div className="flex flex-1 flex-col p-5">
                {project.description && (
                  <p className="mb-4 flex-1 text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                    {project.description}
                  </p>
                )}

                {Array.isArray(project.skills) && project.skills.length > 0 && (
                  <div className="mt-auto mb-5 flex flex-wrap gap-1.5">
                    {project.skills.map((skill: any, skillIndex: number) => (
                      <Badge
                        key={`${skill?.type || "Autre"}-${skill?.name || "skill"}-${skillIndex}`}
                        variant="secondary"
                        className="px-1.5 py-0 text-[10px] font-normal"
                      >
                        {skill?.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Footer Links */}
                {(project.repositoryUrl || project.liveDemoUrl) && (
                  <div className="mt-auto flex gap-2 border-t pt-4">
                    {project.repositoryUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 flex-1 text-xs"
                        render={
                          <a
                            href={project.repositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          />
                        }
                      >
                        <Code2 className="size-4" />
                        <span>Code</span>
                      </Button>
                    )}
                    {project.liveDemoUrl && (
                      <Button
                        variant="default"
                        size="sm"
                        className="h-9 flex-1 text-xs"
                        render={
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          />
                        }
                      >
                        <Globe className="size-4" />
                        <span>Site Web</span>
                      </Button>
                    )}
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
