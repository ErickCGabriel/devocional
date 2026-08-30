"use server";

import { quickFavoriteAction } from "@/lib/actions-favorites";

export async function favoriteBibleVerseAction(
  verseId: number,
  reference: string,
  text: string,
): Promise<{ error?: string }> {
  return quickFavoriteAction(reference, text, "biblia", String(verseId));
}
