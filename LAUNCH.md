# Tiltshield — Launch checklist

## A. Production environment (Vercel)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `FLUTTERWAVE_SECRET_KEY` (live)
- [ ] `FLUTTERWAVE_PUBLIC_KEY` (live)
- [ ] `FLUTTERWAVE_WEBHOOK_SECRET` (if verifying signatures)
- [ ] `NEXT_PUBLIC_APP_URL` = production URL
- [ ] Production branch = `main`, auto-deploy on

## B. Supabase

- [ ] Run `supabase/schema.sql` (profiles, assessments, scores)
- [ ] Run family/history SQL if used
- [ ] Auth: decide email confirm ON/OFF; test both paths
- [ ] RLS policies enabled; test anon + authenticated
- [ ] Redirect URLs include production domain

## C. Payments (Flutterwave USD)

- [ ] Live mode keys (not test)
- [ ] Products: lifetime $29, family tier
- [ ] Webhook URL: `https://YOUR_DOMAIN/api/flutterwave/webhook`
- [ ] Test purchase → unlock premium on return
- [ ] Failed payment does not unlock

## D. Core user path (manual QA)

1. [ ] Land → optional PWA install prompt
2. [ ] Sign up / log in
3. [ ] Complete assessment
4. [ ] **Today** shows score, exposure, priority, intel, nearby
5. [ ] **What If** → Income stops uses real numbers
6. [ ] **Prepare** Plan / Topics / Templates; map search vendors
7. [ ] **Intel** tabs + personalized cards
8. [ ] **Nearby** location + map + agent
9. [ ] **More** → Settings (name), Vault, Family, Calculators
10. [ ] Retake assessment updates plan

## E. Mobile

- [ ] Bottom nav: Today, Prepare, Intel, What If, More
- [ ] Back works on nested screens
- [ ] Safe-area padding on iOS
- [ ] Offline banner; core checklists usable offline

## F. Content / trust

- [ ] Intel is preparedness-framed (not panic)
- [ ] Landing matches product promise
- [ ] Privacy: device vault; cloud only when signed in

## G. Optional before industry demo

- [ ] Custom domain + HTTPS
- [ ] Capacitor Android/iOS (`NATIVE.md`)
- [ ] 60–90s recorded walkthrough
- [ ] Seed 2–3 family profiles for demo

## Go / no-go

**Go** when A–E pass on a clean phone browser.
**No-go** if payment unlock fails or assessment → score is broken.
