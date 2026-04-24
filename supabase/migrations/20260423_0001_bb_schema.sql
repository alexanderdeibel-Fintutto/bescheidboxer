-- ============================================================
-- 20260423_0001_bb_schema.sql
-- BescheidBoxer Launch-Readiness
--   Konsolidiertes Schema fuer das gemeinsame Supabase-Projekt
--   (Fintutto). Dockt an die zentrale profiles-Tabelle an
--   (Universal Account Record). KEINE separate amt_users-Tabelle
--   mehr — stattdessen bb_user_state als 1:1-Side-Table zu
--   profiles.id.
--
-- Entwurfsentscheidungen:
--   - Prefix bb_ (BescheidBoxer) statt amt_; konsistent mit der
--     app_source='bescheidboxer'-Kennung in profiles.
--   - user_id UUID = profiles.id = auth.users.id (direkte Kopplung,
--     keine separate PK mehr noetig).
--   - RLS: user_id = auth.uid() (direkt, ohne join).
--   - is_bb_admin() liest profiles.role; Whitelist deckt admin +
--     superadmin ab.
--   - Auto-Provisioning: Trigger auf profiles AFTER INSERT legt
--     bb_user_state automatisch an, wenn app_source='bescheidboxer'.
--     Zusaetzlich heilt Self-Heal am Ende der Migration bestehende
--     BescheidBoxer-Nutzer.
--
-- Diese Migration ist idempotent und kann mehrfach laufen.
-- ============================================================

-- ============================================================
-- 1) bb_user_state — Side-Table mit 1:1 zu profiles.id
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_user_state (
  user_id                      UUID PRIMARY KEY
                                    REFERENCES public.profiles(id)
                                    ON DELETE CASCADE,
  plan                         TEXT NOT NULL DEFAULT 'schnupperer',
  credits_current              INTEGER NOT NULL DEFAULT 0,
  chat_messages_used_today     INTEGER NOT NULL DEFAULT 0,
  chat_messages_reset_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  letters_generated_this_month INTEGER NOT NULL DEFAULT 0,
  scans_this_month             INTEGER NOT NULL DEFAULT 0,
  period_start                 TIMESTAMPTZ NOT NULL DEFAULT now(),
  period_end                   TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),
  stripe_customer_id           TEXT,
  stripe_subscription_id       TEXT,
  points                       INTEGER NOT NULL DEFAULT 0,
  badges                       JSONB  NOT NULL DEFAULT '[]'::jsonb,
  onboarding_completed         BOOLEAN NOT NULL DEFAULT false,
  onboarding_data              JSONB,
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bb_user_state_plan_chk
    CHECK (plan IN ('schnupperer','starter','kaempfer','vollschutz'))
);

CREATE INDEX IF NOT EXISTS bb_user_state_stripe_customer_idx
  ON public.bb_user_state (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS bb_user_state_stripe_sub_idx
  ON public.bb_user_state (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- ============================================================
-- 2) bb_chat_logs — KI-Chat-Historie fuer User
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_chat_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_message  TEXT NOT NULL,
  ai_response   TEXT NOT NULL,
  model         TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  tokens_used   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bb_chat_logs_user_id_idx
  ON public.bb_chat_logs (user_id, created_at DESC);

-- ============================================================
-- 3) bb_scans — Bescheid-Scans
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_scans (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bescheid_type      TEXT,
  ocr_text           TEXT,
  ai_analysis        JSONB,
  fehler_gefunden    INTEGER DEFAULT 0,
  geschaetzter_wert  NUMERIC(10,2) DEFAULT 0,
  original_file_url  TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bb_scans_user_id_idx
  ON public.bb_scans (user_id, created_at DESC);

-- ============================================================
-- 4) bb_letters — generierte Musterschreiben / Widersprueche
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_letters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id     TEXT NOT NULL,
  title           TEXT,
  content         TEXT NOT NULL,
  recipient_name  TEXT,
  recipient_addr  TEXT,
  aktenzeichen    TEXT,
  status          TEXT NOT NULL DEFAULT 'draft',
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bb_letters_status_chk
    CHECK (status IN ('draft','final','sent','archived'))
);

