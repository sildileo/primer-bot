-- Conversaciones de anónimos
create table conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  title text,
  created_at timestamptz not null default now()
);

-- Mensajes de cada conversación
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  metadata jsonb,                  -- tools usadas, tokens, tiempos (para el panel de debug)
  feedback smallint check (feedback in (-1, 1)),  -- dislike / like para rtas
  created_at timestamptz not null default now()
);

-- Issues que guarda cada visitante
create table saved_issues (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  issue_url text not null,
  title text not null,
  repo text not null,
  labels text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (visitor_id, issue_url)   -- no guardar el mismo issue dos veces
);

create index on conversations (visitor_id);
create index on messages (conversation_id, created_at);
create index on saved_issues (visitor_id);

-- RLS activado y sin políticas: nadie puede leer desde el navegador.
-- Solo el servidor accede, con la secret key.
alter table conversations enable row level security;
alter table messages enable row level security;
alter table saved_issues enable row level security;