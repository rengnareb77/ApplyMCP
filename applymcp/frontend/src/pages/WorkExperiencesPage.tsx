import { useState, useEffect } from 'react';
import { ADD_WORK_EXPERIENCE, REMOVE_WORK_EXPERIENCE, GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface WorkExperiencesPageProps {
  profileId: string;
  onExperienceUpdate?: () => void;
}

interface WorkExperienceForm {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  contractType: string;
  description: string;
  achievement: string;
}

export default function WorkExperiencesPage({ profileId, onExperienceUpdate }: WorkExperiencesPageProps) {
  const [workExperiences, setWorkExperiences] = useState<any[]>([]);
  const [formData, setFormData] = useState<WorkExperienceForm>({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    contractType: '',
    description: '',
    achievement: '',
  });
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    loadExperiences();
  }, [profileId]);

  const loadExperiences = async () => {
    try {
      const data = await graphqlQuery(GET_PERSON, { id: profileId });
      setWorkExperiences(data.getPerson.workExperiences || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await graphqlQuery(ADD_WORK_EXPERIENCE, {
        profileId,
        input: formData,
      });
      setFormData({
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        location: '',
        contractType: '',
        description: '',
        achievement: '',
      });
      setError('');
      await loadExperiences();
      onExperienceUpdate?.();
      alert('Expérience ajoutée avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveExperience = async (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expérience?')) {
      setRemoveLoading(true);
      try {
        await graphqlQuery(REMOVE_WORK_EXPERIENCE, {
          profileId,
          index,
        });
        await loadExperiences();
        onExperienceUpdate?.();
        alert('Expérience supprimée avec succès!');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      } finally {
        setRemoveLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer mes expériences professionnelles</h1>

      {/* Liste des expériences */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mes expériences ({workExperiences.length})</h2>
        {workExperiences.length === 0 ? (
          <p className="text-gray-500">Aucune expérience pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {workExperiences.map((exp, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveExperience(index)}
                    disabled={removeLoading}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {exp.startDate} - {exp.endDate || 'Actuellement'}
                </div>
                {exp.location && <p className="text-sm text-gray-600">📍 {exp.location}</p>}
                {exp.contractType && <p className="text-sm text-gray-600">Contrat: {exp.contractType}</p>}
                {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                {exp.achievement && <p className="text-sm mt-2 font-medium">Réalisation: {exp.achievement}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddExperience} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter une expérience</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Entreprise *"
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Poste *"
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            placeholder="Date de début *"
            required
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            placeholder="Date de fin"
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Localisation"
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="contractType"
            value={formData.contractType}
            onChange={handleInputChange}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Type de contrat</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
            <option value="Alternance">Alternance</option>
          </select>
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description"
          rows={3}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="achievement"
          value={formData.achievement}
          onChange={handleInputChange}
          placeholder="Réalisation principale"
          rows={2}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={addLoading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {addLoading ? 'Ajout en cours...' : 'Ajouter l\'expérience'}
        </button>
      </form>
    </div>
  );
}
