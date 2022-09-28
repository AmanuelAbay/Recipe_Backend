const gql = require('graphql-tag');

module.exports = gql `
    mutation ($name:String!, $email: String!, $phone_number: String!, $password: String!){
      insert_users(objects:{name:$name, email:$email, phone_number:$phone_number,password:$password }){
        returning
        {
            id
            name
            email
            phone_number
            password
        }
     }
   }
    `;