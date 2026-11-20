-- Update the previous sample contact values without overwriting any
-- unrelated contact details that have already been customized in Admin → Site Content.
update public.site_content
set value = '+233 59 687 1415'
where section = 'contact'
  and key = 'phone'
  and value = '+233 20 123 4567';

update public.site_content
set value = '0596871415'
where section = 'contact'
  and key = 'whatsapp'
  and value in ('233201234567', '233596871415');

update public.site_content
set value = 'grainypalacefarms@gmail.com'
where section = 'contact'
  and key = 'email';

update public.site_content
set value = 'grainypalacefarms@gmail.com'
where section = 'footer'
  and key = 'email'
  and lower(trim(value)) = 'info@grainypalacefarm.com';

update public.site_content
set value = 'Begoro, Eastern Region, Ghana'
where section in ('contact', 'footer')
  and key = 'address';

insert into public.site_content (section, key, value) values
  ('contact', 'phone', '+233 59 687 1415'),
  ('contact', 'whatsapp', '0596871415'),
  ('contact', 'email', 'grainypalacefarms@gmail.com'),
  ('contact', 'address', 'Begoro, Eastern Region, Ghana'),
  ('contact', 'hours', 'Monday – Saturday, 7:00am – 6:00pm GMT')
on conflict (section, key) do nothing;
