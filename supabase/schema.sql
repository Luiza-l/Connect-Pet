-- ==============================================================================
-- Schema do Banco de Dados ConnectPet / Acolher no Supabase
-- ==============================================================================

-- 1. Habilitar extensão pgcrypto / uuid-ossp (se necessário)
create extension if not exists "pgcrypto";

-- 2. Tabela de Animais (pets)
create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null check (species in ('dog', 'cat')),
  breed text not null default 'SRD',
  size text not null check (size in ('small', 'medium', 'large')),
  approximate_age text not null default '1 ano',
  age_category text not null check (age_category in ('puppy', 'young', 'adult', 'senior')),
  sex text not null check (sex in ('male', 'female')),
  status text not null default 'available' check (status in ('available', 'in_process', 'adopted')),
  vaccinated boolean not null default false,
  castrated boolean not null default false,
  dewormed boolean not null default false,
  vaccination_details text,
  special_needs text,
  photos text[] not null default '{}'::text[],
  headline text,
  story text,
  temperament text[] not null default '{}'::text[],
  temperament_description text,
  guardian_id text not null,
  guardian_name text not null,
  guardian_type text not null check (guardian_type in ('individual', 'ngo')),
  guardian_phone text,
  guardian_email text,
  city text default 'São Paulo',
  state text default 'SP',
  neighborhood text default 'Vila Mariana',
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Índices para otimização de busca na tabela pets
create index if not exists idx_pets_status on public.pets (status);
create index if not exists idx_pets_species on public.pets (species);
create index if not exists idx_pets_guardian_id on public.pets (guardian_id);

-- 3. Tabela de Candidaturas de Adoção (applications)
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid references public.pets (id) on delete set null,
  candidate_name text not null,
  candidate_email text not null,
  candidate_phone text,
  guardian_id text not null,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'approved', 'rejected', 'completed')),
  candidate jsonb not null default '{}'::jsonb,
  housing jsonb not null default '{}'::jsonb,
  routine jsonb not null default '{}'::jsonb,
  finance jsonb not null default '{}'::jsonb,
  dossier jsonb not null default '{}'::jsonb,
  automated_analysis jsonb not null default '{}'::jsonb,
  guardian_notes text default '',
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Índices para otimização de busca na tabela applications
create index if not exists idx_applications_pet_id on public.applications (pet_id);
create index if not exists idx_applications_guardian_id on public.applications (guardian_id);
create index if not exists idx_applications_status on public.applications (status);
create index if not exists idx_applications_candidate_email on public.applications (candidate_email);

-- 4. Tabela de Mensagens da Candidatura (application_messages)
create table if not exists public.application_messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications (id) on delete cascade,
  sender_id text not null,
  sender_name text not null,
  sender_role text not null check (sender_role in ('adopter', 'candidate', 'guardian', 'system')),
  message text not null,
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Índices para busca de mensagens por candidatura
create index if not exists idx_app_messages_app_id on public.application_messages (application_id);
create index if not exists idx_app_messages_created_at on public.application_messages (created_at);

-- 5. Tabela de Perfis de Usuário (profiles)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('adopter', 'guardian')),
  name text not null,
  email text not null,
  primary_phone text,
  secondary_phone text,
  avatar text,
  -- Campos específicos de Adotante
  cpf text,
  rg text,
  birth_date text,
  profession text,
  social_media text,
  housing_type text,
  has_adequate_space boolean,
  has_other_pets boolean,
  other_pets_details text,
  has_children boolean,
  species_preference text,
  size_preference text,
  -- Campos comuns e de Guardião / ONG
  guardian_type text check (guardian_type in ('individual', 'ngo')),
  responsible_name text,
  document text,
  city text,
  state text,
  neighborhood text,
  description text,
  bio text,
  verified boolean default false,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Garantir que colunas recentes existam mesmo se a tabela já foi criada anteriormente
alter table public.profiles add column if not exists avatar text;
alter table public.profiles add column if not exists housing_type text;
alter table public.profiles add column if not exists has_adequate_space boolean;
alter table public.profiles add column if not exists has_other_pets boolean;
alter table public.profiles add column if not exists other_pets_details text;
alter table public.profiles add column if not exists has_children boolean;
alter table public.profiles add column if not exists species_preference text;
alter table public.profiles add column if not exists size_preference text;

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_email on public.profiles (email);

