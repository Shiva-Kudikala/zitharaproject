const { Client } = require("pg");
const axios = require("axios");

const client = new Client({
  user: "app",
  password: "12345",
  host: "localhost",
  port: 5432,
  database: "zithara",
});

async function getUserData() {
  let users = await axios.get("https://randomuser.me/api/?results=50");
  // console.log(users.data)
  return users.data["results"];
}

client
  .connect()
  .then(async () => {
    console.log("Connected Successfully")
    await client.query("SET client_encoding TO UTF8;")
    let users = await getUserData();
    console.log(users);
    let sno = 0;
    for (let user of users) {
      let phone = user["cell"].replace(/\D/g, "");
      phone = phone.replace(/^0+/, "");
      await client.query(
        `INSERT INTO users VALUES (${++sno}, '${
          user["name"]["first"]
        } ${user["name"]["last"]}', ${user["dob"]["age"]}, '${phone}', '${
          user["location"]["city"]
        }', '${user["registered"]["date"]}');`
      );
    }

    client
      .end()
      .then(() => {
        console.log("Terminated Successfully");
      })
      .catch((err) => {
        console.error("Error", err);
      });
  })
  .catch((err) => {
    console.error("Error", err);
  });
