import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Chip, Stack, Link, TextField, Button } from '@mui/material';
import { CheckCircle, Warning, Edit, Save } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getUserEmail, getAuthToken, getUid, getVerified } from '../utils/cookie';

interface UserInfo {
  email: string;
  nickname: string;
  avatar?: string;
  verified?: boolean;
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const email = getUserEmail();
      const token = getAuthToken();
      const uid = getUid();

      if (!email || !token || !uid) {
        setError('未登录或登录已过期');
        setLoading(false);
        return;
      }

      try {
        const resp = await fetch('/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ remember_token: token, uid, email }),
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
            verified: Boolean(data.data.verified),
          });
        } else {
          setUserInfo({
            email,
            nickname: email.split('@')[0],
            verified: Boolean(getVerified()),
          });
        }
      } catch {
        setUserInfo({
          email,
          nickname: email.split('@')[0],
          verified: Boolean(getVerified()),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setSaveError('名称不能为空');
      return;
    }

    if (newUsername.length < 3 || newUsername.length > 16) {
      setSaveError('名称长度必须在3-16个字符之间');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setSaveError('名称只能包含字母、数字和下划线');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const token = getAuthToken();

    try {
      const resp = await fetch('/change-profile-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ remember_token: token, name: newUsername }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (data.success) {
        setUserInfo(prev => prev ? { ...prev, nickname: newUsername } : null);
        setSaveSuccess(true);
        setEditMode(false);
        setNewUsername('');
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.message || '修改失败');
      }
    } catch {
      setSaveError('服务器错误');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setNewUsername('');
    setSaveError(null);
    setSaveSuccess(false);
  };

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
            Verify email now
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

      {!userInfo.verified && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your email is not verified. Please verify your email to access full features.
          <Box sx={{ mt: 1 }}>
            <Link component={RouterLink} to="/verifyemail" color="primary">
              Verify email now
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
            {editMode ? (
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="New Username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="3-16 characters, letters, numbers, underscores"
                  fullWidth
                  margin="dense"
                  error={!!saveError}
                  helperText={saveError}
                />
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveUsername}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    {userInfo.nickname}
                  </Typography>
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    size="small"
                    color="primary"
                  >
                    Edit
                  </Button>
                </Box>
                {saveSuccess && (
                  <Alert severity="success" sx={{ mt: 1, mb: 2 }}>
                    Username updated successfully!
                  </Alert>
                )}
              </>
            )}
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {userInfo.email}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                icon={userInfo.verified ? <CheckCircle /> : <Warning />}
                label={userInfo.verified ? 'Email verified' : 'Email not verified'}
                color={userInfo.verified ? 'success' : 'warning'}
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
