import { Routes, Route } from 'react-router-dom'
import Layout from './app/Layout'
import DashboardPage from './pages/DashboardPage'
import RegionsPage from './pages/RegionsPage'
import FarmsPage from './pages/FarmsPage'
import WaterPage from './pages/WaterPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="regions" element={<RegionsPage />} />
        <Route path="farms" element={<FarmsPage />} />
        <Route path="water" element={<WaterPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}