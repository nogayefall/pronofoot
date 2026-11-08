<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Administration — PronoFoot</title>
    @php($viteDevServer = is_file(public_path('admin-assets/hot')) ? trim(file_get_contents(public_path('admin-assets/hot'))) : null)
    @if (app()->environment('local') && is_string($viteDevServer) && $viteDevServer !== '')
        <script type="module" src="{{ $viteDevServer }}/@@vite/client"></script>
        <script type="module">
            import { injectIntoGlobalHook } from "{{ $viteDevServer }}/@@react-refresh";
            injectIntoGlobalHook(window);
            window.$RefreshReg$ = () => {};
            window.$RefreshSig$ = () => (type) => type;
        </script>
        <script type="module" src="{{ $viteDevServer }}/src/main.jsx"></script>
    @else
        <link rel="stylesheet" href="admin-assets/app.css">
        <script type="module" src="admin-assets/app.js"></script>
    @endif
</head>
<body>
    <div id="root" data-admin-name="{{ auth()->user()->name }}">
        <main style="max-width:42rem;margin:4rem auto;padding:2rem;font-family:Arial,sans-serif;color:#263a30">
            <h1>Chargement de l’interface PronoFoot…</h1>
            <p>Si cet écran reste affiché, actualise la page. Si le problème continue, ouvre la console du navigateur et transmets le message d’erreur — sans partager tes identifiants.</p>
        </main>
    </div>
    <noscript>Active JavaScript pour afficher l’interface d’administration PronoFoot.</noscript>
</body>
</html>
