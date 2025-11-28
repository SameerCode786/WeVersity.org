-- Updated trigger function for reliable public.users creation
-- This replaces any existing handle_new_user function

-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Create improved trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Only insert if users row does not exist
  if not exists (select 1 from public.users u where u.id = new.id) then
    insert into public.users (
      id, 
      email, 
      full_name, 
      user_name, 
      phone_number, 
      avatar_url, 
      bio, 
      expertise, 
      role, 
      created_at
    )
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      coalesce(new.raw_user_meta_data->>'user_name', ''),
      coalesce(new.raw_user_meta_data->>'phone_number', ''),
      coalesce(new.raw_user_meta_data->>'avatar_url', ''),
      coalesce(new.raw_user_meta_data->>'bio', ''),
      coalesce(new.raw_user_meta_data->>'expertise', ''),
      coalesce(new.raw_user_meta_data->>'role', 'student'),
      timezone('utc', now())
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Verify trigger was created
select 'Trigger created successfully' as status;
