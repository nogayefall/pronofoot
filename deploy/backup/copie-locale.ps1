# PronoFoot - copie hors du serveur de la derniere sauvegarde de la base (poste Windows de l'administrateur).
# Lecture seule sur le serveur. Verifie la somme SHA-256, garde 30 jours de copies. Aucun mot de passe ici : cle SSH.
# Fichier sans accents : Windows PowerShell 5.1 lit les scripts sans BOM dans la page de codes du systeme.
param(
    [string]$Server = 'ubuntu@158.69.198.25',
    [string]$Destination = (Join-Path $env:USERPROFILE 'PronoFoot-sauvegardes'),
    [int]$RetentionDays = 30
)
$ErrorActionPreference = 'Stop'
$ssh = Join-Path $env:SystemRoot 'System32\OpenSSH\ssh.exe'
$options = '-o BatchMode=yes -o ConnectTimeout=20'
$log = Join-Path $Destination 'copie.log'

if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination | Out-Null
    # Acces limite au compte courant (la sauvegarde n'est pas chiffree).
    & icacls $Destination /inheritance:r /grant:r "$($env:USERNAME):(OI)(CI)F" | Out-Null
}

function Write-Log([string]$Message) {
    Add-Content -Path $log -Value ("{0} {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message) -Encoding utf8
}

try {
    $list = 'sudo find /var/backups/pronofoot -maxdepth 1 -name "pronofoot-????-??-??-????.sql.gz" | sort | tail -1'
    $remote = (& $ssh -o BatchMode=yes -o ConnectTimeout=20 $Server ($list -replace '"', '\"') | Select-Object -Last 1)
    if ([string]::IsNullOrWhiteSpace($remote)) { throw 'Aucune sauvegarde trouvee sur le serveur.' }
    $remote = $remote.Trim()
    $target = Join-Path $Destination (Split-Path $remote -Leaf)

    if (-not (Test-Path $target)) {
        # Redirection par cmd : PowerShell 5.1 abimerait un flux binaire.
        $partial = "$target.partial"
        & cmd.exe /d /c "`"$ssh`" $options $Server sudo cat $remote > `"$partial`""
        if ($LASTEXITCODE -ne 0) { throw 'Echec de la copie SSH.' }
        $expected = ((& $ssh -o BatchMode=yes -o ConnectTimeout=20 $Server "sudo sha256sum $remote") -split '\s+')[0]
        $actual = (Get-FileHash -Algorithm SHA256 -Path $partial).Hash
        if ($actual -ne $expected) { Remove-Item $partial -Force; throw 'Somme SHA-256 differente : copie refusee.' }
        Move-Item $partial $target -Force
        Write-Log "Copie verifiee : $(Split-Path $target -Leaf)"
    }

    Get-ChildItem -Path $Destination -Filter 'pronofoot-*.sql.gz' -File |
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
        Remove-Item -Force
} catch {
    Write-Log "ERREUR : $($_.Exception.Message)"
    exit 1
}
