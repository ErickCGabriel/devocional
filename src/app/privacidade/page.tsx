import Link from "next/link";
import { Logo } from "@/components/auth/logo";

export default function PrivacidadePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            Voltar ao início
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Política de Privacidade
        </h1>
        <p className="mt-2 text-sm text-muted">Última atualização: agosto de 2026</p>

        <div className="prose-devocional mt-8 space-y-6 text-sm leading-relaxed text-foreground/90">
          <p>
            O Meu Devocional é um espaço pessoal para o seu tempo diário com
            Deus. Muito do que você escreve aqui — reflexões, orações,
            pedidos por pessoas queridas — é íntimo. Levamos isso a sério.
            Esta página explica, em linguagem simples, quais dados
            coletamos, por quê, e quais direitos você tem sobre eles.
          </p>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              1. Quais dados coletamos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Dados de cadastro: nome e e-mail.</li>
              <li>
                Conteúdo que você cria: respostas do devocional, orações,
                agradecimentos, anotações, pedidos de oração por pessoas,
                notas e versículos favoritados.
              </li>
              <li>
                Dados de uso: sequência de dias, progresso em planos de
                leitura, preferências de tema.
              </li>
              <li>
                Dados de pagamento (apenas para assinantes Premium):
                processados diretamente pelo Stripe — nós não armazenamos
                número de cartão.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              2. Como usamos esses dados
            </h2>
            <p className="mt-2">
              Usamos seus dados apenas para operar o serviço: mostrar seu
              devocional, calcular sua sequência, salvar suas respostas,
              processar sua assinatura (quando aplicável) e, no plano
              gratuito, exibir anúncios. Não vendemos seus dados a
              terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              3. Quem tem acesso
            </h2>
            <p className="mt-2">
              Seu conteúdo pessoal (respostas, orações, notas) é privado —
              protegido por controle de acesso no banco de dados (Row Level
              Security), de forma que apenas você consegue ler ou editar o
              que escreveu. Usamos os seguintes prestadores de serviço para
              operar o app:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Supabase</strong> — hospedagem do banco de dados e
                autenticação.
              </li>
              <li>
                <strong>Stripe</strong> — processamento de pagamentos
                (assinantes Premium).
              </li>
              <li>
                <strong>Google AdSense</strong> — anúncios no plano
                gratuito (pode usar cookies para personalização; veja a
                política de privacidade do Google).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              4. Seus direitos
            </h2>
            <p className="mt-2">Você pode, a qualquer momento:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Acessar e revisar tudo que escreveu, pelo próprio app.</li>
              <li>Corrigir seus dados de perfil em Configurações → Perfil.</li>
              <li>
                Excluir permanentemente sua conta e todos os seus dados em
                Configurações → Zona de perigo. A exclusão é imediata e
                cancela automaticamente qualquer assinatura ativa.
              </li>
              <li>
                Entrar em contato para dúvidas sobre seus dados através do
                e-mail de suporte informado no app.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-lg font-semibold text-foreground">
              5. Segurança
            </h2>
            <p className="mt-2">
              Seus dados são armazenados de forma criptografada em trânsito
              (HTTPS) e protegidos por autenticação e políticas de acesso a
              nível de linha no banco de dados, restringindo cada registro
              privado ao seu próprio usuário.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted">
        Meu Devocional — feito para o seu tempo diário com Deus.
      </footer>
    </div>
  );
}
