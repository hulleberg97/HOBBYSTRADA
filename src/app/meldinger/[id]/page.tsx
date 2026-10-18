import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getConversation } from "@/lib/chat";
import { Chat } from "@/components/Chat";

export const metadata: Metadata = { title: "Samtale", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect(`/auth/login?next=/meldinger/${id}`);
  const chat = await getConversation(id, user.id);
  if (!chat) notFound();
  return <Chat conversation={chat.conversation} initial={chat.messages} />;
}
