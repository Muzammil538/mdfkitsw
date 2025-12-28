import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getStudents, addStudent, updateStudent, deleteStudent } from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import { StudentMember } from '@/store/useContentStore';
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react';

const tierLabels = {
  1: 'President',
  2: 'Vice President & PRO',
  3: 'Joint Secretaries',
  4: 'Core Team',
};

const AdminStudents = () => {
  const { isLoading: authLoading, isAdmin } = useAdminGuard();
  const [students, setStudents] = useState<StudentMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    tier: 4,
    image: '',
    instagram: '',
    linkedin: '',
    email: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadStudents();
    }
  }, [isAdmin]);

  const loadStudents = async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error('Error loading students:', error);
      toast({
        title: 'Error',
        description: 'Failed to load student data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      department: '',
      tier: 4,
      image: '',
      instagram: '',
      linkedin: '',
      email: '',
      order: students.length,
    });
    setImageFile(null);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member: StudentMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      tier: member.tier,
      image: member.image || '',
      instagram: member.socials?.instagram || '',
      linkedin: member.socials?.linkedin || '',
      email: member.socials?.email || '',
      order: member.order,
    });
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile, 'students');
      }

      const data = {
        name: formData.name,
        role: formData.role,
        department: formData.department,
        tier: formData.tier,
        image: imageUrl,
        order: formData.order,
        socials: {
          instagram: formData.instagram || undefined,
          linkedin: formData.linkedin || undefined,
          email: formData.email || undefined,
        },
      };

      if (editingId) {
        await updateStudent(editingId, data);
        toast({
          title: 'Updated',
          description: 'Student member updated successfully.',
        });
      } else {
        await addStudent(data);
        toast({
          title: 'Added',
          description: 'Student member added successfully.',
        });
      }

      setShowModal(false);
      resetForm();
      loadStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      toast({
        title: 'Error',
        description: 'Failed to save student member.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student member?')) return;

    try {
      await deleteStudent(id);
      toast({
        title: 'Deleted',
        description: 'Student member deleted successfully.',
      });
      loadStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete student member.',
        variant: 'destructive',
      });
    }
  };

  // Group students by tier
  const groupedStudents = students.reduce((acc, student) => {
    const tier = student.tier || 4;
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(student);
    return acc;
  }, {} as Record<number, StudentMember[]>);

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
    <AdminLayout title="Students" description="Manage student body members">
      {/* Add Button */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {students.length} student{students.length !== 1 && 's'}
        </p>
        <Button variant="glow" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Students by Tier */}
      {Object.entries(tierLabels).map(([tier, label]) => {
        const tierStudents = groupedStudents[Number(tier)] || [];
        if (tierStudents.length === 0 && tier !== '4') return null;

        return (
          <div key={tier} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 gradient-text">{label}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tierStudents.map((member) => (
                <motion.div
                  key={member.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="gradient-border rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold gradient-text">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{member.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(member)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(member.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {tierStudents.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8 border border-dashed border-border rounded-lg">
                No members in this tier
              </p>
            )}
          </div>
        );
      })}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-xl overflow-y-auto"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md gradient-border rounded-2xl p-6 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Student' : 'Add Student'}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., President"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="e.g., CSE"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tier">Tier</Label>
                  <Select
                    value={String(formData.tier)}
                    onValueChange={(value) => setFormData({ ...formData, tier: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(tierLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Socials (optional)</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="Instagram URL"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Photo</Label>
                  <div className="mt-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {imageFile ? imageFile.name : 'Upload image (auto WebP)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
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
                    ) : editingId ? (
                      'Update'
                    ) : (
                      'Add'
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

export default AdminStudents;
