# Ashish Kumar Prajapati — Portfolio (Next.js 14)

AI/ML developer portfolio with a hardened, Google-Sheets-backed admin panel.
Live: https://codertheashish.vercel.app/ · Admin: `/admin`

## 1. Overview
Next.js App Router + React. Projects and certificates come from a Google Sheet through a Google Apps Script web app
(falling back to `lib/defaultData.js`). `/admin` manages them; everything admin-related is enforced **server-side**.

## 2. Admin panel
Sidebar: Dashboard · Projects · Certificates · Settings · Security · Logout (drawer on mobile).
Projects & certificates support add / edit / delete. Optional `liveUrl` column (col I of *Projects*) is backward-compatible.

## 3. Two-password login
`/admin` → Password 1 → Password 2 → dashboard. Passwords never exist in client code, env vars, the Sheet or GitHub.
The server derives a **peppered scrypt hash** (pepper = `ADMIN_SECURITY_SECRET`) and sends only that hash to Apps Script,
which compares it with hashes stored in **Script Properties**. Step 2 is only reachable with a signed 5-minute proof from step 1.
Sessions are HMAC-signed `HttpOnly`, `Secure` (prod), `SameSite=Strict` cookies, 2 h absolute lifetime, with a server-side
version number (password change = every session dies). All admin APIs re-check the session; mutations also check `Origin`.

### First-run passwords
On a fresh setup (no `ADMIN_HASH_1/2` stored in Apps Script) the owner's first-run passwords work once. The panel then locks
every section except **Security** until BOTH passwords are changed to 12+ characters. After that the first-run values stop working.
To skip this entirely, set your own passwords up front with `node scripts/hash-passwords.mjs`.

## 3b. Editable sections
Admin → About (paragraphs + info cards), Skills (groups + proficiency bars), Experience, Education (with “+ 10th / + 12th” quick-fill).
Each section uses its own auto-created Sheet tab (`AboutText, AboutInfo, SkillGroups, SkillBars, Experience, Education`).
First time: open the section → **Import current content to sheet**, then edit / reorder (▲▼) / add / delete.
Until imported, the website shows the built-in content.

## 4. 3-attempt lockout
Failures at either step share one counter (stale failures are forgotten after 24 h). On the 3rd: **locked 24 h**, persisted in
Apps Script Script Properties (survives refresh, devices, Vercel restarts), guarded by `LockService`.

## 5. Gmail approval
On lock, Apps Script e-mails `OWNER_EMAIL` “Portfolio Admin Security Alert” (time, attempts, lock status, masked IP/browser)
with **APPROVE / DENY** links. Tokens: 256-bit random, only the SHA-256 is stored, valid 60 min, single use, and the link
opens a confirmation page (a button press is required, so mail scanners can’t trigger it).
APPROVE → opens a 15-minute window with 3 fresh attempts; **both passwords are still required**; nobody is logged in.
Failing 3 more times re-locks and sends a new e-mail. DENY → stays locked.

## 6. Change passwords
Admin → Security → choose Password 1 or 2; requires current P1 + P2 + new + confirm; min 12 chars; must differ from the other
password. Signs out all sessions and e-mails you.

## 7. Google Sheet
Tabs: **Projects** `emoji | title | desc | stack | category | githubUrl | num | image | liveUrl(optional)` and
**Certificates** `emoji | name | org | certUrl | image`. A **SecurityLog** tab is auto-created (time, event, masked IP — no secrets).

## 8. Apps Script deployment (one-time)
1. Sheet → Extensions → Apps Script → paste `google-apps-script.gs`.
2. Project Settings → **Script properties**: `API_KEY` (random 32+ chars) and `OWNER_EMAIL`.
   (`ADMIN_HASH_1/2` are optional: leave them out to use the first-run defaults, or generate with `node scripts/hash-passwords.mjs`.)
3. Run any function once (e.g. `lockStatus_`) to grant Mail/Sheets permissions.
4. Deploy → **New deployment** (or Manage → new version) → Web app, Execute as *Me*, Access *Anyone*. Copy the `/exec` URL.
   The old deployment still allows unauthenticated writes — replace it.

Forgot both passwords? Re-run the hash script and edit the two Script Properties.

## 9. Environment variables (Vercel → Settings → Environment Variables)
| Name | Purpose |
|---|---|
| `SHEET_URL` | Apps Script `/exec` URL (already set) |
| `APPS_SCRIPT_API_KEY` | same value as Script Property `API_KEY` |
| `ADMIN_SECURITY_SECRET` | ≥ 32 random chars (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) |
| `SITE_URL` | `https://codertheashish.vercel.app` (links in e-mail; never taken from request headers) |

## 10. Profile photo
Replace `public/profile/ashish-kumar-prajapati.jpg` (square/portrait, face in upper half, ≥ 640 px, < 300 KB).
A placeholder ships now; if the file is missing the Hero shows an “AP” monogram.

## 11. Local development
```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
npm run build
```

## 12. Deploy
`git add . && git commit -m "..." && git push origin main` → Vercel redeploys. Set the env vars first.

## 13. Security notes
- Public sheet reads are allowed; every write/auth action needs `API_KEY` and POST, and the key lives only on the server.
- Content writes are validated (http/https URLs only, length limits) and spreadsheet-formula-injection is neutralised.
- Edits appear on the public site within ~60 s (cache is revalidated immediately on admin writes).
- Sessions are stateless-signed + versioned; logout clears the cookie, password change invalidates all sessions.
- Never commit `.env*`. Rotate `ADMIN_SECURITY_SECRET` ⇒ re-run the hash script and update both hashes.
