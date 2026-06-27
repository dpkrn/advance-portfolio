import { Trophy } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  type: 'award',
  title: '',
  org: '',
  year: new Date().getFullYear(),
  order: 1,
  visible: true,
};

const config = {
  title: 'Achievements',
  icon: Trophy,
  fetchAll: adminApi.getAdminAchievements,
  create: adminApi.createAchievement,
  update: adminApi.updateAchievement,
  remove: adminApi.deleteAchievement,
  idKey: '_id',
  labelKey: 'title',
  template,
};

export default function AdminAchievementsPage() {
  return <AdminCollectionPage config={config} />;
}
