import "server-only";
import { adminClient } from "./supabase-admin";
import { brandedEmail, kr, sendEmail } from "./email";
import { addNotification } from "./notifications";
import { vippsPayLink } from "./vipps-betaling";

export type Conversation = {
  id: string;
  listingSlug: string;
  listingTitle: string;
  listingImage: string | null;
  role: "buyer" | "seller";
  otherName: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: boolean;
  /** Budet selgeren har godtatt, i kroner. */
  acceptedOffer?: number | null;
  /** Vipps-lenke til selgeren. Bare kjøperen får den, og bare etter at et bud er godtatt. */
  payLink?: string | null;
  /** Selgeren har ikke telefonnummer fra Vipps ennå (logget inn før vi hentet det). */
  sellerPhoneMissing?: boolean;
};

export type ChatMessage = {
  id: string;
  mine: boolean;
  body: string;
  offer: number | null;
  /** Selgerens svar på budet. */
  offerStatus?: "accepted" | "declined" | null;
  image: string | null;
  createdAt: string;
};

type Row = {
  id: string;
  listing_slug: string;
  listing_title: string;
  listing_image: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  buyer_name: string;
  seller_name: string;
  last_message: string;
  last_sender_id: string | null;
  last_message_at: string;
  buyer_read_at: string;
  seller_read_at: string;
  accepted_offer?: number | null;
  accepted_at?: string | null;
};

export const MAX_MESSAGE = 2000;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const BUCKET = "chat-images";

/** Bildene i chatten er private. De vises via lenker som virker i et døgn. */
async function signImages(paths: string[]) {
  const db = adminClient();
  if (!db || !paths.length) return new Map<string, string>();
  const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24);
  return new Map((data ?? []).filter((d) => d.signedUrl && d.path).map((d) => [d.path!, d.signedUrl]));
}

/** Lagrer et bilde til samtalen og returnerer stien i bøtta. */
export async function uploadChatImage(conversationId: string, file: File) {
  const db = adminClient();
  if (!db) return null;
  const path = `${conversationId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.type === "image/png" ? "png" : "jpg"}`;
  const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) {
    console.error("Opplasting av chatbilde feilet", error.message);
    return null;
  }
  return path;
}

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.hobbystrada.no";

function toConversation(r: Row, userId: string): Conversation {
  const role = r.buyer_id === userId ? "buyer" : "seller";
  const readAt = role === "buyer" ? r.buyer_read_at : r.seller_read_at;
  return {
    id: r.id,
    listingSlug: r.listing_slug,
    listingTitle: r.listing_title,
    listingImage: r.listing_image,
    role,
    otherName: role === "buyer" ? r.seller_name : r.buyer_name,
    lastMessage: r.last_message,
    lastMessageAt: r.last_message_at,
    unread: r.last_sender_id !== userId && new Date(r.last_message_at) > new Date(readAt),
    acceptedOffer: r.accepted_offer == null ? null : Number(r.accepted_offer),
  };
}

let adminId: string | null | undefined;

/** Annonser uten eier (HOBBYSTRADA sine egne) besvares av administratoren. */
export async function adminUserId() {
  if (adminId !== undefined) return adminId;
  const db = adminClient();
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!db || !email) return null;
  for (let page = 1; page <= 10; page++) {
    const { data } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    const hit = data?.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return (adminId = hit.id);
    if (!data || data.users.length < 1000) break;
  }
  return (adminId = null);
}

export async function listConversations(userId: string) {
  const db = adminClient();
  if (!db) return [];
  const { data } = await db
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("last_message_at", { ascending: false })
    .limit(200);
  return ((data ?? []) as Row[]).map((r) => toConversation(r, userId));
}

export async function unreadCount(userId: string) {
  return (await listConversations(userId)).filter((c) => c.unread).length;
}

async function getRow(id: string, userId: string) {
  const db = adminClient();
  if (!db || !/^[0-9a-f-]{36}$/.test(id)) return null;
  const { data } = await db.from("conversations").select("*").eq("id", id).maybeSingle();
  const row = data as Row | null;
  return row && (row.buyer_id === userId || row.seller_id === userId) ? row : null;
}

