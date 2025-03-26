import { Avatar, styled } from '@mui/material';

type NameAvatarProps = {
  name?: string;
};

const GradientAvatar = styled(Avatar)(() => ({
  background: 'linear-gradient(to right, #ed4b9e, #8e2de2, #4a00e0)',
  color: 'white',
  backgroundSize: '200% 100%',
  animation: 'gradientShift 3s ease infinite',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
}));

const getInitials = (name?: string): string => {
  if (!name) return '';
  const names = name.split(' ');
  return names.map((n) => n[0]).join('').toUpperCase();
};

export const NameAvatar: React.FC<NameAvatarProps> = ({ name }) => {
  return <GradientAvatar>{getInitials(name)}</GradientAvatar>;
};
