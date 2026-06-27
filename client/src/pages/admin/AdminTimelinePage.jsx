import { Route } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  title: '',
  description: '',
  date: '2025-01',
  category: 'career',
  order: 1,
  visible: true,
  tags: [],
  expandable: { details: '', links: [] },
};

const config = {
  title: 'Timeline',
  icon: Route,
  fetchAll: adminApi.getMilestones,
  create: adminApi.createMilestone,
  update: adminApi.updateMilestone,
  remove: adminApi.deleteMilestone,
  idKey: '_id',
  labelKey: 'title',
  template,
};

export default function AdminTimelinePage() {
  return <AdminCollectionPage config={config} />;
}
