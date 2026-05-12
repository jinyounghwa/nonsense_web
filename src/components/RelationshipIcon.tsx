import { Handshake, Swords, Heart, Home, Zap, Lock, Link, Users, Gem, HeartHandshake, Baby, User, HeartCrack } from 'lucide-react';
import { Relationship } from '@/types';

interface RelationshipIconProps {
  type: Relationship['type'];
  className?: string;
  color?: string;
  size?: number | string;
}

export function RelationshipIcon({ type, className, color, size }: RelationshipIconProps) {
  const props = { className, color, size };
  switch (type) {
    case 'friend': return <Handshake {...props} />;
    case 'enemy': return <Swords {...props} />;
    case 'love': return <Heart {...props} />;
    case 'family': return <Home {...props} />;
    case 'rival': return <Zap {...props} />;
    case 'secret': return <Lock {...props} />;
    case 'other': return <Link {...props} />;
    case 'siblings': return <Users {...props} />;
    case 'brothers': return <Users {...props} />;
    case 'married': return <Gem {...props} />;
    case 'dating': return <HeartHandshake {...props} />;
    case 'son': return <Baby {...props} />;
    case 'husband': return <User {...props} />;
    case 'father': return <User {...props} />;
    case 'separated': return <HeartCrack {...props} />;
    default: return <Link {...props} />;
  }
}
