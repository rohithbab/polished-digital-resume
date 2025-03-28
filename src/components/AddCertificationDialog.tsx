import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';
import { Certification } from '../lib/certifications';

interface AddCertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (certification: Certification) => void;
  certification?: Certification | null;
}

const AddCertificationDialog = ({ open, onOpenChange, onSave, certification }: AddCertificationDialogProps) => {
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    description: '',
    link: '',
    date: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (certification) {
      setFormData(certification);
    } else {
      setFormData({
        name: '',
        description: '',
        link: '',
        date: ''
      });
    }
  }, [certification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!formData.name?.trim() || !formData.description?.trim() || !formData.link?.trim() || !formData.date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    // Create the certification object
    const certificationData = {
      ...formData,
      id: certification?.id || '' // Include the ID if editing
    } as Certification;

    // Call the onSave function with the certification data
    onSave(certificationData);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        // Reset form when dialog is closed
        setFormData({
          name: '',
          description: '',
          link: '',
          date: ''
        });
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{certification ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
          <DialogDescription>
            Fill in the details of your certification below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Certificate Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Certificate Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="Enter the certificate URL"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {certification ? 'Update Certification' : 'Add Certification'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCertificationDialog; 