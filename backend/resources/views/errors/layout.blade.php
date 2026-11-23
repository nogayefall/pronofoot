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
    <title>@yield('title') — PronoFoot</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap">
    {{-- Styles autorisés par la Content-Security-Policy grâce au nonce de la requête. --}}
    <style nonce="{{ $cspNonce ?? '' }}">
        :root { color-scheme: dark; font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif; color: #eaedfb; background: #0a1022; }
        body { min-height: 100vh; margin: 0; display: grid; place-items: center; padding: 16px; box-sizing: border-box; background: #0a1022; }
        main { width: min(100%, 30rem); padding: 32px; border: 1px solid #222e52; border-radius: 14px; background: #111a33; box-sizing: border-box; }
        .code { margin: 0; color: #2ee6a6; font-family: 'JetBrains Mono', ui-monospace, monospace; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; }
        h1 { margin: 10px 0 12px; font-size: 26px; font-weight: 700; }
        p { margin: 0 0 20px; color: #9ba5c9; font-size: 15px; line-height: 1.5; }
        a { display: inline-flex; align-items: center; min-height: 48px; padding: 0 18px; box-sizing: border-box; border-radius: 10px; background: #2ee6a6; color: #06101f; font-weight: 600; text-decoration: none; }
        a:hover { background: #6ff0c2; }
        a:focus-visible { outline: 2px solid #2ee6a6; outline-offset: 2px; }
    </style>
</head>
<body>
<main>
    <img src="/brand/logo-emblem.png" width="48" height="48" alt="PronoFoot" style="display:block;margin-bottom:16px;border-radius:10px">
    <p class="code">Erreur @yield('code')</p>
    <h1>@yield('title')</h1>
    <p>@yield('message')</p>
    <a href="{{ url('/login') }}">Retour à la connexion</a>
</main>
</body>
</html>
