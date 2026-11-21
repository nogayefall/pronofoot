<!DOCTYPE html>
<html lang="fr" translate="no">
<head>
    <meta charset="utf-8">
    <meta name="google" content="notranslate">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Administration — PronoFoot</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap">
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
        {{-- Version dans l’adresse (date du fichier compilé) : après un déploiement, le navigateur charge la nouvelle interface au lieu de sa copie en cache. --}}
        @php($assetVersion = fn (string $file): int => is_file(public_path("admin-assets/{$file}")) ? (int) filemtime(public_path("admin-assets/{$file}")) : 0)
        <link rel="stylesheet" href="admin-assets/app.css?v={{ $assetVersion('app.css') }}">
        <script type="module" src="admin-assets/app.js?v={{ $assetVersion('app.js') }}"></script>
    @endif
</head>
<body style="margin:0;background:#08110d;color:#e8f1ea">
    <div id="root" data-admin-name="{{ auth()->user()->name }}">
        <main style="max-width:42rem;margin:4rem auto;padding:2rem 1rem;font-family:'Space Grotesk',system-ui,sans-serif;color:#c5d6ca">
            <h1>Chargement de l’interface PronoFoot…</h1>
            <p>Si cet écran reste affiché, actualise la page. Si le problème continue, ouvre la console du navigateur et transmets le message d’erreur — sans partager tes identifiants.</p>
        </main>
    </div>
    <noscript>Active JavaScript pour afficher l’interface d’administration PronoFoot.</noscript>
</body>
</html>
