import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { gql } from "graphql-request";
import { client } from "./client";
import { generateJWT } from "./jwt";
import { UUID } from "crypto";

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON in request bodies
app.use(express.json());

app.post("/auth/register", async (req: Request, res: Response) => {
    // let  email  = req.body ;
    // let salt: string;
    // await bcrypt.hash(password, 10, (err, res) => {
    //     salt = res;
    //  });
    const  result : { insert_user_one: {id :UUID} }  = await client.request(
      gql`
        mutation registerUser($user: user_insert_input!) {
          insert_user_one(object: $user) {
            id
          }
        }
      `,
      {
        user: {
          email: "nabil@email",
          password: "aze123",
        },
      }
    );
    console.log(client.requestConfig);
    // console.log(result);
   
    res.send({
      token: generateJWT({
        defaultRole: "user",
        allowedRoles: ["user"],
        otherClaims: {
          "X-Hasura-User-Id": result.insert_user_one.id,
        },
      }),
    });
  });


app.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as Record<string, string>;
  
  let user : any= await client.request(
    gql`
    query MyQuery {
        user {
          email
          id
          password
        }
      }      
    `
  );
  
  console.log(user);
  // Since we filtered on a non-primary key we got an array back


//   if (suser !== null) {
//     res.sendStatus(401);
//     return;
//   }

  // Check if password matches the hashed version
  const passwordMatch = password === "aze123";
  
    res.send({
      token: generateJWT({
        defaultRole: "user",
        allowedRoles: ["user"],
        otherClaims: {
          "X-Hasura-User-Id": user.user[3].id,
        },
      }),
    });

});  
app.listen(port, () => {
  console.log(`Auth server running on port ${port}.`);
});
