// Utilitaire pour faire des requêtes GraphQL
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8080/graphql';

export async function graphqlQuery(query: string, variables?: any) {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message || 'Erreur GraphQL');
    }

    return data.data;
  } catch (error) {
    console.error('Erreur GraphQL:', error);
    throw error;
  }
}