-- 6. Tabela de Favoritos / Curtidas (favorites)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  pet_id uuid not null references public.pets (id) on delete cascade,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  unique (user_id, pet_id)
);

create index if not exists idx_favorites_user_id on public.favorites (user_id);
create index if not exists idx_favorites_pet_id on public.favorites (pet_id);

-- 7. Configuração de Row Level Security (RLS)
alter table public.pets enable row level security;
alter table public.applications enable row level security;
alter table public.application_messages enable row level security;
alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

-- Políticas para Pets (catálogo é público para leitura; gerenciamento por autenticados)
drop policy if exists "Allow public read access for pets" on public.pets;
create policy "Allow public read access for pets"
  on public.pets for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow insert for pets" on public.pets;
create policy "Allow insert for pets"
  on public.pets for insert
  to authenticated
  with check (guardian_id = (select auth.uid())::text);

drop policy if exists "Allow update for pets" on public.pets;
create policy "Allow update for pets"
  on public.pets for update
  to authenticated
  using (guardian_id = (select auth.uid())::text)
  with check (guardian_id = (select auth.uid())::text);

drop policy if exists "Allow delete for pets" on public.pets;
create policy "Allow delete for pets"
  on public.pets for delete
  to authenticated
  using (guardian_id = (select auth.uid())::text);

-- Políticas para Profiles
drop policy if exists "Allow user to read own profile or public guardian profiles" on public.profiles;
create policy "Allow user to read own profile or public guardian profiles"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id or role = 'guardian');

drop policy if exists "Allow public read for guardian profiles" on public.profiles;
create policy "Allow public read for guardian profiles"
  on public.profiles for select
  to anon
  using (role = 'guardian');

drop policy if exists "Allow user to insert own profile" on public.profiles;
create policy "Allow user to insert own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Allow user to update own profile" on public.profiles;
create policy "Allow user to update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Allow user to delete own profile" on public.profiles;
create policy "Allow user to delete own profile"
  on public.profiles for delete
  to authenticated
  using ((select auth.uid()) = id);

-- Políticas para Favorites (apenas o próprio usuário acessa seus favoritos)
drop policy if exists "Allow user to read own favorites" on public.favorites;
create policy "Allow user to read own favorites"
  on public.favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Allow user to insert own favorites" on public.favorites;
create policy "Allow user to insert own favorites"
  on public.favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Allow user to delete own favorites" on public.favorites;
create policy "Allow user to delete own favorites"
  on public.favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Políticas para Candidaturas (Adotante vê as suas, Guardião vê as recebidas)
drop policy if exists "Allow participants to view applications" on public.applications;
create policy "Allow participants to view applications"
  on public.applications for select
  to authenticated
  using (
    guardian_id = (select auth.uid())::text
    or candidate_email = (select auth.jwt() ->> 'email')
    or (candidate ->> 'id') = (select auth.uid())::text
  );

drop policy if exists "Allow candidate to insert application" on public.applications;
create policy "Allow candidate to insert application"
  on public.applications for insert
  to authenticated
  with check (
    candidate_email = (select auth.jwt() ->> 'email')
    or (candidate ->> 'id') = (select auth.uid())::text
  );

drop policy if exists "Allow guardian to update application" on public.applications;
create policy "Allow guardian to update application"
  on public.applications for update
  to authenticated
  using (guardian_id = (select auth.uid())::text)
  with check (guardian_id = (select auth.uid())::text);

-- Políticas para Mensagens de Candidatura
drop policy if exists "Allow participants to read application messages" on public.application_messages;
create policy "Allow participants to read application messages"
  on public.application_messages for select
  to authenticated
  using (
    exists (
      select 1 from public.applications a
      where a.id = application_id
      and (
        a.guardian_id = (select auth.uid())::text
        or a.candidate_email = (select auth.jwt() ->> 'email')
        or (a.candidate ->> 'id') = (select auth.uid())::text
      )
    )
  );

drop policy if exists "Allow participants to insert application messages" on public.application_messages;
create policy "Allow participants to insert application messages"
  on public.application_messages for insert
  to authenticated
  with check (
    sender_id = (select auth.uid())::text
    and exists (
      select 1 from public.applications a
      where a.id = application_id
      and (
        a.guardian_id = (select auth.uid())::text
        or a.candidate_email = (select auth.jwt() ->> 'email')
        or (a.candidate ->> 'id') = (select auth.uid())::text
      )
    )
  );

