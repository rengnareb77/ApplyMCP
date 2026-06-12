import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_PERSON } from '../graphql';
import { graphqlQuery } from '../apollo-client';

interface DashboardPageProps {
  profileId: string;
}

export default function DashboardPage({ profileId }: DashboardPageProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await graphqlQuery(GET_PERSON, { id: profileId });
      setProfile(data.getPerson);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">Erreur: {error}</div>;
  if (!profile) return <div className="flex items-center justify-center h-screen">Profil non trouvé</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-blue-100 mt-2">{profile.email}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8">
        {/* Summary */}
        {profile.summary && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Résumé professionnel</h2>
            <p className="text-gray-700 whitespace-pre-line">{profile.summary}</p>
          </div>
        )}

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {profile.phoneNumber && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Téléphone</h3>
              <p className="text-lg mt-2">{profile.phoneNumber}</p>
            </div>
          )}
          {profile.address && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Adresse</h3>
              <p className="text-lg mt-2">{profile.address}</p>
            </div>
          )}
          {profile.birthDate && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase">Date de naissance</h3>
              <p className="text-lg mt-2">{profile.birthDate}</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="mb-8">
          <div className="flex gap-4">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                LinkedIn
              </a>
            )}
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                GitHub
              </a>
            )}
            {profile.portfolioUrl && (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            to="/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="font-semibold mb-1">Modifier mon profil</h3>
            <p className="text-sm text-gray-600">Mettre à jour mes informations</p>
          </Link>

          <Link
            to="/experiences"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-semibold mb-1">Expériences ({profile.workExperiences?.length || 0})</h3>
            <p className="text-sm text-gray-600">Gérer mes expériences</p>
          </Link>

          <Link
            to="/educations"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-3xl mb-2">🎓</div>
            <h3 className="font-semibold mb-1">Diplômes ({profile.educations?.length || 0})</h3>
            <p className="text-sm text-gray-600">Gérer mes formations</p>
          </Link>

          <Link
            to="/projects"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center"
          >
            <div className="text-3xl mb-2">🚀</div>
            <h3 className="font-semibold mb-1">Projets ({profile.projects?.length || 0})</h3>
            <p className="text-sm text-gray-600">Gérer mes projets</p>
          </Link>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Compétences</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.skills.map((skill: any, index: number) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{skill.category}</p>
                  <p className="font-semibold">{skill.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
