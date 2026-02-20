import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export interface CaptchaRef {
  validate: () => boolean;
  refresh: () => void;
}

interface CaptchaProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ value, onChange, error }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const codeRef = useRef('');

  const randomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const drawCode = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    codeRef.current = randomCode();

    ctx.font = '24px Arial';
    ctx.fillStyle = '#333';
    ctx.textBaseline = 'middle';
    ctx.fillText(codeRef.current, 20, 20);

    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(Math.random() * 120, Math.random() * 40);
      ctx.lineTo(Math.random() * 120, Math.random() * 40);
      ctx.stroke();
    }
  }, []);

  useEffect(() => {
    drawCode();
  }, [drawCode]);

  useImperativeHandle(ref, () => ({
    validate: () => {
      return value.toUpperCase() === codeRef.current;
    },
    refresh: () => {
      drawCode();
    }
  }));

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <canvas
          ref={canvasRef}
          width={120}
          height={40}
          onClick={drawCode}
          style={{ cursor: 'pointer', background: '#f2f2f2', borderRadius: '4px' }}
        />
        <TextField
          label="验证码 Captcha"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          helperText={error ? '验证码错误' : ''}
          sx={{ flex: 1 }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Click the image to refresh the captcha
      </Typography>
    </Box>
  );
});

Captcha.displayName = 'Captcha';

export default Captcha;