CREATE INDEX IF NOT EXISTS bb_letters_user_id_idx
  ON public.bb_letters (user_id, created_at DESC);

-- ============================================================
-- 5) bb_widersprueche — Widerspruch-Tracker
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_widersprueche (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  bescheid_datum      DATE,
  bescheid_eingang    DATE,
  frist_widerspruch   DATE,
  widerspruch_gesendet DATE,
  status              TEXT NOT NULL DEFAULT 'offen',
  ergebnis            TEXT,
  notizen             TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bb_widersprueche_status_chk
    CHECK (status IN ('offen','eingereicht','stattgegeben','abgelehnt','teilweise_stattgegeben','klage_eingereicht'))
);

CREATE INDEX IF NOT EXISTS bb_widersprueche_user_id_idx
  ON public.bb_widersprueche (user_id, created_at DESC);

-- ============================================================
-- 6) bb_forum_posts / bb_forum_replies
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_forum_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kategorie     TEXT NOT NULL,
  title         TEXT NOT NULL,
  content       TEXT NOT NULL,
  anonym        BOOLEAN NOT NULL DEFAULT false,
  reply_count   INTEGER NOT NULL DEFAULT 0,
  is_pinned     BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bb_forum_posts_created_at_idx
  ON public.bb_forum_posts (created_at DESC);

CREATE TABLE IF NOT EXISTS public.bb_forum_replies (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.bb_forum_posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  anonym     BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bb_forum_replies_post_id_idx
  ON public.bb_forum_replies (post_id, created_at);

-- ============================================================
-- 7) bb_credit_transactions — Ledger fuer Credit-Aenderungen
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bb_credit_transactions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount         INTEGER NOT NULL,
  type           TEXT NOT NULL,
  description    TEXT,
  balance_after  INTEGER,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT bb_credit_transactions_type_chk
    CHECK (type IN ('topup','subscription_credit','spend','refund','admin_adjust'))
);

CREATE INDEX IF NOT EXISTS bb_credit_transactions_user_id_idx
  ON public.bb_credit_transactions (user_id, created_at DESC);

-- ============================================================
-- 8) updated_at-Trigger wiederverwenden
-- ============================================================
DROP TRIGGER IF EXISTS trg_bb_user_state_updated_at  ON public.bb_user_state;
DROP TRIGGER IF EXISTS trg_bb_letters_updated_at     ON public.bb_letters;
DROP TRIGGER IF EXISTS trg_bb_widersprueche_updated_at ON public.bb_widersprueche;
DROP TRIGGER IF EXISTS trg_bb_forum_posts_updated_at ON public.bb_forum_posts;

CREATE TRIGGER trg_bb_user_state_updated_at
  BEFORE UPDATE ON public.bb_user_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_bb_letters_updated_at
  BEFORE UPDATE ON public.bb_letters
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_bb_widersprueche_updated_at
  BEFORE UPDATE ON public.bb_widersprueche
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_bb_forum_posts_updated_at
  BEFORE UPDATE ON public.bb_forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 9) Daily-Reset fuer chat_messages_used_today
-- ============================================================
CREATE OR REPLACE FUNCTION public.reset_bb_daily_chat_count()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF NEW.chat_messages_reset_at < (now() - interval '1 day') THEN
    NEW.chat_messages_used_today := 0;
    NEW.chat_messages_reset_at   := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bb_reset_daily_chat_count ON public.bb_user_state;
CREATE TRIGGER trg_bb_reset_daily_chat_count
  BEFORE UPDATE OF chat_messages_used_today ON public.bb_user_state
  FOR EACH ROW EXECUTE FUNCTION public.reset_bb_daily_chat_count();

-- ============================================================
-- 10) Forum-Reply-Count automatisch pflegen
-- ============================================================
CREATE OR REPLACE FUNCTION public.bb_increment_reply_count()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  UPDATE public.bb_forum_posts
     SET reply_count = reply_count + 1
   WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bb_increment_reply_count ON public.bb_forum_replies;
