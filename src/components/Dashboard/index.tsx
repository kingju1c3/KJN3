import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from './AdminDashboard';
import PremiumDashboard from './PremiumDashboard';
import BasicDashboard from './BasicDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.clearanceLevel >= 4) {
    return <AdminDashboard />;
  }

  if (user.clearanceLevel >= 2) {
    return <PremiumDashboard />;
  }

  return <BasicDashboard />;
}