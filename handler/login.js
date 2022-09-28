const apollo_client = require("../apollo/apollo.config.js");
const GET_USER = require("../graphql/get_user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const loginhandler = async (req, res) => {
  const email = req.body.input.email;
  console.log(email);
  let {
    data: { users },
  } = await apollo_client.query({
    query: GET_USER,
    variables: { email: email },
  });
  console.log(users[0])
  if (users.length == 0) {
    res.json({
      status: false,
      message: "account not found",
    });
    return;
  }
  const isValidPassword = bcrypt.compareSync(
    req.body.input.password,
    users[0].password
  );
  if (!isValidPassword) {
    res.json({
      status: false,
      message: "Invalid Password",
    });
    return;
  }

  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": users[0].id.toString(),
    },
  };
  const token = jwt.sign(payload, process.env.HASURA_GRAPHQL_JWT_SECRETS, {
    algorithm: "HS256",
  });

  res.json({
    token: token,
    id: users[0].id.toString(),
    status: true,
    message: "success",
  });
};

module.exports = loginhandler;
