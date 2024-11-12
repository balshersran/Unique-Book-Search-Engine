import { gql } from "@apollo/client";

export const LOGIN_USER = gql `
    mutation Mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
  }
}
`;

export const ADD_USER = gql`

`;

export const SAVE_BOOK = gql `

`;

export const REMOVE_BOOK = gql `

`;