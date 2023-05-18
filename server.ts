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
    redirectUri: process.env.REDIRECT_TO!,
  };

  const authUrl = await client.getAuthCodeUrl(authCodeUrlParameters);
  console.log(authUrl)
  res.redirect(authUrl);
});

app.get('/getToken', async (req, res) => {
  const response = await client.acquireTokenByCode({
    code: '0.ASUAlyLYIerkJEeps7L7xGdbpHDJtnOKIg5AulU19PiB_KklALQ.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wUA9P-ORpn093aUtXtAX4UvB4ButRXqY6njwHyt1n1_7Bejl2yy8AY2o3CKYav7xq3kNwXrY-azEbBu67QobhzCyxCVK8QkMj-iZ2JqZn2OKVMxeWjx2dhjpQK1K4s9PBATUNEj6VvmlJqMNN6wCtOh-0a4_YkMam0IIZwNRgiyt38vMwk1sCvLuCQqA1OZynirhYO37byedl17bXMJ_v5WGps-cijB2k2Xh598KCyL04_QpUCTOK0IPAhaT_yCxPS_tZeawufiLjARFQjhK7xLB_-fc1CV95T0g2ZrWrysAUYsKQehY4odk8L-WywiE5kdLqnu0dpBCvpI-n3FNmntWfmYh1piEr6JrqU93oXnYdNS1xlawM4uIa4BvOTmnylOV2kKzhBzcys0KwB6q6RWGy6j5ZXbbxig-ey1RSPkjwTOL1gHkMZ6ruBkThkSkHlcyNlRIFo6bNiSQVeNucsUTywG3dh4_XCQJ9tpDhrHvI2qMnTIdzzdEaAvcgpkHrZdT02kEIRHWcfj0ZrIQjsqjoatM3S8BgRJ-_cEhbsa2RfbKZ1O1OXBMar4SMIPR1d2i2nbIlSkXBW4OXp6BKI21EuH63FwCg3fUXQ9RTsm5e-z16P8_VIFJXgesxLKG4dDlBB37WEdc2OAzsWrC4uRv52_6jsPIfCDKUiKjyWACNI6mp3uk3Vu2DIVH6Mr9Ztb91ggG7YUaPy3J0ny8dVDSYKbvA',
    redirectUri: process.env.REDIRECT_TO!,
    scopes: ['email', 'profile']
  })
  console.log(response)
  return res.status(200).json(response)
});

app.get('/redirect', async (req, res) => {
  const { code, client_info, session_state } = req.query

  const response = await client.acquireTokenByCode({
    code: code as string,
    redirectUri: process.env.REDIRECT_TO!,
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
  const logoutUrl = `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/logout?post_logout_redirect_uri=https://dashboard.hubees.com.br/login`
  res.redirect(logoutUrl)
})

app.get('/protected', async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })

  const [, token] = req.headers.authorization.split('Bearer ')

  try {
    const decoded = decode(token, { complete: true })
    console.log(decoded)

    const azureKeys: { keys: any[] } = await fetch(process.env.MICROSOFT_DISCOVERY_KEYS_URI!).then(res => res.json())

    const keyExist = azureKeys.keys.find(key => key.kid === decoded?.header.kid)

    if (!keyExist) return res.status(401).json({ message: 'Unauthorized' })

    return res.status(200).json({ message: 'Authorized' })
  } catch (err) {
    throw err
  }
})

app.get('/protected-cert', async (req, res) => {
  if (!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' })

  const [, token] = req.headers.authorization.split('Bearer ')

  try {
    const decoded = decode(token, { complete: true })
    console.log(decoded)

    const azureKeys: { keys: any[] } = await fetch(process.env.MICROSOFT_DISCOVERY_KEYS_URI!).then(res => res.json())

    const key = azureKeys.keys.find(key => key.kid === decoded?.header.kid)

    const certificado = `-----BEGIN CERTIFICATE-----\n${key.x5c[0]}\n-----END CERTIFICATE-----`

    // if (!keyExist) return res.status(401).json({ message: 'Unauthorized' })

    const isVerified = verify(token, certificado)

    return res.status(200).json({ message: isVerified })
  } catch (err) {
    throw err
  }
})

