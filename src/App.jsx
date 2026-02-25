import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AnalysisPage from './pages/AnalysisPage';
import logo from './assets/logo.png';
import './App.css';

const { Header, Content } = Layout;

function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img src={logo} alt="과업지시서 분석 대시보드" style={{ height: '32px', display: 'block' }} />
      </Header>

      <Content style={{ padding: '24px', background: '#f5f5f5' }}>
        <Routes>
          <Route path="/" element={<AnalysisPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppLayout />} />
    </Routes>
  );
}

export default App;
