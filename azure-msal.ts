import * as msal from "@azure/msal-node";

const config: msal.Configuration = {
  auth: {
    clientId: process.env.APP_ID!,
    authority: `${process.env.MICROSOFT_LOGIN_URI}/${process.env.TENANT_ID!}`,
    clientSecret: process.env.CLIENT_SECRET!,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: string, containsPii: any) => {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

const cryptoProvider = new msal.CryptoProvider();
const client = new msal.ConfidentialClientApplication(config);

const scope = ["user.read"];

async function getToken() {
  try {
    const result = await client.acquireTokenByClientCredential({ scopes: scope });
    console.log(result);
    return result?.accessToken;
  } catch (error) {
    console.log(error);
  }
}

export { getToken, client, cryptoProvider }
