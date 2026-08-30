"use server";

import { toggleFavoriteAction } from "@/lib/actions-favorites";

export async function favoriteBibleVerseAction(
  verseId: number,
  reference: string,
  text: string,
): Promise<{ error?: string; favorited?: boolean }> {
  return toggleFavoriteAction(reference, text, "biblia", String(verseId));
}
