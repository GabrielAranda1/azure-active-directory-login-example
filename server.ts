import { config } from 'dotenv';
import { decode, verify } from 'jsonwebtoken';

config()

import express from 'express';
import { client, } from './azure-msal';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/login', async function (req, res, next) {
  const authCodeUrlParameters = {
    scopes: ["openid", "profile", "email"],
    redirectUri: process.env.AUTH_CALLBACK_URL!,
  };

  const authUrl = await client.getAuthCodeUrl(authCodeUrlParameters);
  console.log(authUrl)
  res.redirect(authUrl);
});

app.get('/redirect', async (req, res) => {
  const { code, client_info, session_state } = req.query

  const response = await client.acquireTokenByCode({
    code: code as string,
    redirectUri: process.env.AUTH_CALLBACK_URL!,
    scopes: ['email', 'profile'],
  })
  console.log(response)
  return res.status(200).json(response)
})

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

app.get('/logout', (req, res) => {
  //client.clearCache()
  const logoutUrl = `${process.env.MICROSOFT_LOGIN_URI}/${process.env.TENANT_ID!}/oauth2/v2.0/logout?post_logout_redirect_uri=${process.env.LOGOUT_REDIRECT_URI}`
  res.redirect(logoutUrl)
})

app.get('/protected-cert', async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })

  const [, token] = req.headers.authorization.split('Bearer ')

  try {
    const decoded = decode(token, { complete: true })
    console.log(decoded)

    const azureKeys: { keys: any[] } = await fetch(process.env.MICROSOFT_DISCOVERY_KEYS_URI!).then(res => res.json())

    const key = azureKeys.keys.find(key => key.kid === decoded?.header.kid)

    if (!key) return res.status(401).json({ message: 'Unauthorized' })
    
    const certificado = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`

    const isVerified = verify(token, certificado)

    return res.status(200).json({ message: isVerified })
  } catch (err) {
    throw err
  }
})

