import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { env } from "../env";

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseClient;
}

function localPdfPath(storagePath: string): string {
  return join(env.localStorageDir, storagePath);
}

export async function uploadPdf(storagePath: string, buffer: Buffer): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.storage
      .from(env.supabaseStorageBucket)
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });
    if (error) {
      throw new Error(`Error al subir PDF a Supabase Storage: ${error.message}`);
    }
    return;
  }

  const filePath = localPdfPath(storagePath);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);
}

export async function downloadPdf(storagePath: string): Promise<Buffer> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.storage
      .from(env.supabaseStorageBucket)
      .download(storagePath);
    if (error || !data) {
      throw new Error(`Error al descargar PDF: ${error?.message ?? "sin datos"}`);
    }
    return Buffer.from(await data.arrayBuffer());
  }

  return readFile(localPdfPath(storagePath));
}

export async function getPdfSignedUrl(storagePath: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase.storage
    .from(env.supabaseStorageBucket)
    .createSignedUrl(storagePath, 3600);
  if (error || !data?.signedUrl) {
    throw new Error(`Error al firmar URL: ${error?.message ?? "sin URL"}`);
  }
  return data.signedUrl;
}

export function buildPdfStoragePath(bioCallId: string): string {
  return `bio-calls/${bioCallId}/current.pdf`;
}
