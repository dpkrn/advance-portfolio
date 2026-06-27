import { Terminal } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  platformId: '',
  name: '',
  url: '',
  stats: {},
  rating: '',
  rank: '',
  badges: [],
  placeholder: false,
  order: 1,
  visible: true,
};

const config = {
  title: 'Coding Profiles',
  icon: Terminal,
  fetchAll: adminApi.getCodingPlatforms,
  create: adminApi.createCodingPlatform,
  update: adminApi.updateCodingPlatform,
  remove: adminApi.deleteCodingPlatform,
  idKey: 'platformId',
  labelKey: 'name',
  template,
};

export default function AdminCodingProfilesPage() {
  return <AdminCollectionPage config={config} />;
}
