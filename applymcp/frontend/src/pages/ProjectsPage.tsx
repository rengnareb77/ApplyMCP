import { useState, useEffect } from 'react';
import { ADD_PROJECT, REMOVE_PROJECT, GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface ProjectsPageProps {
  profileId: string;
  onProjectUpdate?: () => void;
}

interface ProjectForm {
  title: string;
  description: string;
  repositoryUrl: string;
  liveDemoUrl: string;
}

export default function ProjectsPage({ profileId, onProjectUpdate }: ProjectsPageProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    repositoryUrl: '',
    liveDemoUrl: '',
  });
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [profileId]);

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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await graphqlQuery(ADD_PROJECT, {
        profileId,
        input: formData,
      });
      setFormData({
        title: '',
        description: '',
        repositoryUrl: '',
        liveDemoUrl: '',
      });
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
    <div className="max-w-4xl mx-auto p-6">
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold flex-1">{project.title}</h3>
                  <button
                    onClick={() => handleRemoveProject(index)}
                    disabled={removeLoading}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm ml-2"
                  >
                    Supprimer
                  </button>
                </div>

                {project.description && (
                  <p className="text-gray-700 mb-3">{project.description}</p>
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
