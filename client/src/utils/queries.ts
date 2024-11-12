import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
            _id
            email
            username
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
`;