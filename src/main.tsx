import { createRoot } from 'react-dom/client'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'
import { Shell } from './app/Shell'
import { StudyProvider } from './app/StudyProvider'
import Foundations, { FoundationLesson } from './pages/Foundations'
import Coach from './pages/Coach'
import Dashboard from './pages/Dashboard'
import Ipa from './pages/Ipa'
import Fluency from './pages/Fluency'
import Practice from './pages/Practice'
import Settings from './pages/Settings'
import Structures from './pages/Structures'
import Tests, { TestHistoryRoute, TestRoute } from './pages/Tests'
import Verbs from './pages/Verbs'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StudyProvider><HashRouter><Routes>
    <Route element={<Shell />}>
      <Route index element={<Dashboard />} />
      <Route path="foundations" element={<Foundations />} />
      <Route path="foundations/:id" element={<FoundationLesson />} />
      <Route path="ipa" element={<Ipa />} />
      <Route path="verbs" element={<Verbs />} />
      <Route path="structures" element={<Structures />} />
      <Route path="tests" element={<Tests />} />
      <Route path="tests/:id" element={<TestRoute />} />
      <Route path="tests/:id/history/:attempt?" element={<TestHistoryRoute />} />
      <Route path="practice" element={<Practice />} />
      <Route path="practice/speaking" element={<Fluency />} />
      <Route path="coach" element={<Coach />} />
      <Route path="settings" element={<Settings />} />
      <Route path="*" element={<section className="panel stack"><h1>Không tìm thấy trang</h1><Link to="/">Về trung tâm</Link></section>} />
    </Route>
  </Routes></HashRouter></StudyProvider>
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  void navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(error => console.warn('PWA service worker:', error))
}
