import { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Alert, Paper, Stack, Chip, Divider } from '@mui/material';
import { getAuthToken, getUid } from '../utils/cookie';

interface DebugInfo {
  requestUrl: string;
  requestMethod: string;
  requestHeaders: Record<string, string>;
  requestParams: Record<string, string>;
  responseStatus: number;
  responseStatusText: string;
  responseHeaders: Record<string, string>;
  responseBody: any;
  timestamp: string;
  duration: number;
}

export default function DashboardDebug() {
  const [rawData, setRawData] = useState<any>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRawData = async () => {
      const token = getAuthToken();
      const uid = getUid();

      if (!token || !uid) {
        setError('未登录或登录已过期');
        setLoading(false);
        return;
      }

      const startTime = performance.now();
      const timestamp = new Date().toISOString();

      try {
        const base = window.BACKEND_URL?.replace(/\/\$/, '') || '';
        const url = base + `/user.php?uid=${encodeURIComponent(uid)}&remember_token=${encodeURIComponent(token)}`;

        const requestHeaders: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        const requestParams: Record<string, string> = {
          uid: uid,
          remember_token: token.substring(0, 20) + '...',
        };

        console.log('========== DashboardDebug 请求开始 ==========');
        console.log('请求目标:', url);
        console.log('请求方法: GET');
        console.log('请求头:', requestHeaders);
        console.log('请求参数:', requestParams);

        const resp = await fetch(url, {
          method: 'GET',
          headers: requestHeaders,
          credentials: 'include',
        });

        const duration = Math.round(performance.now() - startTime);

        const responseHeaders: Record<string, string> = {};
        resp.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });

        console.log('响应状态:', resp.status, resp.statusText);
        console.log('响应头:', responseHeaders);

        const data = await resp.json().catch(() => ({
          success: false,
          message: '服务器返回无法解析的响应',
        }));

        console.log('响应内容:', data);
        console.log('请求耗时:', duration + 'ms');
        console.log('========== DashboardDebug 请求结束 ==========');

        setDebugInfo({
          requestUrl: url,
          requestMethod: 'GET',
          requestHeaders,
          requestParams,
          responseStatus: resp.status,
          responseStatusText: resp.statusText,
          responseHeaders,
          responseBody: data,
          timestamp,
          duration,
        });
        setRawData(data);
      } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        console.error('DashboardDebug: 请求失败', err);
        console.error('请求耗时:', duration + 'ms');
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchRawData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderJsonBlock = (title: string, data: any) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom color="primary">
        {title}
      </Typography>
      <Paper
        sx={{
          p: 2,
          bgcolor: 'grey.900',
          overflow: 'auto',
          maxHeight: '300px'
        }}
      >
        <pre style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: '#e0e0e0',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </Paper>
    </Box>
  );

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h4">
          Dashboard Debug
        </Typography>
        <Chip label="调试模式" color="info" size="small" />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {debugInfo && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              请求详情
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Chip
                label={`方法: ${debugInfo.requestMethod}`}
                color="default"
                size="small"
              />
              <Chip
                label={`状态: ${debugInfo.responseStatus} ${debugInfo.responseStatusText}`}
                color={debugInfo.responseStatus >= 200 && debugInfo.responseStatus < 300 ? 'success' : 'error'}
                size="small"
              />
              <Chip
                label={`耗时: ${debugInfo.duration}ms`}
                color="info"
                size="small"
              />
              <Chip
                label={`时间: ${new Date(debugInfo.timestamp).toLocaleTimeString()}`}
                color="default"
                size="small"
              />
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              请求目标 URL
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', mb: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  wordBreak: 'break-all',
                  color: 'primary.main'
                }}
              >
                {debugInfo.requestUrl}
              </Typography>
            </Paper>

            {renderJsonBlock('请求头 (Request Headers)', debugInfo.requestHeaders)}
            {renderJsonBlock('请求参数 (Request Params)', debugInfo.requestParams)}
            {renderJsonBlock('响应头 (Response Headers)', debugInfo.responseHeaders)}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom color="primary">
            后端响应内容 (Response Body)
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              overflow: 'auto',
              maxHeight: '50vh'
            }}
          >
            <pre style={{
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#e0e0e0',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {rawData !== null ? JSON.stringify(rawData, null, 2) : '暂无数据'}
            </pre>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}