/** Samtalen med meldinger, eller null hvis brukeren ikke er med i den. Merker samtalen som lest. */
export async function getConversation(id: string, userId: string, after?: string) {
  const db = adminClient();
  const row = await getRow(id, userId);
  if (!db || !row) return null;
  let q = db.from("chat_messages").select("id, sender_id, body, offer, offer_status, image, created_at").eq("conversation_id", id).order("created_at").limit(500);
  if (after) q = q.gt("created_at", after);
  const { data } = await q;
  const urls = await signImages((data ?? []).map((m) => m.image).filter(Boolean));
  const messages: ChatMessage[] = (data ?? []).map((m) => ({
    id: m.id,
    mine: m.sender_id === userId,
    body: m.body,
    offer: m.offer === null ? null : Number(m.offer),
    offerStatus: (m.offer_status as "accepted" | "declined" | null) ?? null,
    image: m.image ? (urls.get(m.image) ?? null) : null,
    createdAt: m.created_at,
  }));
  const role = row.buyer_id === userId ? "buyer" : "seller";
  await db
    .from("conversations")
    .update({ [`${role}_read_at`]: new Date().toISOString() })
    .eq("id", id);
  const conversation = toConversation(row, userId);
  // Kjøperen får Vipps-lenken til selgeren når et bud er godtatt
  if (role === "buyer" && conversation.acceptedOffer && row.seller_id) {
    const { data: p } = await db.from("profiles").select("phone").eq("id", row.seller_id).maybeSingle();
    conversation.payLink = p?.phone ? vippsPayLink(p.phone) : null;
    conversation.sellerPhoneMissing = !p?.phone;
  }
  return { conversation, messages };
}

/** Finner samtalen mellom kjøperen og selgeren om annonsen, eller lager en ny. */
export async function openConversation(input: {
  listing: { slug: string; title: string; image: string | null; seller: string };
  sellerId: string;
  buyer: { id: string; name: string };
}) {
  const db = adminClient();
  if (!db) return null;
  const { data: existing } = await db.from("conversations").select("id").eq("listing_slug", input.listing.slug).eq("buyer_id", input.buyer.id).maybeSingle();
  if (existing) return existing.id as string;
  const { data, error } = await db
    .from("conversations")
    .insert({
      listing_slug: input.listing.slug,
      listing_title: input.listing.title,
      listing_image: input.listing.image,
      buyer_id: input.buyer.id,
      seller_id: input.sellerId,
      buyer_name: input.buyer.name,
      seller_name: input.listing.seller,
    })
    .select("id")
    .single();
  if (error) {
    console.error("Kunne ikke lage samtale", error.message);
    return null;
  }
  return data.id as string;
}

/** Legger til en melding og varsler mottakeren på e-post hvis hen hadde lest alt fra før. */
export async function addMessage(id: string, userId: string, body: string, offer: number | null, image: File | null = null) {
  const db = adminClient();
  const row = await getRow(id, userId);
  if (!db || !row) return null;
  const imagePath = image ? await uploadChatImage(id, image) : null;
  if (image && !imagePath) return null;
  const { data, error } = await db
    .from("chat_messages")
    .insert({ conversation_id: id, sender_id: userId, body, offer, image: imagePath })
    .select("id, created_at")
    .single();
  if (error) {
    console.error("Kunne ikke lagre melding", error.message);
    return null;
  }
  const role = row.buyer_id === userId ? "buyer" : "seller";
  const preview = offer ? `Bud: ${kr(offer)}` : body || "Sendte et bilde";
  await db
    .from("conversations")
    .update({
      last_message: preview.slice(0, 200),
      last_sender_id: userId,
      last_message_at: data.created_at,
      [`${role}_read_at`]: data.created_at,
    })
    .eq("id", id);

  const recipientId = role === "buyer" ? row.seller_id : row.buyer_id;
  const recipientRead = role === "buyer" ? row.seller_read_at : row.buyer_read_at;
  const caughtUp = row.last_sender_id === userId ? false : new Date(recipientRead) >= new Date(row.last_message_at);
  const firstMessage = !row.last_sender_id;
  if (recipientId && (caughtUp || firstMessage)) {
    const { data: u } = await db.auth.admin.getUserById(recipientId);
    const to = u.user?.email;
    const from = role === "buyer" ? row.buyer_name : row.seller_name;
    if (to) {
      const { data: listing } = await db.from("listings").select("price").eq("slug", row.listing_slug).maybeSingle();
      await sendEmail({
        to,
        subject: offer ? `Nytt bud på «${row.listing_title}»: ${kr(offer)}` : `Ny melding om «${row.listing_title}»`,
        text: `${from} har sendt deg en melding om «${row.listing_title}»:\n\n${offer ? `Bud: ${kr(offer)}\n\n` : ""}${body || "(Bilde)"}\n\nLes og svar her:\n${site()}/meldinger/${id}\n\nDu kan ikke svare på denne e-posten.`,
        html: brandedEmail({
          title: offer ? `Nytt bud: ${kr(offer)}` : "Ny melding",
          intro: `${from} har sendt deg en melding om «${row.listing_title}».`,
          quote: body || (imagePath ? "Sendte deg et bilde." : undefined),
          item: {
            title: row.listing_title,
            image: row.listing_image,
            price: listing?.price ? Number(listing.price) : null,
            url: `${site()}/annonse/${row.listing_slug}`,
          },
          button: "Les og svar",
          url: `${site()}/meldinger/${id}`,
          outro: "Svar i chatten på HOBBYSTRADA. Du kan ikke svare på denne e-posten.",
          reason: "Du får denne e-posten fordi noen har skrevet til deg i chatten på HOBBYSTRADA.",
        }),
      });
    }
  }
  const signed = imagePath ? (await signImages([imagePath])).get(imagePath) : null;
  return { id: data.id as string, mine: true, body, offer, offerStatus: null, image: signed ?? null, createdAt: data.created_at as string } satisfies ChatMessage;
}