CREATE TRIGGER trg_bb_increment_reply_count
  AFTER INSERT ON public.bb_forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.bb_increment_reply_count();

-- ============================================================
-- 11) Admin-Helper: is_bb_admin()
-- ============================================================
-- SECURITY DEFINER, weil er die RLS auf profiles durchbricht, um
-- die Rolle des aktuellen Users zu lesen. Liefert false, wenn kein
-- User eingeloggt ist.
CREATE OR REPLACE FUNCTION public.is_bb_admin()
  RETURNS BOOLEAN
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  SELECT role INTO v_role
    FROM public.profiles
   WHERE id = auth.uid();
  RETURN COALESCE(v_role IN ('admin','superadmin'), false);
END;
$$;

-- ============================================================
-- 12) Auto-Provisioning bb_user_state fuer BescheidBoxer-User
-- ============================================================
CREATE OR REPLACE FUNCTION public.ensure_bb_user_state()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
AS $$
BEGIN
  IF NEW.app_source = 'bescheidboxer' THEN
    INSERT INTO public.bb_user_state (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'ensure_bb_user_state failed for profile %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ensure_bb_user_state ON public.profiles;
CREATE TRIGGER trg_ensure_bb_user_state
  AFTER INSERT OR UPDATE OF app_source ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_bb_user_state();

-- ============================================================
-- 13) Row Level Security einschalten + erzwingen
-- ============================================================
ALTER TABLE public.bb_user_state           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_chat_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_scans                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_letters              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_widersprueche        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_forum_posts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_forum_replies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bb_credit_transactions  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.bb_user_state           FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_chat_logs            FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_scans                FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_letters              FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_widersprueche        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_forum_posts          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_forum_replies        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.bb_credit_transactions  FORCE ROW LEVEL SECURITY;

-- ============================================================
-- 14) RLS-Policies
-- ============================================================

-- bb_user_state: eigener Zustand ------------------------------
DROP POLICY IF EXISTS bb_user_state_self_select ON public.bb_user_state;
CREATE POLICY bb_user_state_self_select ON public.bb_user_state
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS bb_user_state_self_insert ON public.bb_user_state;
CREATE POLICY bb_user_state_self_insert ON public.bb_user_state
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_user_state_self_update ON public.bb_user_state;
CREATE POLICY bb_user_state_self_update ON public.bb_user_state
  FOR UPDATE
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_user_state_admin_all ON public.bb_user_state;
CREATE POLICY bb_user_state_admin_all ON public.bb_user_state
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_chat_logs -----------------------------------------------
DROP POLICY IF EXISTS bb_chat_logs_self_select ON public.bb_chat_logs;
CREATE POLICY bb_chat_logs_self_select ON public.bb_chat_logs
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS bb_chat_logs_self_insert ON public.bb_chat_logs;
CREATE POLICY bb_chat_logs_self_insert ON public.bb_chat_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_chat_logs_admin_all ON public.bb_chat_logs;
CREATE POLICY bb_chat_logs_admin_all ON public.bb_chat_logs
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_scans ---------------------------------------------------
DROP POLICY IF EXISTS bb_scans_self_all ON public.bb_scans;
CREATE POLICY bb_scans_self_all ON public.bb_scans
  FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_scans_admin_all ON public.bb_scans;
CREATE POLICY bb_scans_admin_all ON public.bb_scans
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_letters -------------------------------------------------
DROP POLICY IF EXISTS bb_letters_self_all ON public.bb_letters;
CREATE POLICY bb_letters_self_all ON public.bb_letters
  FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_letters_admin_all ON public.bb_letters;
