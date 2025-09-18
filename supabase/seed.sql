-- Seed demo data for Propimatch (idempotent)
-- Assumes you have created these demo users via Supabase Auth:
--   aisha@example.com  (seeker)
--   omar@example.com   (lister)
-- If they don't exist yet, this script will no-op safely.

-- Resolve user ids for known emails
with u1 as (
  select id from auth.users where email = 'aisha@example.com'
), u2 as (
  select id from auth.users where email = 'omar@example.com'
)
-- Ensure profiles exist
insert into public.profiles(user_id, role, name, credits)
select id, 'seeker', 'Aisha Khan', 20 from u1
on conflict (user_id) do nothing;

insert into public.profiles(user_id, role, name, credits)
select id, 'lister', 'Omar Ali', 100 from u2
on conflict (user_id) do nothing;

-- Insert listings owned by Omar
insert into public.listings (user_id, type, title, description, price, location, bedrooms, bathrooms, area_sqft, images, amenities, lat, lng, approved)
select u2.id, 'sale', 'Marina View 2BR Apartment', 'Stunning view of Dubai Marina, high floor', 2100000,
       'Dubai Marina, Dubai', 2, 2, 1250, array['https://picsum.photos/seed/marina/800/600'], array['Pool','Gym','Parking'], 25.080, 55.139, true
from u2
on conflict do nothing;

insert into public.listings (user_id, type, title, description, price, location, bedrooms, bathrooms, area_sqft, images, amenities, lat, lng, approved)
select u2.id, 'rent', 'JVC Cozy 1BR', 'Affordable 1BR in JVC', 6500,
       'Jumeirah Village Circle, Dubai', 1, 1, 780, array['https://picsum.photos/seed/jvc/800/600'], array['Balcony','Security'], 25.056, 55.205, true
from u2
on conflict do nothing;

insert into public.listings (user_id, type, title, description, price, location, bedrooms, bathrooms, area_sqft, images, amenities, lat, lng, approved)
select u2.id, 'rent', 'Abu Dhabi Corniche 3BR', 'Sea view family apartment', 12000,
       'Corniche, Abu Dhabi', 3, 3, 1600, array['https://picsum.photos/seed/ad/800/600'], array['Sea View','Maid Room'], 24.485, 54.353, true
from u2
on conflict do nothing;

-- Insert requests owned by Aisha
insert into public.requests (user_id, type, location, budget, bedrooms, amenities, status)
select u1.id, 'rent', 'Dubai Marina', 8000, 2, array['Pool','Parking'], 'open' from u1
on conflict do nothing;

insert into public.requests (user_id, type, location, budget, bedrooms, status)
select u1.id, 'buy', 'JVC', 2000000, 2, 'matched' from u1
on conflict do nothing;

insert into public.requests (user_id, type, location, budget, bedrooms, amenities, status)
select u1.id, 'buy', 'Dubai Marina', 2300000, 2, array['Parking'], 'open' from u1
on conflict do nothing;

-- One conversation between Aisha and Omar with two messages
do $$
declare c_id uuid;
begin
  if exists (select 1 from auth.users where email in ('aisha@example.com','omar@example.com')) then
    -- create conversation only if it doesn't exist for these two participants
    if not exists (
      select 1 from public.conversations c
      join public.conversation_participants p1 on p1.conversation_id = c.id
      join public.conversation_participants p2 on p2.conversation_id = c.id and p2.user_id <> p1.user_id
      where p1.user_id = (select id from auth.users where email='aisha@example.com')
        and p2.user_id = (select id from auth.users where email='omar@example.com')
    ) then
      insert into public.conversations default values returning id into c_id;
      insert into public.conversation_participants(conversation_id, user_id)
      values (c_id, (select id from auth.users where email='aisha@example.com')),
             (c_id, (select id from auth.users where email='omar@example.com'));
      insert into public.messages(conversation_id, sender_id, content)
      values (c_id, (select id from auth.users where email='omar@example.com'), 'Hello! I saw your request for a 2BR in Marina.'),
             (c_id, (select id from auth.users where email='aisha@example.com'), 'Hi! Yes, do you have options within 8k?');
    end if;
  end if;
end $$;

-- A couple of transactions for Aisha
insert into public.transactions(user_id, type, amount, description)
select (select id from auth.users where email='aisha@example.com'), 'purchase', 20, 'Welcome bonus'
where exists (select 1 from auth.users where email='aisha@example.com')
on conflict do nothing;

-- A notification
insert into public.notifications(user_id, type, title, body)
select (select id from auth.users where email='aisha@example.com'), 'match', 'New Match Found', 'We found 3 new properties matching your request.'
where exists (select 1 from auth.users where email='aisha@example.com')
on conflict do nothing;



