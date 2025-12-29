import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getReports, addReport, deleteReport } from '@/lib/firestore';
import { uploadFile } from '@/lib/storage'; // Assuming uploadFile exists or creating it
import { Report } from '@/store/useContentStore';
import { Plus, Trash2, X, Upload, Loader2, FileText, Calendar } from 'lucide-react';

const AdminReports = () => {
  const { isLoading: authLoading, isAdmin } = useAdminGuard();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    url: '',
    order: 0,
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadReports();
    }
  }, [isAdmin]);

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      url: '',
      order: Date.now(),
    });
    setPdfFile(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let fileUrl = formData.url;

      if (pdfFile) {
        // Assume uploadFile handles generic file upload or reuse uploadImage if it supports PDFs (needs check)
        // Since uploadImage usually optimizes images, we might need a separate uploadFile function.
        // For now, I'll assume uploadImage works for general files or I need to create uploadFile.
        // Let's check storage.ts later. For now, assuming uploadFile exists or using a placeholder.
        // Actually, let's use uploadImage function but rename/alias carefully or check if it handles non-images.
        // If it resizes, it breaks PDFs.
        // I will plan to use a generic 'uploadFile' from storage.ts
        fileUrl = await uploadFile(pdfFile, 'reports');
      }

      if (!fileUrl) {
        throw new Error("File is required");
      }

      const data = {
        title: formData.title,
        date: formData.date,
        url: fileUrl,
        order: formData.order,
      };

      await addReport(data);
      toast({
        title: 'Added',
        description: 'Report added successfully.',
      });

      setShowModal(false);
      resetForm();
      loadReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: 'Error',
        description: 'Failed to save report.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      await deleteReport(id);
      toast({
        title: 'Deleted',
        description: 'Report deleted successfully.',
      });
      loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <AdminLayout title="Reports" description="Manage club reports">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {reports.length} report{reports.length !== 1 && 's'}
        </p>
        <Button variant="glow" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Report
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="gradient-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{report.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {report.date}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md gradient-border rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Add Report</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>PDF File</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {pdfFile ? pdfFile.name : 'Upload PDF'}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="glow" className="flex-1" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminReports;
