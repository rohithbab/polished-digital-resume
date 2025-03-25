import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

interface AchievementCardProps {
  achievement: Achievement;
  onEdit?: (achievement: Achievement) => void;
  onDelete?: (achievement: Achievement) => void;
  isPreview?: boolean;
}

const AchievementCard = ({ achievement, onEdit, onDelete, isPreview = false }: AchievementCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(achievement);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(achievement);
  };

  const handleViewAchievement = () => {
    window.open(achievement.image, '_blank');
  };

  return (
    <Card className="relative group">
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{achievement.title}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {achievement.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {achievement.date}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            {achievement.description}
          </p>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAchievement}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              View Achievement
            </Button>
            {!isPreview && (
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

export default AchievementCard; 