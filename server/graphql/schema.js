import { gql } from 'apollo-server-hapi';

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  type Post {
        id: String
        author: String
        date: String
        title: String,
        image: String,
        text: String,
        tags: String,
        likes: [String],
        comments: [String]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    posts: [Post]
  }
`;

export default typeDefs;