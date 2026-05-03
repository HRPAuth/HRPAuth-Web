import { getBackendUrl } from '../utils/config';
import type { RegisterRequest, RegisterResponse } from '../types/register';

export async function register(
  data: Omit<RegisterRequest, 'password2'>
): Promise<RegisterResponse> {
  try {
    const base = getBackendUrl();
    const url = `${base}/register`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      const statusCode = resp.status;
      let message = '注册失败';
      
      if (statusCode === 500) {
        message = '服务器内部错误，请稍后重试';
      } else if (statusCode === 409) {
        message = '邮箱已被注册';
      } else if (statusCode === 400) {
        message = '请求参数错误';
      } else if (statusCode === 405) {
        message = '请求方法错误';
      }

      try {
        const responseData = await resp.json();
        if (responseData.message) {
          message = responseData.message;
        }
      } catch {
        // 如果无法解析响应，使用默认消息
      }

      return {
        success: false,
        message,
      };
    }

    const responseData = await resp.json().catch(() => ({
      success: false,
      message: '服务器返回无法解析的响应',
    }));

    if (responseData.success === false) {
      return {
        success: false,
        message: responseData.message || '注册失败',
      };
    }

    return responseData as RegisterResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: '请求超时，请检查网络连接后重试',
        };
      } else if (error.message.includes('Failed to fetch')) {
        return {
          success: false,
          message: '网络错误：无法连接到后端服务器',
        };
      }
    }
    return {
      success: false,
      message: '网络错误：无法连接到后端。',
    };
  }
}