/**
 * Selgeren godtar eller avslår et bud. Godtatt bud lagres på samtalen og reserverer annonsen.
 * Kjøperen får beskjed på e-post og som varsel. Avtalen er mellom kjøper og selger; HOBBYSTRADA er ikke part.
 */
export async function decideOffer(conversationId: string, messageId: string, userId: string, accept: boolean) {
  const db = adminClient();
  const row = await getRow(conversationId, userId);
  if (!db || !row) return { error: "Fant ikke samtalen." };
  if (row.seller_id !== userId) return { error: "Bare selgeren kan svare på bud." };
  const { data: m } = await db.from("chat_messages").select("id, sender_id, offer, offer_status").eq("id", messageId).eq("conversation_id", conversationId).maybeSingle();
  if (!m || !m.offer || m.sender_id !== row.buyer_id) return { error: "Fant ikke budet." };
  if (m.offer_status) return { error: "Budet er allerede besvart." };
  const now = new Date().toISOString();
  const status = accept ? "accepted" : "declined";
  const { error } = await db.from("chat_messages").update({ offer_status: status, offer_decided_at: now }).eq("id", m.id);
  if (error) return { error: "Kunne ikke lagre svaret." };
  const amount = Number(m.offer);
  const text = accept ? `Budet på ${kr(amount)} er godtatt.` : `Budet på ${kr(amount)} er avslått.`;
  await db.from("chat_messages").insert({ conversation_id: conversationId, sender_id: userId, body: text, offer: null });
  await db
    .from("conversations")
    .update({ last_message: text, last_sender_id: userId, last_message_at: now, seller_read_at: now, ...(accept ? { accepted_offer: amount, accepted_at: now } : {}) })
    .eq("id", conversationId);
  if (accept) await db.from("listings").update({ reserved_at: now }).eq("slug", row.listing_slug);
  if (row.buyer_id) {
    await addNotification(db, row.buyer_id, {
      kind: "offer",
      title: accept ? `Budet ditt er godtatt: ${kr(amount)}` : `Budet ditt er avslått`,
      body: `«${row.listing_title}»`,
      href: `/meldinger/${conversationId}`,
    });
    const { data: u } = await db.auth.admin.getUserById(row.buyer_id);
    if (u.user?.email) {
      await sendEmail({
        to: u.user.email,
        subject: accept ? `Budet ditt på «${row.listing_title}» er godtatt` : `Budet ditt på «${row.listing_title}» er avslått`,
        text: `${row.seller_name} har ${accept ? "godtatt" : "avslått"} budet ditt på ${kr(amount)} for «${row.listing_title}».\n\n${accept ? "Gå til samtalen for å betale selgeren direkte med Vipps og avtale frakt." : "Du kan gi et nytt bud i samtalen."}\n\n${site()}/meldinger/${conversationId}\n\nDu kan ikke svare på denne e-posten.`,
        html: brandedEmail({
          title: accept ? `Budet ditt er godtatt: ${kr(amount)}` : "Budet ditt er avslått",
          intro: `${row.seller_name} har ${accept ? "godtatt" : "avslått"} budet ditt på ${kr(amount)} for «${row.listing_title}».`,
          item: { title: row.listing_title, image: row.listing_image, price: amount, url: `${site()}/annonse/${row.listing_slug}` },
          button: accept ? "Gå til samtalen og betal" : "Gå til samtalen",
          url: `${site()}/meldinger/${conversationId}`,
          outro: accept
            ? "Betalingen skjer direkte til selgeren med Vipps. HOBBYSTRADA er ikke part i handelen. Avtal frakt i chatten."
            : "Du kan gi et nytt bud i chatten på HOBBYSTRADA.",
          reason: "Du får denne e-posten fordi du har gitt et bud i chatten på HOBBYSTRADA.",
        }),
      });
    }
  }
  return { ok: true, status, amount, text, at: now };
}
