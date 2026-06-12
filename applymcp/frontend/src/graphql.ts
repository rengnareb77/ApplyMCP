// Requêtes GraphQL

export const GET_PERSON = `
  query GetPerson($id: ID!) {
    getPerson(id: $id) {
      id
      firstName
      lastName
      email
      birthDate
      phoneNumber
      address
      linkedinUrl
      githubUrl
      portfolioUrl
      summary
      projects {
        title
        description
        repositoryUrl
        liveDemoUrl
      }
      educations {
        institution
        description
        degree
        location
        startYear
        endYear
      }
      workExperiences {
        company
        role
        startDate
        endDate
        location
        contractType
        description
        achievement
      }
      skills {
        id
        name
        category
      }
    }
  }
`;

export const UPDATE_PERSON = `
  mutation UpdatePerson($id: ID!, $input: PersonInput!) {
    updatePerson(id: $id, input: $input) {
      id
      firstName
      lastName
      email
      birthDate
      phoneNumber
      address
      linkedinUrl
      githubUrl
      portfolioUrl
      summary
    }
  }
`;

export const UPDATE_SUMMARY = `
  mutation UpdateSummary($id: ID!, $newSummary: String!) {
    updateSummary(id: $id, newSummary: $newSummary) {
      id
      summary
    }
  }
`;

export const ADD_WORK_EXPERIENCE = `
  mutation AddWorkExperience($profileId: ID!, $input: WorkExperienceInput!) {
    addWorkExperience(profileId: $profileId, input: $input) {
      id
      workExperiences {
        company
        role
        startDate
        endDate
        location
        contractType
        description
        achievement
      }
    }
  }
`;

export const REMOVE_WORK_EXPERIENCE = `
  mutation RemoveWorkExperience($profileId: ID!, $index: Int!) {
    removeWorkExperience(profileId: $profileId, index: $index) {
      id
      workExperiences {
        company
        role
        startDate
        endDate
        location
        contractType
        description
        achievement
      }
    }
  }
`;

export const ADD_EDUCATION = `
  mutation AddEducation($profileId: ID!, $input: EducationInput!) {
    addEducation(profileId: $profileId, input: $input) {
      id
      educations {
        institution
        description
        degree
        location
        startYear
        endYear
      }
    }
  }
`;

export const REMOVE_EDUCATION = `
  mutation RemoveEducation($profileId: ID!, $index: Int!) {
    removeEducation(profileId: $profileId, index: $index) {
      id
      educations {
        institution
        description
        degree
        location
        startYear
        endYear
      }
    }
  }
`;

export const ADD_PROJECT = `
  mutation AddProject($profileId: ID!, $input: ProjectInput!) {
    addProject(profileId: $profileId, input: $input) {
      id
      projects {
        title
        description
        repositoryUrl
        liveDemoUrl
      }
    }
  }
`;

export const REMOVE_PROJECT = `
  mutation RemoveProject($profileId: ID!, $index: Int!) {
    removeProject(profileId: $profileId, index: $index) {
      id
      projects {
        title
        description
        repositoryUrl
        liveDemoUrl
      }
    }
  }
`;
