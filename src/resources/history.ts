import { listEmails, loadEmail } from '../lib/storage.js';

export async function listHistoryResources(): Promise<Array<{ uri: string; name: string; description: string }>> {
  const emails = await listEmails();
  return emails.map((e) => ({
    uri: `emails://history/${e.id}`,
    name: `${e.type} email — ${e.prompt.slice(0, 60)}`,
    description: `Created ${e.createdAt}, ${e.refinements.length} refinement(s)`,
  }));
}

export async function readHistoryResource(emailId: string): Promise<string | null> {
  const email = await loadEmail(emailId);
  if (!email) return null;
  return JSON.stringify(email, null, 2);
}
