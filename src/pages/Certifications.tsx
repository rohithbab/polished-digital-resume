import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Plus } from 'lucide-react';
import { Certification } from '../lib/certifications';
import { getAllCertifications, addCertification, updateCertification, deleteCertification } from '../services/certificationService';
import CertificationCard from '../components/CertificationCard';
import AddCertificationDialog from '../components/AddCertificationDialog';
import { useToast } from '../components/ui/use-toast';
import { useAuth } from '../context/AuthContext';

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const data = await getAllCertifications();
      setCertifications(data);
    } catch (error) {
      console.error('Error fetching certifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load certifications',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCertification = async (certification: Certification) => {
    try {
      const { id, ...certificationData } = certification;
      const newId = await addCertification(certificationData);
      setCertifications(prev => [...prev, { ...certificationData, id: newId }]);
      setIsDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Certification added successfully'
      });
    } catch (error) {
      console.error('Error adding certification:', error);
      toast({
        title: 'Error',
        description: 'Failed to add certification',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateCertification = async (certification: Certification) => {
    try {
      await updateCertification(certification.id, certification);
      setCertifications(prev => prev.map(cert => 
        cert.id === certification.id ? certification : cert
      ));
      setIsDialogOpen(false);
      setEditingCertification(null);
      toast({
        title: 'Success',
        description: 'Certification updated successfully'
      });
    } catch (error) {
      console.error('Error updating certification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update certification',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCertification = async (certification: Certification) => {
    try {
      await deleteCertification(certification.id);
      setCertifications(prev => prev.filter(cert => cert.id !== certification.id));
      toast({
        title: 'Success',
        description: 'Certification deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete certification',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingCertification(certification);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="section-container">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-4">Certifications</h1>
            <p className="text-muted-foreground">
              View and manage my professional certifications
            </p>
          </div>
          {user && (
            <Button onClick={() => setIsDialogOpen(true)} className="btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Certification
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              onEdit={handleEdit}
              onDelete={handleDeleteCertification}
            />
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No certifications found</p>
          </div>
        )}
      </div>

      <AddCertificationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={editingCertification ? handleUpdateCertification : handleAddCertification}
        certification={editingCertification}
      />
    </div>
  );
};

export default CertificationsPage; 