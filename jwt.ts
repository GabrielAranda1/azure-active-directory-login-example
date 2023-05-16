import { sign, verify } from 'jsonwebtoken';

const idToken = '0.ASUAlyLYIerkJEeps7L7xGdbpHDJtnOKIg5AulU19PiB_KklALQ.AgABAAIAAAD--DLA3VO7QrddgJg7WevrAgDs_wUA9P9ODKb3eh1aPb8CnbBPjts48uehItI0A-ob3ee7sM2QGxwgV51KAoSaEsuYmDpUJxqYj4C4MupTxlgrUvXfj9bxQWBLL9xXUJVozh5LDLm45Yw-HhOTwYSK4Br3HYo3NfK1zkjyUM3fFCPo_1_DrHbJUvHx_hgN16Q7ROd2YqnB67_1fOIChgiL0kqWUtmMLsFZ51cwjV5Wq2jAXX8fFamDIByMu1DBvL2KoY1aKoxJuFsLgNe22vdDx8VoodHbFRxR5_DDG33JW19FdCHyZLaPfkhJHV89qH1e4ApP0GrVyV1wwDlm7twsWmffrWmvLNZPEpwDxTN1NtTqUVq3GboTl4PerLz05TQ1xVUpIlh6_bWoX0o0ipCdPV_MU0fPW2Kah7-S8GIgYpqboaqnVD2dTZ3DxP8hP71y9tqNCtWda2HBmQN2hYaPIguxSZOyCK_OtQogo8caQYe3vALhH6Z__yvY66O1bxldPYzcRdoyB8EIxLEmhUo5WIS5KnJRocewctTn065W2XxNrtQ_S9_wVPW8F-VfMDId73rEXzDC0clhB1swMvWjehVf70QdIfxSyYoMBUWTuIXJ8jCYC8i_wLWLNfKshNZG-uKZLmCxjx9rivgaFMQBn6DfpmbZIWJUOYYZOs1Q40K6mqrjauqztTzbMMUVyLP6MxlEyye6nRtOj_ZLc3Jmw4jlAA9ZFhIjOfPkzIkKGLEuuEHY5xgwzg';

// Chave secreta usada para verificar a assinatura do token
const chaveSecreta = 'yin8Q~YKSTLYOMOmk7cHjIwbAEtjqQ6EVoXAHafb';

// Decodificando o token de ID
verify(idToken, chaveSecreta, (err, decodedToken) => {
  if (err) {
    console.log('Erro ao decodificar o token:', err);
  } else {
    // Dados do usuário contidos no token decodificado
    const { email, name } = decodedToken as any;
    console.log('Token decodificado:', decodedToken)
    console.log('E-mail do usuário:', email);
    console.log('Nome do usuário:', name);
  }
});