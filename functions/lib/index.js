"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveLead = exports.becomeAgency = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
// 👉 Função para transformar a conta em AGENCIA
exports.becomeAgency = functions.https.onCall(async (data, context) => {
    // Verifica se o usuário está logado
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'Faça login primeiro.');
    }
    const uid = context.auth.uid;
    const agencyId = (data === null || data === void 0 ? void 0 : data.agencyId) || uid;
    // Marca a conta como agência
    await admin.auth().setCustomUserClaims(uid, { role: 'agency', agencyId });
    // Cria o registro da agência (opcional)
    await admin.firestore().doc(`agencies/${agencyId}`).set({
        ownerUid: uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return { ok: true, role: 'agency', agencyId };
});
// 👉 Recebe LEADS do Make.com via POST e grava no Firestore
// Segurança: exige token secreto por cliente em query (?uid=...&client=...&token=...) ou header "x-webhook-secret"
// Body esperado (JSON): { name, email, phone, question, source?, tags?[] }
exports.receiveLead = functions.https.onRequest(async (req, res) => {
    // Habilita CORS básico (Make e testes locais)
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
        const uid = (req.query.uid || '').trim();
        const client = (req.query.client || '').trim();
        const token = (req.query.token || req.headers['x-webhook-secret'] || '').trim();
        if (!uid || !client || !token) {
            return res.status(400).json({ ok: false, error: 'Missing uid, client or token' });
        }
        // Valida token consultando doc /usuarios/{uid}/clients/{client}/settings/leadWebhook
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
        // Normaliza campos comuns
        const name = (body.name || body.nome || body.full_name || '').toString().trim();
        const email = (body.email || body.mail || '').toString().trim().toLowerCase();
        const phone = (body.phone || body.telefone || body.whatsapp || '').toString().trim();
        const question = (body.question || body.pergunta || body.qualifying_question || '').toString().trim();
        const source = (body.source || body.origem || 'make').toString().trim();
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
            tags,
            status: 'novo',
            createdAt: now,
            updatedAt: now,
            agencyId: uid, // compat helpers nas rules
            clientId: client
        };
        // Grava em /usuarios/{uid}/clients/{client}/leads/{autoId}
        const ref = await admin.firestore()
            .collection('usuarios').doc(uid)
            .collection('clients').doc(client)
            .collection('leads').add(lead);
        return res.status(200).json({ ok: true, id: ref.id });
    }
    catch (err) {
        console.error('receiveLead error', err);
        return res.status(500).json({ ok: false, error: (err === null || err === void 0 ? void 0 : err.message) || 'Internal error' });
    }
});
//# sourceMappingURL=index.js.map