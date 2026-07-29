import { useState } from 'react'
import './App.css'

export function formatCount(n) {
  // return n === 1 ? '1 deploy' : `${n} deploys`
  return `${n} deploys`
}

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="app">
      <div className="badge">CI/CD Demo</div>
      <h1>GitHub → AWS Amplify</h1>
      <p className="subtitle">
        Push to <code>main</code>, and this site rebuilds and redeploys
        automatically to a global CDN.
      </p>

      <button className="counter" onClick={() => setCount((c) => c + 1)}>
        Ship it — {formatCount(count)}
      </button>

      <ul className="pipeline">
        <li>1. Commit &amp; push to GitHub</li>
        <li>2. GitHub Actions runs Lint + Tests + Build</li>
        <li>3. Amplify builds from <code>amplify.yml</code></li>
        <li>4. Deployed to HTTPS + CDN in ~2 min</li>
      </ul>

      <footer>Built with Vite + React · Hosted on AWS Amplify</footer>
    </main>
  )
}
