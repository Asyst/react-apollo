import { gql } from 'apollo-server-hapi';

const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Book {
      title: String
      author: String
    }

    type User {
      id: ID!
      facebookId: String
      instagramId: String
      picture: String
      username: String
      first_name: String
      last_name: String
      email: String
    }

    type Post {
      id: ID!
      author: String
      date: String
      title: String
      image: String
      text: String
      tags: String
      likes: [String]
      comments: [String]
    }

    type Comment {
      text: String
      date: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
      books: [Book]
      posts: [Post]
      post(id: ID!): Post
      users: [User]
      user(id: ID!): User
      comments: [Comment]
    }
`;

export default typeDefs;