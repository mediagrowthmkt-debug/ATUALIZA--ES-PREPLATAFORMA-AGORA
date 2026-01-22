import * as functionsV1 from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Importar funções de proxy da IA (usa v2)
export * from './aiProxy';
export * from './geminiProxy';

// 👉 Função para transformar a conta em AGENCIA
export const becomeAgency = functionsV1.https.onCall(async (data: any, context: any) => {
  if (!context.auth) {
    throw new functionsV1.https.HttpsError('unauthenticated', 'Faça login primeiro.');
  }

  const uid = context.auth.uid;
  const agencyId = data?.agencyId || uid;

  await admin.auth().setCustomUserClaims(uid, { role: 'agency', agencyId });

  await admin.firestore().doc(`agencies/${agencyId}`).set({
    ownerUid: uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  return { ok: true, role: 'agency', agencyId };
});

// 👉 Recebe LEADS do Make.com via POST
export const receiveLead = functionsV1.https.onRequest(async (req: any, res: any) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-webhook-secret');
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    }

    const uid = (req.query.uid as string || '').trim();
    const client = (req.query.client as string || '').trim();
    const token = ((req.query.token as string) || (req.headers['x-webhook-secret'] as string) || '').trim();

    if (!uid || !client || !token) {
      return res.status(400).json({ ok: false, error: 'Missing uid, client or token' });
    }

    const tokenRef = admin.firestore().doc(`usuarios/${uid}/clients/${client}/settings/leadWebhook`);
    const tokenSnap = await tokenRef.get();
    if (!tokenSnap.exists) {
      return res.status(403).json({ ok: false, error: 'Invalid token (not configured)' });
    }
    const tokenData = tokenSnap.data() || {};
    if ((tokenData.token || '') !== token) {
      return res.status(403).json({ ok: false, error: 'Invalid token' });
    }

    const body = (typeof req.body === 'object' && req.body) ? req.body : {};
    const name = (body.name || body.nome || body.full_name || '').toString().trim();
    const email = (body.email || body.mail || '').toString().trim().toLowerCase();
    const phone = (body.phone || body.telefone || body.whatsapp || '').toString().trim();
    const question = (body.question || body.pergunta || body.qualifying_question || '').toString().trim();
    const source = (body.source || body.origem || 'make').toString().trim();
    const plataforma = (body.plataforma || body.platform || '').toString().trim();
    const tags = Array.isArray(body.tags) ? body.tags.slice(0, 20).map(String) : [];

    if (!name && !email && !phone) {
      return res.status(400).json({ ok: false, error: 'Missing lead fields (name/email/phone required)' });
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const lead = {
      name: name || null,
      email: email || null,
      phone: phone || null,
      question: question || null,
      source,
      plataforma: plataforma || null,
      tags,
      status: 'novo',
      createdAt: now,
      updatedAt: now,
      agencyId: uid,
      clientId: client
    } as Record<string, any>;

    const ref = await admin.firestore()
      .collection('usuarios').doc(uid)
      .collection('clients').doc(client)
      .collection('leads').add(lead);

    return res.status(200).json({ ok: true, id: ref.id });
  } catch (err: any) {
    console.error('receiveLead error', err);
    return res.status(500).json({ ok: false, error: err?.message || 'Internal error' });
  }
});
