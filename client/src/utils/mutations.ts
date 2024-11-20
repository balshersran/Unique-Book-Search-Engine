import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
    mutation Mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
            username
            email
            _id
            bookCount
            savedBooks {
                title
                link
                image
                description
                bookId
                authors
      }
    }
  }
}
`;

export const ADD_USER = gql`
    mutation Mutation($input: UserInput!) {
        addUser(input: $input) {
            token
            user {
            username
            _id
            email
            bookCount
            savedBooks {
                title
                link
                image
                description
                bookId
                authors
      }
    }
  }
}
`;

export const SAVE_BOOK = gql`
    mutation Mutation($input: BookInput!) {
        saveBook(input: $input) {
            savedBooks {
            title
            link
            image
            description
            bookId
            authors
    }
  }
}
`;

export const REMOVE_BOOK = gql`
    mutation Mutation($bookId: ID!) {
        removeBook(bookId: $bookId) {
            savedBooks {
            bookId
    }
  }
}
`;