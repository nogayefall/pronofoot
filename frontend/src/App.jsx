import { useState } from 'react'
import { createRuleTestPayload } from './adminData'
import './App.css'

const navigation = [
  { id: 'overview', label: 'Vue d’ensemble', icon: 'grid' },
  { id: 'matches', label: 'Matchs suivis', icon: 'ball' },
  { id: 'rules', label: 'Moteur de règles', icon: 'sliders' },
  { id: 'tester', label: 'Testeur manuel', icon: 'flask' },
  { id: 'journal', label: 'Journal', icon: 'list' },
  { id: 'settings', label: 'Paramètres', icon: 'settings' },
]

const ruleDescriptions = [
  { id: 'F121-C', title: 'Écart directionnel', status: 'Disponible', detail: 'Compare les cotes du score actuel et des deux scores suivants.' },
  { id: 'F121-C.2', title: 'Avantage de deux buts', status: 'Disponible', detail: 'Suit le leader lorsque son avantage atteint au moins deux buts.' },
  { id: 'F121-D', title: 'Score élevé', status: 'Partiel', detail: 'Seuil de cote documenté ; les situations hors exemples restent à confirmer.' },
  { id: 'F121-E', title: 'Règle de mi-temps / écart', status: 'À confirmer', detail: 'Les documents donnent deux définitions contradictoires.' },
  { id: 'F121-K · T · X', title: 'Écarts et tendance', status: 'Non défini', detail: 'La formule exacte doit être fournie avant activation.' },
  { id: 'F122 · F124 · F126', title: 'Règles complémentaires', status: 'Non défini', detail: 'Formules métier à confirmer par le client.' },
]

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    ball: <><circle cx="12" cy="12" r="9" /><path d="m12 8 2.5 1.8-.9 2.9h-3.2l-.9-2.9L12 8Z" /><path d="m12 3 0 5m8 1-5.5.8M18 18l-4.4-5.3M6 18l4.4-5.3M4 9l5.5.8" /></>,
    sliders: <><path d="M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3" /><circle cx="15" cy="6" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="15" cy="18" r="2" /></>,
    flask: <><path d="M9 3h6m-5 0v6l-5.3 8.1A2.5 2.5 0 0 0 6.8 21h10.4a2.5 2.5 0 0 0 2.1-3.9L14 9V3M8 15h8" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7-.2.1-1.5.9-.2 1.9h-2.8l-.3-1.9-1.6-.9-.2-.1-1.7.7-1.4-2.4 1.5-1.1v-2l-1.5-1.1 1.4-2.4 1.7.7 1.8-1V6.4h2.8l.3 1.9 1.6.9.2.1 1.7-.7 1.4 2.4-1.5 1.1v2Z" transform="translate(-1.2 -1)" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 3 20 6v5c0 5.1-3.4 8.3-8 10-4.6-1.7-8-4.9-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  }

  return <svg {...common}>{paths[name] ?? paths.grid}</svg>
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  )
}

function EmptyState({ icon, title, message }) {
  return (
    <div className="empty-state">
      <span className="empty-icon"><Icon name={icon} size={23} /></span>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  )
}

