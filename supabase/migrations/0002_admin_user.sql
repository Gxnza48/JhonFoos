-- ============================================================================
--  JOHN FOOS — Usuario administrador
--  Crea: rodriadmin@admin.com  /  Rodri2026
--
--  ⚠ RECOMENDADO (más confiable): crealo desde el panel de Supabase:
--     Authentication -> Users -> Add user -> "Create new user"
--        Email:    rodriadmin@admin.com
--        Password: Rodri2026
--        ✅ Auto Confirm User  (marcar esta opción)
--
--  Si preferís hacerlo por SQL, ejecutá este archivo. Es idempotente
--  (no duplica el usuario si ya existe). Requiere la extensión pgcrypto.
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;

do $$
declare
  v_email text := 'rodriadmin@admin.com';
  v_pass  text := 'Rodri2026';
  v_uid   uuid;
begin
  -- Si ya existe, no hacemos nada
  if exists (select 1 from auth.users where email = v_email) then
    raise notice 'El usuario % ya existe, no se crea de nuevo.', v_email;
    return;
  end if;

  v_uid := gen_random_uuid();

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    v_uid,
    'authenticated',
    'authenticated',
    v_email,
    extensions.crypt(v_pass, extensions.gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    '', '', '', ''
  );

  insert into auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    v_uid,
    v_uid::text,
    json_build_object('sub', v_uid::text, 'email', v_email, 'email_verified', true),
    'email',
    now(),
    now(),
    now()
  );

  raise notice 'Usuario admin creado: %', v_email;
end $$;
