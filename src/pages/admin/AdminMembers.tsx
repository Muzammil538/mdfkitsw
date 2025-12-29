import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getClubMembers, addClubMember, updateClubMember, deleteClubMember } from '@/lib/firestore';
import { uploadImage } from '@/lib/storage';
import { ClubMember } from '@/store/useContentStore';
import { Plus, Pencil, Trash2, X, Upload, Loader2, User } from 'lucide-react';

const AdminMembers = () => {
  const { isLoading: authLoading, isAdmin } = useAdminGuard();
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    instagram: '',
    linkedin: '',
    email: '',
    order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (isAdmin) {
      loadMembers();
    }
  }, [isAdmin]);

  const loadMembers = async () => {
    try {
      const data = await getClubMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members.',
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
      image: '',
      instagram: '',
      linkedin: '',
      email: '',
      order: members.length,
    });
    setImageFile(null);
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member: ClubMember) => {
    setFormData({
      name: member.name,
      role: member.role,
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
        imageUrl = await uploadImage(imageFile, 'members');
      }

      const data = {
        name: formData.name,
        role: formData.role,
        image: imageUrl,
        order: formData.order,
        socials: {
          instagram: formData.instagram || null,
          linkedin: formData.linkedin || null,
          email: formData.email || null,
        },
      };

      if (editingId) {
        await updateClubMember(editingId, data);
        toast({
          title: 'Updated',
          description: 'Member updated successfully.',
        });
      } else {
        await addClubMember(data);
        toast({
          title: 'Added',
          description: 'Member added successfully.',
        });
      }

      setShowModal(false);
      resetForm();
      loadMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: 'Error',
        description: 'Failed to save member.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      await deleteClubMember(id);
      toast({
        title: 'Deleted',
        description: 'Member deleted successfully.',
      });
      loadMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete member.',
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
    <AdminLayout title="Club Members" description="Manage club members">
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          {members.length} member{members.length !== 1 && 's'}
        </p>
        <Button variant="glow" onClick={openAddModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
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
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{member.name}</h4>
                <p className="text-sm text-muted-foreground truncate">{member.role}</p>
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
                  {editingId ? 'Edit Member' : 'Add Member'}
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

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    placeholder="e.g., Volunteer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
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

export default AdminMembers;
