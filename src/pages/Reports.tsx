import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/animations/ScrollReveal';
import { getReports } from '@/lib/firestore';
import { Report } from '@/store/useContentStore';
import { FileText, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <main className="relative noise-overlay min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <span className="text-sm text-primary tracking-widest uppercase mb-4 block">Documents</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Club <span className="gradient-text">Reports</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access official club reports, event summaries, and annual statements.
          </p>
        </ScrollReveal>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reports.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                className="gradient-border p-6 rounded-2xl bg-card/50 flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{report.title}</h3>
                    {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {report.date}
                    </div> */}
                  </div>
                </div>

                <Button variant="ghost" size="icon" asChild className="shrink-0">
                  <a href={report.url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            No reports available at this time.
          </div>
        )}
      </div>
    </main>
  );
};

export default ReportsPage;
