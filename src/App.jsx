import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SubscriptionProvider } from './context/SubscriptionContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import { NotebookProvider } from './context/NotebookContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Reference from './pages/Reference.jsx'
import Learn from './pages/Learn.jsx'
import Unit from './pages/Unit.jsx'
import Lesson from './pages/Lesson.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import Notebook from './pages/Notebook.jsx'
import Search from './pages/Search.jsx'
import Speak from './pages/Speak.jsx'
import SpeakPhrase from './pages/SpeakPhrase.jsx'
import SpeakFamily from './pages/SpeakFamily.jsx'
import Words from './pages/Words.jsx'
import WordsSession from './pages/WordsSession.jsx'
import QuizMenu from './pages/QuizMenu.jsx'
import QuizEngine from './pages/QuizEngine.jsx'
import VocabCategoryGrid from './pages/VocabCategoryGrid.jsx'
import VocabList from './pages/VocabList.jsx'
import WordDetail from './pages/WordDetail.jsx'
import LoginForm from './pages/LoginForm.jsx'
import RegisterForm from './pages/RegisterForm.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import BattlePass from './pages/BattlePass.jsx'
import ToneEval from './pages/ToneEval.jsx'
import SentenceBuilder from './pages/SentenceBuilder.jsx'
import Onboarding from './pages/Onboarding.jsx'


// Legacy URL support. /alphabet/:tab kept its tab names, so it maps 1:1.
// /course/:tab is messier: 'grammar' has a home in Reference, but 'everyday'
// moved to Speak and 'reading' became a Learn unit — so each lands where its
// content actually went, not on a generic 404.
function AlphabetRedirect() {
  const { tab } = useParams()
  return <Navigate to={`/reference/${tab}`} replace />
}

function CourseRedirect() {
  const { tab } = useParams()
  const map = {
    grammar: '/reference/grammar',
    everyday: '/speak',
    reading: '/learn/readings',
  }
  return <Navigate to={map[tab] || '/reference/grammar'} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            <NotebookProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/speak" element={<Speak />} />
                  {/* more specific route first so 'family' isn't read as a phraseId */}
                  <Route path="/speak/family/:familyId" element={<SpeakFamily />} />
                  <Route path="/speak/:phraseId" element={<SpeakPhrase />} />
                  <Route path="/words" element={<Words />} />
                  <Route path="/words/session" element={<WordsSession />} />
                  {/* Placeholder — roadmap Phase 2, no exercise data yet. */}
                  <Route path="/words/sentences" element={<SentenceBuilder />} />
                  {/* Reference (was /alphabet; absorbed the old /course grammar tables) */}
                  <Route path="/reference" element={<Navigate to="/reference/consonants" replace />} />
                  <Route path="/reference/:tab" element={<Reference />} />
                  {/* Old URLs keep working — see notes/34 */}
                  <Route path="/alphabet" element={<Navigate to="/reference/consonants" replace />} />
                  <Route path="/alphabet/:tab" element={<AlphabetRedirect />} />
                  <Route path="/course" element={<Navigate to="/reference/grammar" replace />} />
                  <Route path="/course/:tab" element={<CourseRedirect />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/learn/:unitId" element={<Unit />} />
                  <Route path="/learn/:unitId/:lessonId" element={<Lesson />} />
                  <Route path="/vocabulary" element={<VocabCategoryGrid />} />
                  <Route path="/vocabulary/:categoryId" element={<VocabList />} />
                  <Route path="/vocabulary/:categoryId/:wordId" element={<WordDetail />} />
                  <Route path="/notebook" element={<Navigate to="/notebook/saved" replace />} />
                  <Route path="/notebook/:tab" element={<Notebook />} />
                  {/* Review moved into the Words section; old URL keeps working. */}
                  <Route path="/review" element={<Navigate to="/words/session" replace />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/quiz" element={<QuizMenu />} />
                  <Route path="/quiz/:topicId" element={<QuizEngine />} />
                  {/* Season layer. Both live under Home rather than becoming a
                      sixth nav section — the five-section IA is load-bearing
                      (notes/30). No /leaderboard/:userId by design (notes/57). */}
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/pass" element={<BattlePass />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="/settings" element={<Settings />} />
                  {/* Dev-only tone-scorer harness — renders a notice in prod. */}
                  <Route path="/tone-eval" element={<ToneEval />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </NotebookProvider>
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
