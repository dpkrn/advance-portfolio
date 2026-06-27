import { FolderKanban } from 'lucide-react';
import AdminCollectionPage from '../../components/admin/AdminCollectionPage';
import adminApi from '../../services/adminApi';

const template = {
  slug: '',
  name: '',
  tagline: '',
  role: '',
  category: 'personal',
  order: 1,
  visible: true,
  featured: false,
  deployed: false,
  thumbnail: '',
  techStack: [],
  metrics: {},
  highlights: [],
  architecture: { description: '', diagram: '', patterns: [] },
  challenges: [],
  tradeoffs: [],
  lessonsLearned: [],
  links: { live: '', github: '' },
  readme: '',
};

const config = {
  title: 'Projects',
  icon: FolderKanban,
  fetchAll: adminApi.getProjects,
  create: adminApi.createProject,
  update: adminApi.updateProject,
  remove: adminApi.deleteProject,
  idKey: 'slug',
  labelKey: 'name',
  template,
  imageFields: [
    { key: 'thumbnail', label: 'Thumbnail', folder: 'portfolio/projects' },
  ],
};

export default function AdminProjectsPage() {
  return <AdminCollectionPage config={config} />;
}
