import { Network } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  slug: '',
  title: '',
  problem: '',
  approach: '',
  scalability: '',
  patterns: [],
  failureAnalysis: [],
  diagram: '',
  order: 1,
  visible: true,
};

const config = {
  title: 'System Design',
  icon: Network,
  fetchAll: adminApi.getSystemDesignCases,
  create: adminApi.createSystemDesignCase,
  update: adminApi.updateSystemDesignCase,
  remove: adminApi.deleteSystemDesignCase,
  idKey: 'slug',
  labelKey: 'title',
  template,
};

export default function AdminSystemDesignPage() {
  return <AdminCollectionPage config={config} />;
}
