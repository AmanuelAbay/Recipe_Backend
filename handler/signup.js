const apollo_client = require("../apollo/apollo.config.js");
const GET_USER = require("../graphql/get_user");
const register_user = require("../graphql/register_user.js");
const GET_USERP = require("../graphql/get_user_phone.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signuphandler = async (req, res) => {
  var salt = bcrypt.genSaltSync(10);
  const user = req.body.input;
  const email = req.body.input.email;
  const phone_number = req.body.input.phone_number;
  user.password = bcrypt.hashSync(user.password, salt);
  const variables = {
    email: user.email,
    password: user.password,
    name: user.name,
    phone_number: user.phone_number,
  };
  let doesEmailExist = await apollo_client.query({
    query: GET_USER,
    variables: { email },
  });

  if (doesEmailExist.data.users.length > 0) {
    res.json({
      message: "Email Already Existed",
      status: false,
      id: null,
      token: null,
    });
    return;
  }
  let doesPhoneNumberExist = await apollo_client.query({
    query: GET_USERP,
    variables: { phone_number },
  });

  if (doesPhoneNumberExist.data.users.length > 0) {
    res.json({
      message: "Phone Number Already Existed",
      status: false,
    });
    return;
  }

  let {
    data: {
      insert_users: { returning },
    },
  } = await apollo_client.mutate({
    mutation: register_user,
    variables: variables,
  });
  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": returning[0].id.toString(),
    },
  };

  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
    algorithm: "HS256",
  });
  return res.json({
    token,
    id: returning[0].id,
    status: true,
    message: "success",
  });
};

module.exports = signuphandler;
