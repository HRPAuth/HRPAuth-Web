import { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/email';
import { setAuthCookies } from '../utils/cookie';
import type { LoginResponse } from '../global';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  function validate() {
    setError(null);

    if (!email || !validateEmail(email)) {
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
      const base = (window as Window & { BACKEND_URL?: string }).BACKEND_URL?.replace(/\/$/, '') || '';
      const url = base + '/login.php';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      })) as LoginResponse | { success: false; message: string };

      if (!resp.ok || data.success === false) {
        setError(data.message || 'Please login again 请重新登录');
      } else if (data.success === true) {
        setAuthCookies(email, data.token, data.uid);
        setSuccess(true);
        setTimeout(() => navigate('/dash'), 700);
      } else {
        setError('未知响应');
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('请求超时，请检查网络连接后重试');
        } else if (err.message.includes('Failed to fetch')) {
          setError('网络错误：无法连接到后端服务器');
        } else {
          setError(`登录失败：${err.message}`);
        }
      } else {
        setError('网络错误：无法连接到后端');
      }
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
