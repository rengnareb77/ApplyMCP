import { useState, useEffect } from 'react';
import { ADD_EDUCATION, REMOVE_EDUCATION, GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface EducationsPageProps {
  profileId: string;
  onEducationUpdate?: () => void;
}

interface EducationForm {
  institution: string;
  description: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
}

export default function EducationsPage({ profileId, onEducationUpdate }: EducationsPageProps) {
  const [educations, setEducations] = useState<any[]>([]);
  const [formData, setFormData] = useState<EducationForm>({
    institution: '',
    description: '',
    degree: '',
    location: '',
    startDate: '',
    endDate: '',
  });
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect( () => {
     loadEducations();
  }, [profileId]);

  const loadEducations = async () => {
    try {
      const data = await graphqlQuery(GET_PERSON, { id: profileId });
      setEducations(data.getPerson.educations || []);
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

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      await graphqlQuery(ADD_EDUCATION, {
        profileId,
        input: formData,
      });
      setFormData({
        institution: '',
        description: '',
        degree: '',
        location: '',
        startDate: '',
        endDate: '',
      });
      setError('');
      await loadEducations();
      onEducationUpdate?.();
      alert('Diplôme ajouté avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveEducation = async (index: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce diplôme?')) {
      setRemoveLoading(true);
      try {
        await graphqlQuery(REMOVE_EDUCATION, {
          profileId,
          index,
        });
        await loadEducations();
        onEducationUpdate?.();
        alert('Diplôme supprimé avec succès!');
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      } finally {
        setRemoveLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gérer mes diplômes et formations</h1>

      {/* Liste des diplômes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Mes diplômes ({educations.length})</h2>
        {educations.length === 0 ? (
          <p className="text-gray-500">Aucun diplôme pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {educations.map((edu, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.institution}</h3>
                    {edu.degree && <p className="text-gray-600 font-medium">{edu.degree}</p>}
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    disabled={removeLoading}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                  >
                    Supprimer
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {edu.startYear || edu.startDate} - {edu.endYear || edu.endDate || 'Actuellement'}
                </div>
                {edu.location && <p className="text-sm text-gray-600">📍 {edu.location}</p>}
                {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddEducation} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ajouter un diplôme</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          name="institution"
          value={formData.institution}
          onChange={handleInputChange}
          placeholder="Établissement *"
          required
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleInputChange}
          placeholder="Diplôme/Certification"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Localisation"
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            placeholder="Date de début"
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

        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Description (cours principaux, projets, prix...)"
          rows={4}
          className="w-full px-3 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={addLoading}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {addLoading ? 'Ajout en cours...' : 'Ajouter le diplôme'}
        </button>
      </form>
    </div>
  );
}
