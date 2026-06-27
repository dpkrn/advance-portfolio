import { BookOpen, Target, FlaskConical, Calendar } from 'lucide-react';
import { SectionHeader, Card, Badge, Tag } from '../../design-system';

export default function NowSection({ section, id }) {
  const { lastUpdated, learningGoals, currentProjects, books, researchTopics } = section.content || {};

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      {lastUpdated && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Calendar className="w-4 h-4" />
          Last updated: {lastUpdated}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {learningGoals && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-accent-light" />
              <h3 className="text-lg font-semibold">Learning Goals</h3>
            </div>
            <ul className="space-y-2">
              {learningGoals.map((goal) => (
                <li key={goal} className="flex items-center gap-2 text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {goal}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {currentProjects && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-accent-light" />
              <h3 className="text-lg font-semibold">Current Projects</h3>
            </div>
            <div className="space-y-4">
              {currentProjects.map((project) => (
                <div key={project.name} className="p-3 rounded-xl bg-surface-overlay">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{project.name}</span>
                    <Badge variant={project.status === 'In progress' ? 'accent' : 'default'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {books && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent-light" />
              <h3 className="text-lg font-semibold">Currently Reading</h3>
            </div>
            <div className="space-y-3">
              {books.map((book) => (
                <div key={book.title}>
                  <p className="font-medium text-foreground">{book.title}</p>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                  <p className="text-xs text-accent-light mt-1">{book.progress}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {researchTopics && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="w-5 h-5 text-accent-light" />
              <h3 className="text-lg font-semibold">Research Topics</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {researchTopics.map((topic) => (
                <Tag key={topic}>{topic}</Tag>
              ))}
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
