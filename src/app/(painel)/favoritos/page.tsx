import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { getCurrentUser, getFavorites } from "@/lib/queries";
import { getSubscription } from "@/lib/subscription";
import { deleteFavoriteAction } from "@/lib/actions-favorites";
import { FREE_FAVORITES_LIMIT } from "@/lib/limits";
import { Card } from "@/components/ui/card";
import { DeleteButton } from "@/components/ui/delete-button";
import { FavoriteForm } from "./favorite-form";

export default async function FavoritosPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [favorites, subscription] = await Promise.all([
    getFavorites(user.id),
    getSubscription(),
  ]);

  const atLimit = !subscription.isPremium && favorites.length >= FREE_FAVORITES_LIMIT;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Favoritos</h1>
        <p className="text-sm text-muted">
          {subscription.isPremium
            ? "Seus versículos favoritos, ilimitados."
            : `${favorites.length} de ${FREE_FAVORITES_LIMIT} favoritos do plano gratuito.`}
        </p>
      </div>

      <Card>
        <FavoriteForm disabled={atLimit} />
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {favorites.map((fav) => (
          <Card key={fav.id}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Star size={14} fill="currentColor" />
                <span className="text-sm font-semibold">{fav.verse_reference}</span>
              </div>
              <DeleteButton action={deleteFavoriteAction.bind(null, fav.id)} />
            </div>
            {fav.verse_text && (
              <p className="mt-2 text-sm text-foreground/80">&ldquo;{fav.verse_text}&rdquo;</p>
            )}
            {fav.note && <p className="mt-2 text-xs text-muted">{fav.note}</p>}
          </Card>
        ))}
        {favorites.length === 0 && (
          <p className="text-sm text-muted sm:col-span-2">
            Você ainda não tem favoritos salvos.
          </p>
        )}
      </div>
    </div>
  );
}
