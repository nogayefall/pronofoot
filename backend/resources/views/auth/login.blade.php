<!DOCTYPE html>
<html lang="fr" translate="no">
<head>
    <meta charset="utf-8">
    <meta name="google" content="notranslate">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="#0c1325">
    <link rel="icon" href="/favicon.ico" sizes="32x32 48x48">
    <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
    <title>Connexion administrateur — PronoFoot</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap">
    <style nonce="{{ $cspNonce ?? '' }}">
        :root {
            /* Identité du logo client : bleu nuit, violet, vert menthe (mêmes valeurs que l’administration). */
            --bg: #0a1022; --surface: #111a33; --input-bg: #0d1530; --line: #222e52; --line-input: #2f3c68;
            --text: #eaedfb; --text-2: #c8cee9; --muted: #9ba5c9; --muted-2: #8d97bd;
            --accent: #2ee6a6; --accent-hover: #6ff0c2; --on-accent: #06101f; --violet: #a98bff;
            --critical: #ff8a7b; --critical-bg: rgba(255, 107, 90, .14); --critical-line: rgba(255, 107, 90, .45);
            --font-sans: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
            --font-mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;
            color-scheme: dark;
        }
        * { box-sizing: border-box; }
        body { min-height: 100vh; margin: 0; background: var(--bg); color: var(--text); font-family: var(--font-sans); font-size: 15px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
        h1, p, ul { margin: 0; }
        :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        .layout { display: grid; min-height: 100vh; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }

        .hero { position: relative; display: flex; flex-direction: column; justify-content: space-between; gap: 48px; padding: 56px 64px; overflow: hidden; border-right: 1px solid var(--line); background: linear-gradient(160deg, #111a3a 0%, #0a1022 100%); }
        .pitch { position: absolute; inset: 0; width: 100%; height: 100%; color: var(--violet); opacity: .1; pointer-events: none; }
        .hero > *:not(.pitch) { position: relative; }
        .brand { display: block; }
        .brand img { display: block; width: 168px; height: 168px; border-radius: 22px; box-shadow: 0 18px 40px rgba(0, 0, 0, .35); }
        .eyebrow { margin-bottom: 18px; color: var(--accent); font-family: var(--font-mono); font-size: 13px; letter-spacing: .14em; text-transform: uppercase; }
        .hero-title { max-width: 17ch; font-size: 52px; font-weight: 700; letter-spacing: -.02em; line-height: 1.08; }
        .lead { max-width: 46ch; margin-top: 22px; color: var(--muted); font-size: 18px; }
        .pills { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; list-style: none; }
        .pills li { padding: 7px 15px; border: 1px solid var(--line-input); border-radius: 999px; background: rgba(17, 26, 51, .8); color: var(--text-2); font-size: 14px; }

        .panel { display: grid; place-items: center; padding: 56px 32px; }
        .form-wrap { width: 100%; max-width: 420px; }
        h1 { font-size: 30px; font-weight: 700; letter-spacing: -.015em; }
        .intro { margin-top: 8px; color: var(--muted); }
        .error { margin-top: 20px; padding: 12px 14px; border: 1px solid var(--critical-line); border-radius: 10px; background: var(--critical-bg); color: var(--text); font-size: 14px; }
        form { display: grid; gap: 18px; margin-top: 26px; }
        label { display: grid; gap: 8px; color: var(--text-2); font-size: 14px; font-weight: 600; }
        input { width: 100%; min-height: 50px; padding: 12px 15px; border: 1px solid var(--line-input); border-radius: 10px; background: var(--input-bg); color: var(--text); font: inherit; font-size: 15px; font-weight: 400; }
        input::placeholder { color: var(--muted-2); opacity: .75; }
        input:hover { border-color: var(--muted-2); }
        input:focus-visible { border-color: var(--accent); }
        .code-input { font-family: var(--font-mono); font-size: 20px; letter-spacing: .3em; }
        #authenticator-field { display: grid; gap: 8px; }
        .hint { color: var(--muted); font-size: 13px; font-weight: 400; }
        button { min-height: 54px; margin-top: 6px; border: 0; border-radius: 10px; background: var(--accent); color: var(--on-accent); font: inherit; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 140ms ease; }
        button:hover { background: var(--accent-hover); }
        .legal { margin-top: 26px; color: var(--muted-2); font-size: 13px; }
        [hidden] { display: none !important; }

        @media (max-width: 900px) {
            .layout { grid-template-columns: minmax(0, 1fr); }
            .hero { gap: 32px; padding: 32px 16px; border-right: 0; border-bottom: 1px solid var(--line); }
            .hero-title { max-width: none; font-size: 36px; }
            .brand img { width: 112px; height: 112px; border-radius: 16px; }
            .lead { font-size: 16px; }
            .panel { padding: 36px 16px 48px; }
        }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
    </style>
</head>
<body>
<div class="layout">
    <section class="hero" aria-label="Présentation de PronoFoot">
        <svg class="pitch" viewBox="0 0 720 820" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="50" y="-20" width="620" height="860" />
            <line x1="50" y1="410" x2="670" y2="410" />
            <circle cx="360" cy="410" r="108" />
            <circle cx="360" cy="410" r="5" fill="currentColor" />
            <rect x="190" y="-20" width="340" height="140" />
            <rect x="280" y="-20" width="160" height="40" />
            <rect x="190" y="700" width="340" height="140" />
            <rect x="280" y="800" width="160" height="40" />
        </svg>
        <p class="brand">
            <img src="/brand/logo-full.png" width="168" height="168" alt="PronoFoot">
        </p>
        <div>
            <p class="eyebrow">Détecteur d’opportunités live</p>
            <p class="hero-title">Chaque but change la cote. Repérez l’instant qui compte.</p>
            <p class="lead">Scores exacts, statistiques en direct et règles de décision, réunis dans une seule console réservée à l’administrateur.</p>
        </div>
        @if (! empty($highlights))
            <ul class="pills" aria-label="Fonctionnement actuel">
                @foreach ($highlights as $highlight)
                    <li>{{ $highlight }}</li>
                @endforeach
            </ul>
        @endif
    </section>

    <main class="panel">
        <div class="form-wrap">
            <h1>Connexion</h1>
            <p class="intro">
                @if (! $twoFactorEnabled)
                    Accès réservé à l’administrateur. L’adresse courriel et le mot de passe sont requis.
                @elseif ($testAdministratorEmail)
                    Accès réservé à l’administrateur. Le compte de test local utilise uniquement son adresse courriel et son mot de passe.
                @else
                    Accès réservé à l’administrateur. Mot de passe et code de l’application d’authentification requis.
                @endif
            </p>

            @if ($errors->any())
                <div class="error" role="alert">{{ $errors->first() }}</div>
            @endif

            <form method="POST" action="{{ route('login.store') }}">
                @csrf
                <label for="email">Adresse courriel
                    <input id="email" name="email" type="email" autocomplete="username" value="{{ old('email') }}" placeholder="admin@exemple.com" required autofocus>
                </label>

                <label for="password">Mot de passe
                    <input id="password" name="password" type="password" autocomplete="current-password" required>
                </label>

                @if ($twoFactorEnabled)
                    @php($isLocalTestAdministrator = $testAdministratorEmail !== null && strtolower((string) old('email')) === $testAdministratorEmail)
                    <div id="authenticator-field" @if ($isLocalTestAdministrator) hidden @endif>
                        <label for="authenticator_code">Code d’authentification
                            <input class="code-input" id="authenticator_code" name="authenticator_code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="000000" aria-describedby="totp-hint" @if (! $isLocalTestAdministrator) required @endif>
                        </label>
                        <p class="hint" id="totp-hint">Code à 6 chiffres de ton application TOTP.</p>
                    </div>
                @endif

                <button type="submit">Se connecter</button>
            </form>

            <p class="legal">Aucun gain n’est garanti. Jeu réservé aux 18 ans et plus.</p>
        </div>
    </main>
</div>
@if ($testAdministratorEmail && $twoFactorEnabled)
    <script nonce="{{ $cspNonce ?? '' }}">
        const testAdministratorEmail = @json($testAdministratorEmail);
        const emailInput = document.getElementById('email');
        const authenticatorField = document.getElementById('authenticator-field');
        const authenticatorInput = document.getElementById('authenticator_code');

        function updateAuthenticatorField() {
            const isTestAccount = emailInput.value.trim().toLowerCase() === testAdministratorEmail;
            authenticatorField.hidden = isTestAccount;
            authenticatorInput.required = !isTestAccount;
            if (isTestAccount) authenticatorInput.value = '';
        }

        emailInput.addEventListener('input', updateAuthenticatorField);
        updateAuthenticatorField();
    </script>
@endif
</body>
</html>
