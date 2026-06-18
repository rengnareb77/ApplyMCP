import { useState, useEffect } from 'react';
import { UPDATE_PERSON, GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface ProfileEditPageProps {
  profileId: string;
  onProfileUpdate?: () => void;
}

export default function ProfileEditPage({ profileId, onProfileUpdate }: ProfileEditPageProps) {
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    summary: '',
  });
  const [languagesInput, setLanguagesInput] = useState('');
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      const data = await graphqlQuery(GET_PERSON, { id: profileId });
      setFormData({
        firstName: data.getPerson.firstName || '',
        lastName: data.getPerson.lastName || '',
        email: data.getPerson.email || '',
        phoneNumber: data.getPerson.phoneNumber || '',
        address: data.getPerson.address || '',
        linkedinUrl: data.getPerson.linkedinUrl || '',
        githubUrl: data.getPerson.githubUrl || '',
        portfolioUrl: data.getPerson.portfolioUrl || '',
        summary: data.getPerson.summary || '',
      });
      setLanguagesInput(Array.isArray(data.getPerson.languages) ? data.getPerson.languages.join(', ') : '');
      setHobbiesInput(Array.isArray(data.getPerson.hobbies) ? data.getPerson.hobbies.join(', ') : '');
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    }
  };

  const parseList = (raw: string): string[] => {
    const parts = raw
      .split(/[,;\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);

    const out: string[] = [];
    const seen = new Set<string>();
    for (const p of parts) {
      const key = p.toLowerCase();
      if (!seen.has(key)) {
        out.push(p);
        seen.add(key);
      }
    }
    return out;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const input = {
        ...formData,
        languages: parseList(languagesInput),
        hobbies: parseList(hobbiesInput),
      };
      await graphqlQuery(UPDATE_PERSON, {
        id: profileId,
        input,
      });
      setError('');
      onProfileUpdate?.();
      alert('Profil mis à jour avec succès!');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Modifier mon profil</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4">Informations principales</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Portfolio</label>
            <input
              type="url"
              name="portfolioUrl"
              value={formData.portfolioUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-4">Mon résumé professionnel</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Résumé</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={6}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez votre expérience et vos objectifs professionnels..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Langues</label>
            <input
              type="text"
              value={languagesInput}
              onChange={(e) => setLanguagesInput(e.target.value)}
              placeholder="ex: Français, Anglais, Espagnol"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Centres d'intérêt</label>
            <input
              type="text"
              value={hobbiesInput}
              onChange={(e) => setHobbiesInput(e.target.value)}
              placeholder="ex: Course à pied, Photo, Échecs"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  );
}
