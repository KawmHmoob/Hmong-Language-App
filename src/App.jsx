import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { SubscriptionProvider } from './context/SubscriptionContext.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import { NotebookProvider } from './context/NotebookContext.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Alphabet from './pages/Alphabet.jsx'
import Course from './pages/Course.jsx'
import Learn from './pages/Learn.jsx'
import Lesson from './pages/Lesson.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'
import Notebook from './pages/Notebook.jsx'
import Review from './pages/Review.jsx'
import Search from './pages/Search.jsx'
import QuizMenu from './components/quiz/QuizMenu.jsx'
import QuizEngine from './components/quiz/QuizEngine.jsx'
import VocabCategoryGrid from './components/vocabulary/VocabCategoryGrid.jsx'
import VocabList from './components/vocabulary/VocabList.jsx'
import WordDetail from './components/vocabulary/WordDetail.jsx'
import LoginForm from './components/account/LoginForm.jsx'
import RegisterForm from './components/account/RegisterForm.jsx'
import ProfilePage from './components/account/ProfilePage.jsx'

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
                  <Route path="/alphabet" element={<Navigate to="/alphabet/consonants" replace />} />
                  <Route path="/alphabet/:tab" element={<Alphabet />} />
                  <Route path="/course" element={<Navigate to="/course/grammar" replace />} />
                  <Route path="/course/:tab" element={<Course />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/learn/:unitId/:lessonId" element={<Lesson />} />
                  <Route path="/vocabulary" element={<VocabCategoryGrid />} />
                  <Route path="/vocabulary/:categoryId" element={<VocabList />} />
                  <Route path="/vocabulary/:categoryId/:wordId" element={<WordDetail />} />
                  <Route path="/notebook" element={<Navigate to="/notebook/saved" replace />} />
                  <Route path="/notebook/:tab" element={<Notebook />} />
                  <Route path="/review" element={<Review />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/quiz" element={<QuizMenu />} />
                  <Route path="/quiz/:topicId" element={<QuizEngine />} />
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/register" element={<RegisterForm />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="/settings" element={<Settings />} />
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
