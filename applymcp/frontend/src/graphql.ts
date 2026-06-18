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
      skills
      hobbies
      languages
      projects {
        title
        description
        year
        repositoryUrl
        liveDemoUrl
        skills {
          type
          name
        }
      }
      educations {
        institution
        description
        degree
        location
        startDate
        endDate
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
        skills {
          type
          name
        }
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
      hobbies
      languages
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
        skills {
          type
          name
        }
      }
    }
  }
`;

export const UPDATE_WORK_EXPERIENCE = `
  mutation UpdateWorkExperience($profileId: ID!, $index: Int!, $input: WorkExperienceInput!) {
    updateWorkExperience(profileId: $profileId, index: $index, input: $input) {
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
        skills {
          type
          name
        }
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
        skills {
          type
          name
        }
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
        startDate
        endDate
      }
    }
  }
`;

export const UPDATE_EDUCATION = `
  mutation UpdateEducation($profileId: ID!, $index: Int!, $input: EducationInput!) {
    updateEducation(profileId: $profileId, index: $index, input: $input) {
      id
      educations {
        institution
        description
        degree
        location
        startDate
        endDate
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
        startDate
        endDate
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
        skills {
          type
          name
        }
        year
      }
    }
  }
`;

export const UPDATE_PROJECT = `
  mutation UpdateProject($profileId: ID!, $index: Int!, $input: ProjectInput!) {
    updateProject(profileId: $profileId, index: $index, input: $input) {
      id
      projects {
        title
        description
        repositoryUrl
        liveDemoUrl
        skills {
          type
          name
        }
        year
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
        skills {
          type
          name
        }
        year
      }
    }
  }
`;
