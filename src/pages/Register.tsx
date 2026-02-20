import React, { useState, useRef } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Captcha, { type CaptchaRef } from '../components/Captcha';
import { validateEmail } from '../utils/email';

export default function Register() {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const captchaRef = useRef<CaptchaRef>(null);
  const navigate = useNavigate();



  function validate() {
    setError(null);
    setCaptchaError(false);

    if (!email || !validateEmail(email)) {
      setError('Please input valid email address 请输入有效的邮箱地址。');
      return false;
    }

    if (!nickname || nickname.trim().length < 3) {
      setError('Gamename too short, at least 3 characters 游戏名太短，至少 3 个字符。');
      return false;
    }

    if (!password || password.length < 6) {
      setError('Password too short, at least 6 characters 密码太短，至少 6 个字符。');
      return false;
    }

    if (password !== password2) {
      setError('Passwords do not match 两次输入的密码不匹配。');
      return false;
    }

    if (!captcha || captcha.trim().length === 0) {
      setError('请输入验证码 Please enter captcha');
      setCaptchaError(true);
      return false;
    }

    return true;
  }



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (captchaRef.current && !captchaRef.current.validate()) {
      setError('验证码错误 Captcha is incorrect');
      setCaptchaError(true);
      captchaRef.current.refresh();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const base = window.BACKEND_URL?.replace(/\/$/, '') || '';
      const url = base + '/register.php';

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, nickname, password, password2 }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (!resp.ok || data.success === false) {
        setError(data.message || '注册失败');
        captchaRef.current?.refresh();
      } else if (data.success === true) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        setError('未知响应');
        captchaRef.current?.refresh();
      }
    } catch {
      setError('网络错误：无法连接到后端。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h4" gutterBottom>
        Register 注册
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert severity="success">注册成功，正在跳转到登录页…</Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="E-mail 邮箱"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            label="Gamename 游戏名"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            label="Password 密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <TextField
            label="Confirm Password 确认密码"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <Captcha
            ref={captchaRef}
            value={captcha}
            onChange={setCaptcha}
            error={captchaError}
          />

          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? '请稍候...' : 'Submit'}
          </Button>
        </form>
      )}
    </Box>
  );
}
