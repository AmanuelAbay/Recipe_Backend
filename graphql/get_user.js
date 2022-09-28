const gql = require('graphql-tag');
module.exports = gql `
query ($email: String!) {
  users(where: { email: { _eq: $email } }) {
    id
    name
    email
    phone_number
    password
  }
}
`