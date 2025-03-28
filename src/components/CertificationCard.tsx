import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Certification } from '../lib/certifications';

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (certification: Certification) => void;
  onDelete?: (certification: Certification) => void;
  isPreview?: boolean;
}

const CertificationCard = ({ certification, onEdit, onDelete, isPreview = false }: CertificationCardProps) => {
  const { user } = useAuth();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(certification);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(certification);
  };

  const handleViewCertification = () => {
    window.open(certification.link, '_blank');
  };

  return (
    <Card className="relative group">
      <CardHeader>
        <CardTitle className="text-xl">{certification.name}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {new Date(certification.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {certification.description}
          </p>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewCertification}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              View Certificate
            </Button>
            {user && !isPreview && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEdit}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificationCard; 