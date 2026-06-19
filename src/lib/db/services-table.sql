-- Services Table for SOUQORA
-- Create table and RLS policies

create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  city text,
  price_range text,
  whatsapp text,
  image_url text,
  verified boolean default false,
  featured boolean default false,
  rating numeric default 0,
  reviews_count integer default 0,
  status text default 'active',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table services enable row level security;

-- RLS Policies
create policy "Public can view active services" 
on services for select 
using (status = 'active');

create policy "Owner can insert" 
on services for insert 
with check (auth.uid() = owner_id);

create policy "Owner can update" 
on services for update 
using (auth.uid() = owner_id);

create policy "Owner can delete" 
on services for delete 
using (auth.uid() = owner_id);

-- Index for better performance
create index if not exists services_owner_id_idx on services(owner_id);
create index if not exists services_status_idx on services(status);
create index if not exists services_category_idx on services(category);
create index if not exists services_city_idx on services(city);
create index if not exists services_featured_idx on services(featured);

-- Trigger for updated_at
create or replace function update_services_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger services_updated_at_trigger
before update on services
for each row
execute function update_services_updated_at();
