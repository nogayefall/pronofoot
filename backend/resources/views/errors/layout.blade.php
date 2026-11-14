<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>@yield('title') — PronoFoot</title>
    {{-- Styles autorisés par la Content-Security-Policy grâce au nonce de la requête. --}}
    <style nonce="{{ $cspNonce ?? '' }}">
        :root { color-scheme: light; font-family: Arial, sans-serif; color: #13251e; background: #f2f6f4; }
        body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 1rem; box-sizing: border-box; }
        main { width: min(100%, 30rem); padding: 2rem; background: #ffffff; border-radius: 1rem; box-shadow: 0 1rem 3rem #163d2c12; box-sizing: border-box; }
        .code { margin: 0; color: #08764c; font-size: 1rem; font-weight: 700; letter-spacing: .05em; }
        h1 { margin: .4rem 0 .75rem; font-size: 1.6rem; }
        p { margin: 0 0 1rem; color: #53645c; font-size: 1rem; line-height: 1.5; }
        a { display: inline-block; min-height: 44px; padding: .75rem 1rem; box-sizing: border-box; border-radius: .5rem; background: #08764c; color: #ffffff; font-weight: 700; text-decoration: none; }
        a:focus-visible { outline: 3px solid #13251e; outline-offset: 2px; }
    </style>
</head>
<body>
<main>
    <p class="code">Erreur @yield('code')</p>
    <h1>@yield('title')</h1>
    <p>@yield('message')</p>
    <a href="{{ url('/login') }}">Retour à la connexion</a>
</main>
</body>
</html>
