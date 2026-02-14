import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function validate() {
    setError(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please input valid email address 请输入有效的邮箱地址。');
      return false;
    }

    if (!password) {
      setError('Please input password 请输入密码。');
      return false;
    }

    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    try {
      const base = (window as any).BACKEND_URL?.replace(/\/$/, '') || '';
      const url = base + '/login.php';

      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (!resp.ok || data.success === false) {
        setError(data.message || 'Please login again 请重新登录');
      } else if (data.success === true) {
        setSuccess(true);
        setTimeout(() => navigate('/dash'), 700);
      } else {
        setError('未知响应');
      }
    } catch (err) {
      setError('网络错误：无法连接到后端。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Typography variant="h4" gutterBottom>
        登录
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success ? (
        <Alert severity="success">
          登录成功，正在跳转…
        </Alert>
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
            label="Password 密码"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={{ mb: 2 }}
            disabled={loading}
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? '请稍候...' : '登录'}
          </Button>
        </form>
      )}
    </Box>
  );
}
