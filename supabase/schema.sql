-- Conversaciones de cada visitante anónimo
create table conversations (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  title text,
  created_at timestamptz not null default now()
);

-- Mensajes de cada conversación
create table messages (
  id text primary key,                 -- id del mensaje que genera el AI SDK
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  parts jsonb not null,                -- contenido completo: texto + tools usadas
  metadata jsonb,                      -- tokens y tiempos (para el panel de debug)
  feedback smallint check (feedback in (-1, 1)),
  posicion integer not null default 0, -- orden dentro de la conversación
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
  lenguaje text,                       -- búsqueda con la que se encontró
  tema text,
  created_at timestamptz not null default now(),
  unique (visitor_id, issue_url)       -- no guardar el mismo issue dos veces
);

create index on conversations (visitor_id);
create index on messages (conversation_id, posicion);
create index on saved_issues (visitor_id);

-- RLS activado y sin políticas: nadie puede leer desde el navegador.
-- Solo el servidor accede, con la secret key.
alter table conversations enable row level security;
alter table messages enable row level security;
alter table saved_issues enable row level security;