function SimulationResult({ result }) {
  const decision = result.decision
  const direction = result.rules['F121-C']?.details?.selectedTeam
  const directionLabel = direction === 'home' ? 'Équipe à domicile' : direction === 'away' ? 'Équipe à l’extérieur' : 'Direction indéterminée'

  return (
    <div className="simulation-result">
      <div className={`simulation-verdict ${decision.shouldAlert ? 'verdict-alert' : 'verdict-neutral'}`}>
        <span className="verdict-mark">{decision.shouldAlert ? '✓' : '—'}</span>
        <div><strong>{decision.shouldAlert ? 'Signal théorique détecté' : 'Aucun signal'}</strong><p>{decision.reason}</p></div>
      </div>
      <div className="simulation-section"><h3>Règles évaluées</h3>
        {Object.values(result.rules).map((rule) => (
          <div className="simulation-line" key={rule.ruleId}><span>{rule.ruleId}</span><strong>{rule.verdict === 'candidate' ? (rule.suggestedAction || directionLabel) : rule.verdict === 'not_defined' ? 'Non définie' : rule.verdict === 'abstain' ? 'Abstention' : 'Aucun signal'}</strong></div>
        ))}
      </div>
      <div className="simulation-section"><h3>Filtres de sécurité</h3>
        {Object.entries(result.filters).map(([filter, outcome]) => (
          <div className="simulation-line" key={filter}><span>{outcome.label}</span><strong className={outcome.passed ? 'filter-passed' : 'filter-failed'}>{outcome.passed ? 'Validé' : 'Refusé'}</strong></div>
        ))}
      </div>
      <div className="simulation-disclaimer"><Icon name="shield" size={17} /><span>{decision.convergenceScore === null ? 'Convergence non calculée : aucun score de méthode n’est fourni. Simulation sans alerte transmissible.' : `Convergence ${decision.convergenceScore} % — simulation uniquement.`}</span></div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [testFields, setTestFields] = useState({
    homeScore: '0',
    awayScore: '0',
    oddsText: '0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80',
    vitalityScore: '61',
    oddsChangePercent: '0',
  })
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? ''
  const adminName = document.querySelector('[data-admin-name]')?.dataset.adminName || 'Administrateur'
  const activeLabel = navigation.find((item) => item.id === activePage)?.label ?? 'Vue d’ensemble'

  const updateTestField = (field) => (event) => {
    setTestFields((previous) => ({ ...previous, [field]: event.target.value }))
    setTestResult(null)
    setTestError('')
  }

  async function testRules(event) {
    event.preventDefault()
    setIsTesting(true)
    setTestError('')
    setTestResult(null)

    try {
      const payload = createRuleTestPayload(testFields)
      const response = await fetch('/admin/rule-test', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Le test n’a pas pu être exécuté.')
      }

      setTestResult(result)
    } catch (error) {
      setTestError(error.message || 'Une erreur empêche le test.')
    } finally {
      setIsTesting(false)
    }
  }

  async function logout() {
    setLogoutError('')

    try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-CSRF-TOKEN': csrfToken, Accept: 'application/json' },
      })

      if (!response.ok) {
        throw new Error('La déconnexion a échoué. Réessaie.')
      }

      window.location.assign('/login')
    } catch (error) {
      setLogoutError(error.message || 'La déconnexion a échoué.')
    }
  }

  function selectPage(page) {
    setActivePage(page)
    setMobileMenuOpen(false)
    setTestResult(null)
    setTestError('')
  }

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
        <a className="brand" href="/admin" onClick={(event) => { event.preventDefault(); selectPage('overview') }}>
          <span className="brand-mark">P</span>
          <span><strong>PRONOFOOT</strong><small>ADMIN · PHASE 1</small></span>
        </a>
        <div className="sidebar-label">ESPACE ADMIN</div>
        <nav className="navigation" aria-label="Navigation principale">
          {navigation.map((item) => (
            <button
              className={`nav-item ${activePage === item.id ? 'nav-item-active' : ''}`}
              key={item.id}
              onClick={() => selectPage(item.id)}
              type="button"
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.id === 'matches' && <span className="nav-count">0</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-spacer" />
        <div className="phase-card">
          <span className="phase-card-icon"><Icon name="shield" size={18} /></span>
          <div><strong>Phase 1</strong><p>Détecteur live · aucun pari automatique</p></div>
        </div>
        <button className="profile-button" type="button" onClick={logout}>
          <span className="avatar">{adminName.slice(0, 1).toUpperCase()}</span>
          <span className="profile-copy"><strong>{adminName}</strong><small>Administrateur</small></span>
          <span className="profile-exit">↗</span>
        </button>
        {logoutError && <p className="sidebar-error" role="alert">{logoutError}</p>}
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu-button" type="button" aria-label="Ouvrir le menu" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span /><span /><span />
          </button>
          <div className="breadcrumb"><span>Administration</span><Icon name="arrow" size={14} /><strong>{activeLabel}</strong></div>
          <div className="topbar-right">
            <span className="secure-label"><span className="secure-dot" /> Session sécurisée</span>
            <span className="topbar-avatar">{adminName.slice(0, 1).toUpperCase()}</span>
          </div>
        </header>

        <div className="content">
          {activePage === 'overview' && (
            <div className="overview-page">
              <PageHeading eyebrow="TABLEAU DE BORD" title="Vue d’ensemble" description="État du détecteur et rencontres suivies en direct." />
              <section className="overview-highlights" aria-label="État du scan et alertes actives">
                <article className="scan-status-panel">
                  <div className="scan-status-copy">
                    <p className="overview-section-label">STATUT DU SCAN</p>
                    <h2>Détecteur de matchs</h2>
                    <p>Le scan démarrera après la configuration des connexions API.</p>
                  </div>
                  <span className="scan-status-badge"><span /> Inactif</span>
                </article>
                <article className="active-alerts-panel">
                  <p className="overview-section-label">ALERTES ACTIVES</p>
                  <strong>0</strong>
                  <p>Aucune alerte en cours</p>
                </article>
              </section>
              <section className="overview-matches" aria-labelledby="overview-matches-title">
                <div className="overview-matches-heading">
                  <div>
                    <p className="overview-section-label">SUIVI EN DIRECT</p>
                    <h2 id="overview-matches-title">Matchs suivis</h2>
                  </div>
                  <button className="overview-primary-action" type="button" onClick={() => selectPage('matches')}>
                    Gérer les matchs <Icon name="arrow" size={18} />
                  </button>
                </div>
                <div className="overview-table-scroll">
                  <table className="overview-match-table">
                    <thead>
                      <tr>
                        <th scope="col">Équipes</th>
                        <th scope="col">Score</th>
                        <th scope="col">Minute</th>
                        <th scope="col">Vitalité</th>
                        <th scope="col">État</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="5">
                          <strong>Aucun match suivi pour le moment</strong>
                          <span>Les rencontres apparaîtront ici lorsque les sources de données seront configurées.</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {activePage === 'matches' && (
            <>
              <PageHeading eyebrow="SUIVI EN DIRECT" title="Matchs suivis" description="Choisissez les rencontres à surveiller dès que les sources de données seront configurées." action={<span className="count-badge">0 match</span>} />
              <div className="notice notice-neutral"><span className="notice-icon"><Icon name="clock" size={18} /></span><div><strong>La sélection des matchs sera disponible après le branchement des API</strong><p>Les fournisseurs, les quotas et les marchés en direct doivent d’abord être validés à l’étape de faisabilité.</p></div></div>
              <section className="content-panel matches-panel"><div className="panel-heading"><div><h2>Rencontres sélectionnées</h2><p>Le CDC Phase 1 prévoit une sélection administrateur, dans la limite des quotas API.</p></div><span className="count-badge">0 / —</span></div><EmptyState icon="search" title="La liste est vide" message="Aucun faux match n’est affiché. Les matchs réels ou du pilote fictif seront ajoutés lorsque le flux sera prêt." /></section>
            </>
          )}

          {activePage === 'rules' && (
            <>
              <PageHeading eyebrow="CONFIGURATION" title="Moteur de règles" description="Consultez les règles documentées et identifiez clairement celles qui nécessitent encore une décision." action={<span className="phase-badge phase-badge-muted">Paramètres par défaut</span>} />
              <div className="notice notice-warning"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>Les règles non définies ne déclenchent jamais de signal</strong><p>Les formules métier manquantes doivent être confirmées avant toute activation.</p></div></div>
              <section className="content-panel rules-panel">
                <div className="panel-heading"><div><h2>Règles Phase 1</h2><p>Disponibilité selon les documents client</p></div><span className="count-badge">{ruleDescriptions.length} règles</span></div>
                <div className="rule-table">{ruleDescriptions.map((rule) => <article className="rule-row" key={rule.id}><span className="rule-id">{rule.id}</span><div className="rule-info"><strong>{rule.title}</strong><p>{rule.detail}</p></div><span className={`status-pill ${rule.status === 'Disponible' ? 'status-ready' : rule.status === 'Partiel' ? 'status-partial' : 'status-pending'}`}>{rule.status}</span></article>)}</div>
              </section>
              <section className="content-panel settings-preview">
                <div className="panel-heading"><div><h2>Seuils mentionnés dans le CDC</h2><p>Valeurs de référence, à rendre configurables par l’administrateur.</p></div></div>
                <div className="threshold-grid"><div><span>Écart directionnel</span><strong>&lt; 1,50</strong></div><div><span>Vitalité minimale</span><strong>40 / 100</strong></div><div><span>Cotes scores suivants</span><strong>&lt; 7,00</strong></div><div><span>Convergence</span><strong>&gt; 75 %</strong></div><div><span>Signal Over 0,5 MT</span><strong>&lt; 1,25</strong></div><div><span>Tendance stable</span><strong>À confirmer</strong></div></div>
              </section>
            </>
          )}

          {activePage === 'tester' && (
            <>
              <PageHeading eyebrow="VALIDATION" title="Testeur manuel" description="Évalue un jeu de cotes fourni, sans envoyer de signal ni placer de pari." action={<span className="phase-badge phase-badge-muted"><Icon name="flask" size={15} /> Simulation uniquement</span>} />
              <div className="notice notice-neutral"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>Les résultats affichés sont une simulation locale</strong><p>Aucun message n’est envoyé. Les notes de convergence ne sont pas inventées et ne seront disponibles qu’avec des scores de méthode définis.</p></div></div>
              <div className="tester-layout">
                <section className="content-panel tester-panel">
                  <div className="panel-heading"><div><h2>Situation du match</h2><p>Saisis les données réelles ou les cas de test fournis.</p></div><span className="manual-tag">F125</span></div>
                  <form className="tester-form" onSubmit={testRules}>
                    <div className="form-row"><label>Score à domicile<input min="0" max="20" type="number" value={testFields.homeScore} onChange={updateTestField('homeScore')} required /></label><span className="score-separator">–</span><label>Score à l’extérieur<input min="0" max="20" type="number" value={testFields.awayScore} onChange={updateTestField('awayScore')} required /></label></div>
                    <label>Cotes des scores exacts <span className="label-note">une ligne par score</span><textarea rows="5" spellCheck="false" value={testFields.oddsText} onChange={updateTestField('oddsText')} placeholder={'0-0 = 7,50\n1-0 = 8,60\n0-1 = 9,80'} required /></label>
                    <div className="form-row form-row-wide"><label>Vitalité (0–100)<input min="0" max="100" step="0.1" type="number" value={testFields.vitalityScore} onChange={updateTestField('vitalityScore')} required /></label><label>Variation des cotes sur 2 min (%)<input step="0.1" type="number" value={testFields.oddsChangePercent} onChange={updateTestField('oddsChangePercent')} required /><span className="field-help">Valeur négative = cotes en baisse.</span></label></div>
                    <p className="format-hint">Format accepté : <code>score = cote</code> ou <code>score : cote</code>. La tendance stable reste à confirmer.</p>
                    {testError && <div className="form-error" role="alert">{testError}</div>}
                    <button className="primary-button" type="submit" disabled={isTesting}>{isTesting ? 'Évaluation…' : 'Évaluer la situation'} <Icon name="arrow" size={17} /></button>
                  </form>
                </section>
                <section className="content-panel result-panel" aria-live="polite"><div className="panel-heading"><div><h2>Résultat de la simulation</h2><p>Analyse des règles et des filtres</p></div></div>{testResult ? <SimulationResult result={testResult} /> : <EmptyState icon="flask" title="Prêt à tester" message="Les résultats apparaîtront ici après l’évaluation des données saisies." />}</section>
              </div>
            </>
          )}

          {activePage === 'journal' && (
            <>
              <PageHeading eyebrow="HISTORIQUE" title="Journal des opportunités" description="Les détections, refus de filtres et résultats seront consignés ici." action={<button className="secondary-button" type="button" disabled><Icon name="search" size={16} /> Filtrer</button>} />
              <section className="content-panel journal-panel"><div className="panel-heading"><div><h2>Événements récents</h2><p>Chaque évaluation doit conserver la décision et sa justification.</p></div><span className="count-badge">0 événement</span></div><EmptyState icon="list" title="Le journal est vide" message="L’enregistrement des détections et statistiques sera relié à la base aux prochaines étapes." /></section>
            </>
          )}

          {activePage === 'settings' && (
            <>
              <PageHeading eyebrow="CONFIGURATION" title="Paramètres" description="Les valeurs ci-dessous viennent du cahier des charges. Leur sauvegarde et leur application au scan seront reliées plus tard." />
              <div className="notice notice-warning"><span className="notice-icon"><Icon name="shield" size={18} /></span><div><strong>La configuration serveur n’est pas encore branchée</strong><p>Cette page présente les références. Aucun réglage n’est enregistré ou appliqué au scan pour l’instant.</p></div></div>
              <section className="content-panel settings-preview"><div className="panel-heading"><div><h2>Valeurs de référence</h2><p>Seuils explicitement cités dans les documents de Phase 1.</p></div></div><div className="threshold-grid"><div><span>Écart domicile / extérieur</span><strong>1,50</strong></div><div><span>Cas particulier 0–0</span><strong>2,50 / 1,00</strong></div><div><span>Vitalité minimale</span><strong>40 / 100</strong></div><div><span>Seuil F121-D</span><strong>7,00</strong></div><div><span>Over 0,5 — seconde mi-temps</span><strong>1,25</strong></div><div><span>Seuil de convergence</span><strong>75 %</strong></div><div><span>Expiration de l’alerte</span><strong>15 min</strong></div><div><span>Intervalle du scan</span><strong>30 s</strong></div><div><span>Tendance stable</span><strong>À confirmer</strong></div><div><span>Normalisation vitalité</span><strong>À confirmer</strong></div></div></section>
            </>
          )}
        </div>
        <footer className="footer"><span>PRONOFOOT · Phase 1</span><span>Détecteur live réservé à l’administration · aucun pari automatique</span></footer>
      </main>
    </div>
  )
}

export default App
