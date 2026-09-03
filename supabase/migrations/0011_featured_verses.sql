-- Pool curado de versículos "bonitinhos" pro card de versículo da semana.
-- Substitui o sorteio entre TODOS os 31 mil versículos (que podia cair em
-- coisas como listas de sacrifício em Levítico) por um sorteio entre um
-- conjunto pequeno e cuidado, que o admin vai populando aos poucos.
create table public.featured_verses (
  id uuid primary key default gen_random_uuid(),
  verse_reference text not null,
  verse_text text not null,
  created_at timestamptz not null default now()
);

alter table public.featured_verses enable row level security;

create policy "featured_verses_select_authenticated" on public.featured_verses
  for select using (auth.role() = 'authenticated');

insert into featured_verses (verse_reference, verse_text) values
('Salmos 23:1', 'O Senhor é o meu pastor; nada me faltará.'),
('Salmos 46:10', 'Aquietem-se e saibam que eu sou Deus.'),
('Provérbios 3:5-6', 'Confie no Senhor de todo o coração e não se apoie em seu próprio entendimento; reconheça-o em todos os seus caminhos, e ele endireitará as suas veredas.'),
('Isaías 41:10', 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.'),
('Jeremias 29:11', 'Porque eu bem sei os planos que tenho para vocês, diz o Senhor: planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro.'),
('Lamentações 3:22-23', 'As misericórdias do Senhor não têm fim; elas se renovam a cada manhã. Grande é a tua fidelidade.'),
('Mateus 11:28', 'Venham a mim, todos os que estão cansados e sobrecarregados, e eu darei descanso a vocês.'),
('João 3:16', 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'),
('Romanos 8:28', 'Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito.'),
('Filipenses 4:13', 'Tudo posso naquele que me fortalece.'),
('Filipenses 4:6-7', 'Não andem ansiosos por nada; em tudo, pela oração e com gratidão, apresentem a Deus os seus pedidos. E a paz de Deus, que ultrapassa todo entendimento, guardará os seus corações e mentes em Cristo Jesus.'),
('Salmos 91:1-2', 'Quem habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi ao Senhor: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.'),
('Josué 1:9', 'Não fui eu que ordenei a você? Seja forte e corajoso! Não se apavore, nem se desanime, pois o Senhor, o seu Deus, estará com você por onde você andar.'),
('1 Coríntios 13:4,7', 'O amor é paciente, é bondoso... tudo sofre, tudo crê, tudo espera, tudo suporta.'),
('Gálatas 5:22-23', 'Mas o fruto do Espírito é amor, alegria, paz, paciência, amabilidade, bondade, fidelidade, mansidão e domínio próprio.'),
('Apocalipse 21:4', 'Ele enxugará dos seus olhos toda lágrima. Não haverá mais morte, nem tristeza, nem choro, nem dor, pois a antiga ordem já passou.');
