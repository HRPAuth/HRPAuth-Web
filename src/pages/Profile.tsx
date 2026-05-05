import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Chip, Stack, Link, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, InputAdornment } from '@mui/material';
import { CheckCircle, Warning, Edit, Save, Key } from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { Link as RouterLink } from 'react-router-dom';
import { getUserEmail, getAuthToken, getUid, getVerified } from '../utils/cookie';
import { getApiUrl } from '../utils/config';

interface UserInfo {
  email: string;
  username: string;
  avatar?: string;
  verified?: boolean;
  totp_enabled?: boolean;
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

  const [totpDialogOpen, setTotpDialogOpen] = useState(false);
  const [totpKey, setTotpKey] = useState<string | null>(null);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState<string | null>(null);
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);

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
        const resp = await fetch(getApiUrl('/user'), {
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
            username: data.data.username || email.split('@')[0],
            avatar: data.data.avatar,
            verified: Boolean(data.data.verified),
            totp_enabled: Boolean(data.data.totp_enabled),
          });
        } else {
          setUserInfo({
            email,
            username: email.split('@')[0],
            verified: Boolean(getVerified()),
          });
        }
      } catch {
        setUserInfo({
          email,
          username: email.split('@')[0],
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
      const resp = await fetch(getApiUrl('/change-username'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ remember_token: token, username: newUsername }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (data.success) {
        const updatedUsername = data.data?.username || newUsername;
        setUserInfo(prev => prev ? { ...prev, username: updatedUsername } : null);
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

  const handleOpenTotpDialog = async () => {
    const email = getUserEmail();
    const token = getAuthToken();

    if (!email || !token) {
      setTotpError('未登录或登录已过期');
      return;
    }

    setTotpLoading(true);
    setTotpError(null);
    setTotpKey(null);
    setPasscode('');
    setPasscodeError(null);
    setSetupSuccess(false);

    try {
      const resp = await fetch(getApiUrl('/totp/setup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, remtoken: token }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (data.success && data.totpkey) {
        setTotpKey(data.totpkey);
        setTotpDialogOpen(true);
      } else {
        setTotpError(data.message || '设置 TOTP 失败');
      }
    } catch {
      setTotpError('服务器错误');
    } finally {
      setTotpLoading(false);
    }
  };

  const handleCloseTotpDialog = () => {
    setTotpDialogOpen(false);
    setTotpKey(null);
    setPasscode('');
    setPasscodeError(null);
    setTotpError(null);
    setSetupSuccess(false);
  };

  const handleVerifyPasscode = async () => {
    if (!passcode || passcode.length !== 6 || !/^\d+$/.test(passcode)) {
      setPasscodeError('请输入6位数字验证码');
      return;
    }

    const email = getUserEmail();
    if (!email) {
      setPasscodeError('用户信息获取失败');
      return;
    }

    setVerifying(true);
    setPasscodeError(null);

    try {
      const resp = await fetch(getApiUrl('/totp/verify'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, passcode }),
      });

      const data = await resp.json().catch(() => ({
        success: false,
        message: '服务器返回无法解析的响应',
      }));

      if (data.success) {
        setSetupSuccess(true);
        setUserInfo(prev => prev ? { ...prev, totp_enabled: true } : null);
        setTimeout(() => {
          handleCloseTotpDialog();
        }, 1500);
      } else {
        setPasscodeError(data.message || '验证失败');
      }
    } catch {
      setPasscodeError('服务器错误');
    } finally {
      setVerifying(false);
    }
  };

  const generateOtpAuthUri = (secret: string, email: string): string => {
    const issuer = 'HRPAuth';
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(email);
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
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

  const userInitial = userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U';

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
              alt={userInfo.username}
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
                    {userInfo.username}
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

      <Card sx={{ maxWidth: 500, mt: 2 }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" gutterBottom>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.totp_enabled
                  ? 'TOTP is enabled for your account'
                  : 'Protect your account with TOTP authenticator'
                }
              </Typography>
            </Box>
            <Button
              variant={userInfo.totp_enabled ? 'outlined' : 'contained'}
              startIcon={<Key />}
              onClick={handleOpenTotpDialog}
              disabled={totpLoading}
            >
              {totpLoading ? 'Loading...' : userInfo.totp_enabled ? 'Manage' : 'Enable'}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={totpDialogOpen} onClose={handleCloseTotpDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Set up TOTP Authenticator</DialogTitle>
        <DialogContent>
          {setupSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              TOTP has been successfully enabled!
            </Alert>
          ) : (
            <>
              {totpError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {totpError}
                </Alert>
              )}
              {totpKey && (
                <>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Scan the QR code with your authenticator app:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <QRCodeSVG
                      value={generateOtpAuthUri(totpKey, userInfo?.email || '')}
                      size={200}
                      level="M"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                    Or manually enter this secret key: <strong>{totpKey}</strong>
                  </Typography>
                  <TextField
                    label="Enter 6-digit code"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    fullWidth
                    margin="dense"
                    error={!!passcodeError}
                    helperText={passcodeError}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" color="text.secondary">
                              {passcode.length}/6
                            </Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTotpDialog}>Cancel</Button>
          {!setupSuccess && totpKey && (
            <Button
              variant="contained"
              onClick={handleVerifyPasscode}
              disabled={verifying || passcode.length !== 6}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}