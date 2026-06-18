import { useState, useEffect } from 'react';
import { ADD_PROJECT, REMOVE_PROJECT, UPDATE_PROJECT, GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface ProjectsPageProps {
  profileId: string;
  onProjectUpdate?: () => void;
}

interface ProjectForm {
  title: string;
  description: string;
  year: string;
  repositoryUrl: string;
  liveDemoUrl: string;
}

interface SkillGroup {
  type: string;
  names: string;
}

export default function ProjectsPage({ profileId, onProjectUpdate }: ProjectsPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    year: '',
    repositoryUrl: '',
    liveDemoUrl: '',
  });
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([{ type: '', names: '' }]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    year: '',
    repositoryUrl: '',
    liveDemoUrl: '',
  });
  const [editSkillGroups, setEditSkillGroups] = useState<SkillGroup[]>([{ type: '', names: '' }]);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [profileId]);

  const parseSkillGroups = (groups: SkillGroup[]) => {
    const skills: { type: string; name: string }[] = [];
    groups.forEach(group => {
      const skillNames = group.names.split(',').map(name => name.trim()).filter(Boolean);
      skillNames.forEach(name => {
        skills.push({ type: group.type, name });
      });
    });
    return skills;
  };

  const loadProjects = async () => {
    try {
      const data = await graphqlQuery(GET_PERSON, { id: profileId });
      setProjects(data.getPerson.projects || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillGroupChange = (index: number, field: 'type' | 'names', value: string) => {
    const newSkillGroups = [...skillGroups];
    newSkillGroups[index][field] = value;
    setSkillGroups(newSkillGroups);
  };

  const addSkillGroup = () => {
    setSkillGroups([...skillGroups, { type: '', names: '' }]);
  };

  const removeSkillGroup = (index: number) => {
    const newSkillGroups = skillGroups.filter((_, i) => i !== index);
    setSkillGroups(newSkillGroups);
  };

  const handleEditSkillGroupChange = (index: number, field: 'type' | 'names', value: string) => {
    const newSkillGroups = [...editSkillGroups];
    newSkillGroups[index][field] = value;
    setEditSkillGroups(newSkillGroups);
  };

  const addEditSkillGroup = () => {
    setEditSkillGroups([...editSkillGroups, { type: '', names: '' }]);
  };

  const removeEditSkillGroup = (index: number) => {
    const newSkillGroups = editSkillGroups.filter((_, i) => i !== index);
    setEditSkillGroups(newSkillGroups);
  };

  const startEdit = (index: number) => {
    const p = projects[index] || {};
    setEditIndex(index);
    setEditFormData({
      title: p.title || '',
      description: p.description || '',
      year: p.year || '',
      repositoryUrl: p.repositoryUrl || '',
      liveDemoUrl: p.liveDemoUrl || '',
    });

    const groupedSkills = (p.skills || []).reduce((acc: Record<string, string[]>, skill: { type: string, name: string }) => {
      if (!acc[skill.type]) {
        acc[skill.type] = [];
      }
      acc[skill.type].push(skill.name);
      return acc;
    }, {});

    const skillGroups = Object.entries(groupedSkills).map(([type, names]) => ({
      type,
      names: (names as any).join(', '),
    }));

    setEditSkillGroups(skillGroups.length > 0 ? skillGroups : [{ type: '', names: '' }]);
    setError('');
  };

  const cancelEdit = () => {
    setEditIndex(null);
    setEditLoading(false);
    setError('');
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const projectInput = {
        ...formData,
        skills: parseSkillGroups(skillGroups),
      };
      await graphqlQuery(ADD_PROJECT, {
        profileId,
        input: projectInput,
      });
      setFormData({
        title: '',
        description: '',
        year: '',
        repositoryUrl: '',
        liveDemoUrl: '',
      });
      setSkillGroups([{ type: '', names: '' }]);
      setError('');
      await loadProjects();
      onProjectUpdate?.();
      alert('Projet ajouté avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddLoading(false);
    }
  };

  const handleUpdateProject = async (index: number) => {
    setEditLoading(true);
    try {
      const projectInput = {
        ...editFormData,
        skills: parseSkillGroups(editSkillGroups),
      };
      await graphqlQuery(UPDATE_PROJECT, {
        profileId,
        index,
        input: projectInput,
      });
      setError('');
      await loadProjects();
      onProjectUpdate?.();
      setEditIndex(null);
      alert('Projet modifié avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
    }
  };

  const handleRemoveProject = async (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      setRemoveLoading(true);
      try {
        await graphqlQuery(REMOVE_PROJECT, {
          profileId,
          index,
        });
        await loadProjects();
        onProjectUpdate?.();
        alert('Projet supprimé avec succès!');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      } finally {
        setRemoveLoading(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer mes projets</h1>

      {/* Liste des projets */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mes projets ({projects.length})</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-600">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    {project.year && (
                      <div className="text-sm text-gray-600">{project.year}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(index)}
                      disabled={removeLoading || addLoading || editLoading}
                      className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 disabled:bg-gray-400 text-sm"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleRemoveProject(index)}
                      disabled={removeLoading || editLoading}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {editIndex === index ? (
                  <div className="mt-3">
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      placeholder="Titre du projet *"
                      required
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      placeholder="Description du projet"
                      rows={3}
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="year"
                      value={editFormData.year}
                      onChange={handleEditInputChange}
                      placeholder="Année (ex: 2025)"
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      name="repositoryUrl"
                      value={editFormData.repositoryUrl}
                      onChange={handleEditInputChange}
                      placeholder="URL du repository GitHub/GitLab"
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="url"
                      name="liveDemoUrl"
                      value={editFormData.liveDemoUrl}
                      onChange={handleEditInputChange}
                      placeholder="URL de la démo en ligne"
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="space-y-2">
                      {editSkillGroups.map((group, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={group.type}
                            onChange={(e) => handleEditSkillGroupChange(i, 'type', e.target.value)}
                            placeholder="Type (ex: Frontend)"
                            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={group.names}
                            onChange={(e) => handleEditSkillGroupChange(i, 'names', e.target.value)}
                            placeholder="Compétences (ex: React, NextJs)"
                            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button type="button" onClick={() => removeEditSkillGroup(i)} className="text-red-500">X</button>
                        </div>
                      ))}
                      <button type="button" onClick={addEditSkillGroup} className="text-blue-500">+ Ajouter un groupe</button>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleUpdateProject(index)}
                        disabled={editLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={editLoading}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:bg-gray-100"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {project.description && (
                      <p className="text-gray-700 mb-3">{project.description}</p>
                    )}
                  </>
                )}

                {Array.isArray(project.skills) && project.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.skills.map((skill: any, skillIndex: number) => (
                      <span
                        key={`${skill?.type || 'Autre'}-${skill?.name || 'skill'}-${skillIndex}`}
                        className="inline-flex items-center px-2 py-0.5 rounded border bg-gray-50 text-gray-700 text-xs"
                      >
                        {skill?.type ? `${skill.type} · ` : ''}{skill?.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  {project.repositoryUrl && (
                    <div>
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        📦 Repository
                      </a>
                    </div>
                  )}
                  {project.liveDemoUrl && (
                    <div>
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm flex items-center"
                      >
                        🌐 Démo en ligne
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddProject} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un projet</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Titre du projet *"
          required
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description du projet"
          rows={4}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          placeholder="Année (ex: 2025)"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="url"
          name="repositoryUrl"
          value={formData.repositoryUrl}
          onChange={handleInputChange}
          placeholder="URL du repository GitHub/GitLab"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="url"
          name="liveDemoUrl"
          value={formData.liveDemoUrl}
          onChange={handleInputChange}
          placeholder="URL de la démo en ligne"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Compétences</h3>
          {skillGroups.map((group, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={group.type}
                onChange={(e) => handleSkillGroupChange(index, 'type', e.target.value)}
                placeholder="Type (ex: Frontend)"
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={group.names}
                onChange={(e) => handleSkillGroupChange(index, 'names', e.target.value)}
                placeholder="Compétences (ex: React, NextJs)"
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={() => removeSkillGroup(index)} className="text-red-500">X</button>
            </div>
          ))}
          <button type="button" onClick={addSkillGroup} className="text-blue-500">+ Ajouter un groupe</button>
        </div>

        <button
          type="submit"
          disabled={addLoading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {addLoading ? 'Ajout en cours...' : 'Ajouter le projet'}
        </button>
      </form>
    </div>
  );
}