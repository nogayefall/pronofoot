<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Connexion administrateur — PronoFoot</title>
    <style>
        :root { color-scheme: light; font-family: Arial, sans-serif; color: #13251e; background: #f2f6f4; }
        body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 1rem; box-sizing: border-box; }
        main { width: min(100%, 26rem); padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 1rem 3rem #163d2c12; box-sizing: border-box; }
        h1 { margin: 0 0 .5rem; font-size: 1.7rem; }
        p { color: #53645c; line-height: 1.5; }
        label { display: block; margin-top: 1rem; font-weight: 700; }
        input { display: block; width: 100%; box-sizing: border-box; margin-top: .45rem; padding: .8rem; border: 1px solid #b9c8c0; border-radius: .5rem; font: inherit; }
        button { width: 100%; margin-top: 1.5rem; padding: .85rem; border: 0; border-radius: .5rem; background: #08764c; color: white; font: inherit; font-weight: 700; cursor: pointer; }
        .error { margin-top: 1rem; padding: .75rem; border-radius: .5rem; background: #fff0f0; color: #982b2b; }
        .hint { font-size: .9rem; }
    </style>
</head>
<body>
<main>
    <h1>PronoFoot</h1>
    <p>Connexion réservée à l’administrateur.
        @if ($testAdministratorEmail)
            Le compte de test local utilise uniquement son adresse courriel et son mot de passe.
        @else
            Le mot de passe et le code de l’application d’authentification sont requis.
        @endif
    </p>

    @if ($errors->any())
        <div class="error" role="alert">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('login.store') }}">
        @csrf
        <label for="email">Adresse courriel</label>
        <input id="email" name="email" type="email" autocomplete="username" value="{{ old('email') }}" required autofocus>

        <label for="password">Mot de passe</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>

        @php($isLocalTestAdministrator = $testAdministratorEmail !== null && strtolower((string) old('email')) === $testAdministratorEmail)
        <div id="authenticator-field" @if ($isLocalTestAdministrator) hidden @endif>
            <label for="authenticator_code">Code d’authentification</label>
            <input id="authenticator_code" name="authenticator_code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" aria-describedby="totp-hint" @if (! $isLocalTestAdministrator) required @endif>
            <p class="hint" id="totp-hint">Saisis le code à 6 chiffres de ton application TOTP.</p>
        </div>

        <button type="submit">Se connecter</button>
    </form>
</main>
@if ($testAdministratorEmail)
    <script>
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
