import { SectionHeader, Card, Tag, ExpandablePanel } from '../../design-system';
import ArchitectureDiagram from '../shared/ArchitectureDiagram';

export default function SystemDesignSection({ section, id }) {
  const caseStudies = section.content?.caseStudies || [];

  return (
    <section id={id} className="section-container">
      <SectionHeader title={section.title} subtitle={section.subtitle} />

      <div className="space-y-8">
        {caseStudies.map((study) => (
          <Card key={study.id}>
            <h3 className="text-xl font-bold text-foreground mb-4">{study.title}</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Problem</h4>
                <p className="text-foreground">{study.problem}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Approach</h4>
                <p className="text-foreground">{study.approach}</p>
              </div>
            </div>

            {study.diagram && (
              <ArchitectureDiagram diagram={study.diagram} className="mb-6" />
            )}

            {study.patterns && (
              <div className="flex flex-wrap gap-2 mb-6">
                {study.patterns.map((p) => (
                  <Tag key={p}>{p}</Tag>
                ))}
              </div>
            )}

            <ExpandablePanel title="Scalability Discussion">
              <p>{study.scalability}</p>
            </ExpandablePanel>

            {study.failureAnalysis && (
              <div className="mt-3">
                <ExpandablePanel title="Failure Analysis">
                  <div className="space-y-3">
                    {study.failureAnalysis.map((fa) => (
                      <div key={fa.scenario} className="p-3 rounded-lg bg-surface-overlay">
                        <p className="font-medium text-danger text-sm">{fa.scenario}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mitigation: {fa.mitigation}
                        </p>
                      </div>
                    ))}
                  </div>
                </ExpandablePanel>
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
