import { useState, useEffect } from 'react';
import * as React from 'react';
import { Box, Typography, Card, CardContent, Avatar, CircularProgress, Alert, Chip, Stack, Link, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { Link as RouterLink } from 'react-router-dom';
import { getUserEmail, getAuthToken, getUid, getVerified } from '../utils/cookie';
import { getRealBackendUrl } from '../utils/config';

function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box
      sx={{
        position: "relative",
        bgcolor: "grey.900",
        color: "grey.100",
        p: 2,
        borderRadius: 2,
        fontFamily: "monospace",
        fontSize: "0.9rem",
        whiteSpace: "pre-wrap",
        border: "1px solid",
        borderColor: "grey.800",
      }}
    >
      <Tooltip title={copied ? "Copied!" : "Copy"}>
        <IconButton
          size="small"
          onClick={handleCopy}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "grey.400",
            "&:hover": { color: "grey.200" },
          }}
        >
          <ContentCopy fontSize="small" />
        </IconButton>
      </Tooltip>

      {children}
    </Box>
  );
}

interface UserInfo {
  email: string;
  nickname: string;
  avatar?: string;
  verified?: boolean;
}

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUrl, setBackendUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = getUserEmail();
      const token = getAuthToken();
      const uid = getUid();

      const realBackendUrl = await getRealBackendUrl();
      setBackendUrl(realBackendUrl);

      if (!email || !token || !uid) {
        setError('未登录或登录已过期');
        setLoading(false);
        return;
      }

      try {
        const base = realBackendUrl?.replace(/\/$/, '') || '';
        const url = base + '/user';

        const resp = await fetch(url, {
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
            <Typography variant="h5" gutterBottom>
              {userInfo.nickname}
            </Typography>
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

      <Box sx={{ mt: 4 }}>
        <BasicTabs backendUrl={backendUrl} />
      </Box>
    </Box>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface BasicTabsProps {
  backendUrl: string | null;
}

export function BasicTabs({ backendUrl }: BasicTabsProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Yggdrasil API" {...a11yProps(0)} />
          <Tab label="CustomskinLoader" {...a11yProps(1)} />
          <Tab label="OAuth2" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        There is a built-in yggdrasil API service (Zggdrasil) available.
        <CodeBlock>{backendUrl || 'Loading...'}</CodeBlock>
          <p>
            Please copy the URL above to your launcher to access the API.
          </p>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Pending supported
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Pending supported
      </CustomTabPanel>
    </Box>
  );
}
