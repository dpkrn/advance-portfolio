import { BookOpen } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  slug: '',
  title: '',
  type: 'article',
  category: '',
  date: '',
  readTime: '',
  excerpt: '',
  tags: [],
  url: '',
  order: 1,
  visible: true,
};

const config = {
  title: 'Notebook',
  icon: BookOpen,
  fetchAll: adminApi.getNotebookEntries,
  create: adminApi.createNotebookEntry,
  update: adminApi.updateNotebookEntry,
  remove: adminApi.deleteNotebookEntry,
  idKey: 'slug',
  labelKey: 'title',
  template,
};

export default function AdminNotebookPage() {
  return <AdminCollectionPage config={config} />;
}
