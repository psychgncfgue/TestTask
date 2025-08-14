import React, { useRef, useState, useEffect } from 'react';
import { Avatar, Box } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { useTheme } from '@mui/material/styles';
import { fetcherWithCheck } from '../../utils/fetcherWithCheck';

type HoverAvatarProps = {
  src?: string;
  children: React.ReactNode;
  onUploadSuccess?: (newUrl: string) => void;
};

export default function HoverAvatar({
  src,
  children,
  onUploadSuccess,
}: HoverAvatarProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarSrc, setAvatarSrc] = useState<string | undefined>();

  useEffect(() => {
    if (src) {
      setAvatarSrc(`${src}?t=${Date.now()}`);
    }
  }, [src]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
      return alert('Только JPEG, PNG или WEBP');
    }
    if (file.size > 2 * 1024 * 1024) {
      return alert('Максимум 2MB');
    }

    const form = new FormData();
    form.append('file', file);

    try {
      const data = await fetcherWithCheck('/api/avatar-load', {
        method: 'POST',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAvatarSrc(`${data.avatarUrl}?t=${Date.now()}`);

      if (onUploadSuccess) onUploadSuccess(data.avatarUrl);
    } catch (err) {
      console.error('Ошибка загрузки аватара:', err);
      alert('Не удалось загрузить аватар');
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: 'relative',
        display: 'inline-block',
        width: 64,
        height: 64,
        mr: 3,
        cursor: 'pointer',
        '&:hover .overlay': {
          opacity: 1,
          transform: 'scale(1)',
        },
      }}
    >
      <Avatar
        src={avatarSrc}
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: theme.palette.primary.main,
        }}
      >
        {children}
      </Avatar>

      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transform: 'scale(0.8)',
          transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
        }}
      >
        <AddAPhotoIcon sx={{ color: '#fff' }} />
      </Box>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </Box>
  );
}