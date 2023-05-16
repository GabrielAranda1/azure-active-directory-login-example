import { config } from 'dotenv';

config()

import express from 'express';
import { client, } from './azure-msal';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', async function (req, res, next) {
  const authCodeUrlParameters = {
    scopes: ["openid", "profile", "email"],
    //  redirectUri: "http://localhost:3000/redirect",
    redirectUri: "https://dashboard.hubees.com.br/login",
  };

  const authUrl = await client.getAuthCodeUrl(authCodeUrlParameters);
  console.log(authUrl)
  res.redirect(authUrl);
});

app.get('/getToken', async (req, res) => {
  const response = await client.acquireTokenByCode({
    code: '0.ASUAlyLYIerkJEeps7L7xGdbpHDJtnOKIg5AulU19PiB_KklALQ.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wUA9P8M8ZlJf4-ag_agRUZvt5SS1oAiqkq2fBY-e_x7rDganJvh71ZwuKYWkBumZOh5qg4g6JvfvdwjNjzbijsZ5CS9pmxlg7WEC7dQNTuJctGlf1W0pZsuOT0FHTeHcyAhJktEecPnt4TI5eKVw6OBZlC_7zjjROgcT20arRF5aLz9OV5zW1xzzWxzFI7s2c5JzmnCVnLZmgKZidx5DJ6hLbgxxIFjk7gbcMIYH8KVgbQy7EtT6lsXosuNZgQoeGru8_HtlNgptem_LqyXBz3x8oDyI2VSW4zrvhQHy-Gzd0RCHTsvsQP70lbedPpCZgXnAuNuFJwa3D_EmfCZaDD7KZ5pleEJmiDBbiu8eiPn881DL4h_9Ulz5c5C2yXtIK0vcq4lj1CFJ66GC5UUvSVlFlVqDe7XvvHWFUPNpx3eQOtxKuEvFeOXOiiFotHDYiW5jMxHfkX7__94Rm1sV8IUIkrmaSy0vu8txCp0fnA8b9C31rCEiYnpqQH8BPNUqC7Zi09H6LRE76V-dnTn-juuSkre2yVorhOvJrk_Z7z6FbRhQX3j6w5lXySvI25inIc4PXmKb9KiH1cQJm-z8mg-utUGAUZEZ-njpeTrvqYI0BEL_3JF27dTw1vFiMFsYozaS4qGLOPDWbYP6T6sPF30fsjcEhIOcjhZiKo04BKMv0XBCTDDlTBVGlRp7WYlIGUukvxTOznYKK0SXmUABJmJWFtR2Q',
    redirectUri: 'https://dashboard.hubees.com.br/login',
    scopes: ['email', 'profile']
  })
  console.log(response)
});

app.get('/redirect', (req, res) => {
  console.log(req);
})

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

app.get('/logout', (req, res) => {
  //client.clearCache()
  const logoutUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/logout?post_logout_redirect_uri=https://dashboard.hubees.com.br/login`
  res.redirect(logoutUrl)
})