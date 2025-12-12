-- Add billing fields to organizations
alter table public.organizations 
add column subscription_status text default 'incomplete',
add column stripe_customer_id text,
add column billing_email text;

-- Create a function to count rooms (properties) for billing
create or replace function public.get_billable_count(org_id uuid)
returns integer as $$
begin
  return (select count(*) from public.properties where organization_id = org_id);
end;
$$ language plpgsql security definer;
