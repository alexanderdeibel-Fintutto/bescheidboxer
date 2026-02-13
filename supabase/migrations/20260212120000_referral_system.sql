-- Referral-System fuer BescheidBoxer
-- Belohnung: 30 Bonus-Credits fuer BEIDE Seiten + 7 Tage Kaempfer-Trial

CREATE TABLE IF NOT EXISTS public.amt_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_user_id UUID NOT NULL,
  referred_email TEXT NOT NULL,
  referred_user_id UUID,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_type TEXT DEFAULT 'credits',
  reward_credits INTEGER DEFAULT 30,
  reward_applied_referrer BOOLEAN DEFAULT false,
  reward_applied_referred BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  reward_applied_at TIMESTAMPTZ
);

ALTER TABLE public.amt_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
ON public.amt_referrals FOR SELECT
USING (auth.uid() = referrer_user_id);

CREATE POLICY "Users can create referrals"
ON public.amt_referrals FOR INSERT
WITH CHECK (auth.uid() = referrer_user_id);

CREATE INDEX IF NOT EXISTS idx_amt_referrals_referrer ON public.amt_referrals(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_amt_referrals_code ON public.amt_referrals(referral_code);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'amt_users' AND column_name = 'referral_code') THEN
    ALTER TABLE public.amt_users ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'amt_users' AND column_name = 'referred_by') THEN
    ALTER TABLE public.amt_users ADD COLUMN referred_by UUID;
  END IF;
END $$;
