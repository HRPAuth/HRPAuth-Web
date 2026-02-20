import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Chip, Stack, Link } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserEmail, getAuthToken } from '../utils/cookie';

interface UserInfo {
  email: string;
  nickname: string;
  avatar?: string;
  is_verified?: boolean;
}

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const email = getUserEmail();
      const token = getAuthToken();

      if (!email || !token) {
        setError('未登录或登录已过期');
        setLoading(false);
        return;
      }

      try {
        const base = window.BACKEND_URL?.replace(/\/$/, '') || '';
        const url = base + '/user.php';

        const resp = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await resp.json().catch(() => ({
          success: false,
          message: '服务器返回无法解析的响应',
        }));

        if (resp.ok && data.success && data.data) {
          setUserInfo({
            email: data.data.email || email,
            nickname: data.data.nickname || email.split('@')[0],
            avatar: data.data.avatar,
            is_verified: data.data.is_verified,
          });
        } else {
          setUserInfo({
            email,
            nickname: email.split('@')[0],
          });
        }
      } catch {
        setUserInfo({
          email,
          nickname: email.split('@')[0],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
        <Box sx={{ mt: 1 }}>
          <Link component={RouterLink} to="/verifyemail" color="primary">
            点击此处进行邮箱验证
          </Link>
        </Box>
      </Alert>
    );
  }

  if (!userInfo) {
    return null;
  }

  const userInitial = userInfo.nickname ? userInfo.nickname.charAt(0).toUpperCase() : 'U';

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {!userInfo.is_verified && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          您的邮箱尚未验证，请尽快验证邮箱以享受完整功能。
          <Box sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/verifyemail" color="primary">
              立即验证邮箱
            </Link>
          </Box>
        </Alert>
      )}

      <Card sx={{ maxWidth: 500, mt: 2 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {userInfo.avatar ? (
            <Avatar
              src={userInfo.avatar}
              alt={userInfo.nickname}
              sx={{ width: 80, height: 80 }}
            />
          ) : (
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: '2rem' }}>
              {userInitial}
            </Avatar>
          )}

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" gutterBottom>
              {userInfo.nickname}
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userInfo.email}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                icon={userInfo.is_verified ? <CheckCircle /> : <Warning />}
                label={userInfo.is_verified ? '邮箱已验证' : '邮箱未验证'}
                color={userInfo.is_verified ? 'success' : 'warning'}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