CREATE POLICY bb_letters_admin_all ON public.bb_letters
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_widersprueche -------------------------------------------
DROP POLICY IF EXISTS bb_widersprueche_self_all ON public.bb_widersprueche;
CREATE POLICY bb_widersprueche_self_all ON public.bb_widersprueche
  FOR ALL
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_widersprueche_admin_all ON public.bb_widersprueche;
CREATE POLICY bb_widersprueche_admin_all ON public.bb_widersprueche
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_forum_posts: Posts sind oeffentlich lesbar, Schreiben nur
-- fuer authentifizierte User (eigene Zeilen).
DROP POLICY IF EXISTS bb_forum_posts_public_read ON public.bb_forum_posts;
CREATE POLICY bb_forum_posts_public_read ON public.bb_forum_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS bb_forum_posts_self_insert ON public.bb_forum_posts;
CREATE POLICY bb_forum_posts_self_insert ON public.bb_forum_posts
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_forum_posts_self_update ON public.bb_forum_posts;
CREATE POLICY bb_forum_posts_self_update ON public.bb_forum_posts
  FOR UPDATE
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_forum_posts_admin_all ON public.bb_forum_posts;
CREATE POLICY bb_forum_posts_admin_all ON public.bb_forum_posts
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_forum_replies -------------------------------------------
DROP POLICY IF EXISTS bb_forum_replies_public_read ON public.bb_forum_replies;
CREATE POLICY bb_forum_replies_public_read ON public.bb_forum_replies
  FOR SELECT USING (true);

DROP POLICY IF EXISTS bb_forum_replies_self_insert ON public.bb_forum_replies;
CREATE POLICY bb_forum_replies_self_insert ON public.bb_forum_replies
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_forum_replies_self_update ON public.bb_forum_replies;
CREATE POLICY bb_forum_replies_self_update ON public.bb_forum_replies
  FOR UPDATE
    USING      (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS bb_forum_replies_admin_all ON public.bb_forum_replies;
CREATE POLICY bb_forum_replies_admin_all ON public.bb_forum_replies
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- bb_credit_transactions: Nutzer nur lesen, Schreiben nur
-- Service-Role (Webhook) — INSERT-Policy gibt es absichtlich
-- nicht, damit Frontends NICHT selbst Ledger-Zeilen erfinden koennen.
DROP POLICY IF EXISTS bb_credit_transactions_self_select ON public.bb_credit_transactions;
CREATE POLICY bb_credit_transactions_self_select ON public.bb_credit_transactions
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS bb_credit_transactions_admin_all ON public.bb_credit_transactions;
CREATE POLICY bb_credit_transactions_admin_all ON public.bb_credit_transactions
  FOR ALL
    USING      (public.is_bb_admin())
    WITH CHECK (public.is_bb_admin());

-- ============================================================
-- 15) Self-Heal: bestehende BescheidBoxer-User nachtraglich
--     mit bb_user_state ausstatten (idempotent).
-- ============================================================
INSERT INTO public.bb_user_state (user_id)
SELECT p.id
  FROM public.profiles p
 WHERE p.app_source = 'bescheidboxer'
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================
-- 16) Admin-Seed: alexander.deibel@googlemail.com -> superadmin
-- ============================================================
-- Update wirkt nur, wenn das Profil bereits existiert. Beim ersten
-- Signup uebers BescheidBoxer-Frontend wird zusaetzlich die
-- Rolle ueber raw_user_meta_data.role = 'superadmin' gesetzt.
UPDATE public.profiles
   SET role = 'superadmin'
 WHERE lower(email) = 'alexander.deibel@googlemail.com'
   AND role <> 'superadmin';

-- ============================================================
-- 17) Safety-Log
-- ============================================================
DO $$
DECLARE
  v_bb_users INT;
  v_admins   INT;
BEGIN
  SELECT COUNT(*) INTO v_bb_users FROM public.bb_user_state;
  SELECT COUNT(*) INTO v_admins
    FROM public.profiles
   WHERE role IN ('admin','superadmin');
  RAISE NOTICE 'BescheidBoxer Schema OK: bb_user_state=%, admins in profiles=%', v_bb_users, v_admins;
END$$;

-- ============================================================
-- ENDE 20260423_0001_bb_schema.sql
-- ============================================================
