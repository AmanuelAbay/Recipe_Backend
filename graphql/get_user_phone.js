const gql = require('graphql-tag');
module.exports = gql `
query ($phone_number: String!) {
  users(where: { phone_number: { _eq: $phone_number } }) {
    id
  }
}
`