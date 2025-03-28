import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { Certification } from '../lib/certifications';
import { getAllCertifications } from '../services/certificationService';
import CertificationCard from './CertificationCard';

const Certifications = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await getAllCertifications();
        setCertifications(data);
      } catch (error) {
        console.error('Error fetching certifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) {
    return (
      <section id="certifications" className="py-20 bg-secondary/30 dark:bg-secondary/10">
        <div className="section-container">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="mb-4">Certifications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              My professional certifications and achievements
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="py-20 bg-secondary/30 dark:bg-secondary/10">
      <div className="section-container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="mb-4">Certifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My professional certifications and achievements
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {certifications.slice(0, 3).map((certification) => (
            <CertificationCard
              key={certification.id}
              certification={certification}
              isPreview={true}
            />
          ))}
        </div>

        {certifications.length > 3 && (
          <div className="text-center">
            <Button
              onClick={() => navigate('/certifications')}
              className="btn-primary"
            >
              See More Certifications
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certifications; 