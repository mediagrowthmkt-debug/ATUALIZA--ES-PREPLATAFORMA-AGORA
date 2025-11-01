import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

// 👉 Função para transformar a conta em AGENCIA
export const becomeAgency = functions.https.onCall(async (data, context) => {
  // Verifica se o usuário está logado
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Faça login primeiro.');
  }

  const uid = context.auth.uid;
  const agencyId = data?.agencyId || uid;

  // Marca a conta como agência
  await admin.auth().setCustomUserClaims(uid, { role: 'agency', agencyId });

  // Cria o registro da agência (opcional)
  await admin.firestore().doc(`agencies/${agencyId}`).set({
    ownerUid: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true, role: 'agency', agencyId };
});
