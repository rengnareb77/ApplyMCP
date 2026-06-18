import { useState, useEffect } from 'react';
import { ADD_WORK_EXPERIENCE, REMOVE_WORK_EXPERIENCE, UPDATE_WORK_EXPERIENCE, GET_PERSON } from '../graphql';
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

interface SkillGroup {
  type: string;
  names: string;
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
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([{ type: '', names: '' }]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<WorkExperienceForm>({
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    location: '',
    contractType: '',
    description: '',
    achievement: '',
  });
  const [editSkillGroups, setEditSkillGroups] = useState<SkillGroup[]>([{ type: '', names: '' }]);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    loadExperiences();
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

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    const e = workExperiences[index] || {};
    setEditIndex(index);
    setEditFormData({
      company: e.company || '',
      role: e.role || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      location: e.location || '',
      contractType: e.contractType || '',
      description: e.description || '',
      achievement: e.achievement || '',
    });

    const groupedSkills = (e.skills || []).reduce((acc: Record<string, string[]>, skill: { type: string, name: string }) => {
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

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const experienceInput = {
        ...formData,
        skills: parseSkillGroups(skillGroups),
      };
      await graphqlQuery(ADD_WORK_EXPERIENCE, {
        profileId,
        input: experienceInput,
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
      setSkillGroups([{ type: '', names: '' }]);
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

  const handleUpdateExperience = async (index: number) => {
    setEditLoading(true);
    try {
      const experienceInput = {
        ...editFormData,
        skills: parseSkillGroups(editSkillGroups),
      };
      await graphqlQuery(UPDATE_WORK_EXPERIENCE, {
        profileId,
        index,
        input: experienceInput,
      });
      setError('');
      await loadExperiences();
      onExperienceUpdate?.();
      setEditIndex(null);
      alert('Expérience modifiée avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setEditLoading(false);
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
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.role}</h3>
                    <p className="text-gray-600">{exp.company}</p>
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
                      onClick={() => handleRemoveExperience(index)}
                      disabled={removeLoading || editLoading}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {editIndex === index ? (
                  <div className="mt-3">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        name="company"
                        value={editFormData.company}
                        onChange={handleEditInputChange}
                        placeholder="Entreprise *"
                        required
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        name="role"
                        value={editFormData.role}
                        onChange={handleEditInputChange}
                        placeholder="Poste *"
                        required
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="date"
                        name="startDate"
                        value={editFormData.startDate}
                        onChange={handleEditInputChange}
                        placeholder="Date de début *"
                        required
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        name="endDate"
                        value={editFormData.endDate}
                        onChange={handleEditInputChange}
                        placeholder="Date de fin"
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditInputChange}
                        placeholder="Localisation"
                        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        name="contractType"
                        value={editFormData.contractType}
                        onChange={handleEditInputChange}
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
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      placeholder="Description"
                      rows={3}
                      className="w-full px-3 py-2 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <textarea
                      name="achievement"
                      value={editFormData.achievement}
                      onChange={handleEditInputChange}
                      placeholder="Réalisation principale"
                      rows={2}
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
                        onClick={() => handleUpdateExperience(index)}
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
                    <div className="text-sm text-gray-600 mb-2">
                      {exp.startDate} - {exp.endDate || 'Actuellement'}
                    </div>
                    {exp.location && <p className="text-sm text-gray-600">📍 {exp.location}</p>}
                    {exp.contractType && <p className="text-sm text-gray-600">Contrat: {exp.contractType}</p>}
                    {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    {exp.achievement && <p className="text-sm mt-2 font-medium">Réalisation: {exp.achievement}</p>}
                  </>
                )}

                {Array.isArray(exp.skills) && exp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.skills.map((skill: any, skillIndex: number) => (
                      <span
                        key={`${skill?.type || 'Autre'}-${skill?.name || 'skill'}-${skillIndex}`}
                        className="inline-flex items-center px-2 py-0.5 rounded border bg-gray-50 text-gray-700 text-xs"
                      >
                        {skill?.type ? `${skill.type} · ` : ''}{skill?.name}
                      </span>
                    ))}
                  </div>
                )}
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
          {addLoading ? 'Ajout en cours...' : 'Ajouter l\'expérience'}
        </button>
      </form>
    </div>
  );
}