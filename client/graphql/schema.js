import gql from 'graphql-tag';

const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Book {
      title: String
      author: String
    }

    type User {
        uid: ID
        displayName: String
        photoURL: String
        email: String
        phoneNumber: String
        providerId: String
    }

    type Pictire {
        photoURL: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
      currentUser: [User],
      fetchPhoto: Pictire
    }

    type Mutation {
        updateUser: [User]
    }
`;

export default typeDefs;