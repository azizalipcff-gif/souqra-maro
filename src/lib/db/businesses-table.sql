-- Businesses Table for SOUQORA
-- Create table and RLS policies

create table if not exists businesses (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  city text,
  price numeric,
  whatsapp text,
  image_url text,
  status text default 'active',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS
alter table businesses enable row level security;

-- RLS Policies
create policy "Public can view active businesses" 
on businesses for select 
using (status = 'active');

create policy "Owner can insert" 
on businesses for insert 
with check (auth.uid() = owner_id);

create policy "Owner can update" 
on businesses for update 
using (auth.uid() = owner_id);

create policy "Owner can delete" 
on businesses for delete 
using (auth.uid() = owner_id);

-- Index for better performance
create index if not exists businesses_owner_id_idx on businesses(owner_id);
create index if not exists businesses_status_idx on businesses(status);
create index if not exists businesses_category_idx on businesses(category);
create index if not exists businesses_city_idx on businesses(city);

-- Trigger for updated_at
create or replace function update_businesses_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger businesses_updated_at_trigger
before update on businesses
for each row
execute function update_businesses_updated_at();
