# MoneyBuddy – Beta

Statische Web-App mit Supabase-Anmeldung und RLS-geschützten Buchungen/Sparzielen. `index.html` ist die Beta-Anwendung; `demo/index.html` bewahrt den bisherigen Design-Prototyp.

## GitHub-Upload

Auf GitHub im Repository `michaelimkeulrich-spec/MoneyBuddy-App` **Add file → Upload files** wählen und die Dateien `index.html`, `app.js`, `style.css`, `README.md` aus diesem Paket hochladen. Den Ordner `demo` bei Bedarf separat anlegen und `demo/index.html` dort hochladen. Anschließend **Commit changes**.

## Vercel

In Vercel **Add New → Project → Import Git Repository → MoneyBuddy-App**. Framework **Other**, Root Directory **./**, kein Build Command. Das bestehende leere Vercel-Projekt `moneybuddy` ist noch nicht mit Git verknüpft; alternativ in dessen Settings → Git verbinden. Es kann bei Import ein neues Projekt entstehen.

## Testbetrieb und Datenschutz

- Vor der geschlossenen Beta Testkonten in Supabase Auth anlegen/einladen; öffentliche Registrierung deaktivieren.
- Keine echten Daten Minderjähriger vor Prüfung von Einwilligungen, Datenschutzhinweisen, Aufbewahrung und Zugriffen verwenden.
- Der im Browser eingebundene `sb_publishable_...`-Schlüssel ist öffentlich und ausdrücklich dafür vorgesehen. **Niemals** `service_role`/secret keys veröffentlichen.
- RLS ist in der bestehenden Supabase-Datenbank aktiviert. Elternverknüpfungen sind bis zu einer sicheren Einladungslösung gesperrt.
- Die Kaufprüfung ist nur eine Näherung und berücksichtigt weder zukünftige Verpflichtungen noch den tatsächlichen Bankkontostand.
- Keine Bankanbindung; keine Passwort- oder Kontodaten in GitHub speichern.
