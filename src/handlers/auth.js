// 认证处理模块
import { RateLimiter } from '../middleware/rateLimit.js';
import { JWTAuth } from '../utils/crypto.js';
import { Validator } from '../utils/validation.js';
import { Logger } from '../middleware/logger.js';

export class AuthHandler {
  constructor(env) {
    this.env = env;
    this.rateLimiter = new RateLimiter(env.QUESTIONS_KV);
    this.jwtAuth = new JWTAuth(env.JWT_SECRET || 'default-secret-key');
    this.logger = new Logger(env.QUESTIONS_KV);
  }

  async handleAuth(request) {
    try {
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      
      // 检查频率限制
      const rateCheck = await this.rateLimiter.checkLimit(`auth:${clientIP}`);
      if (!rateCheck.allowed) {
        await this.logger.log('WARN', 'Rate limit exceeded for auth', { 
          ip: clientIP,
          resetTime: rateCheck.resetTime 
        });
        
        return new Response(JSON.stringify({
          success: false,
          message: '请求过于频繁，请稍后重试',
          resetTime: rateCheck.resetTime
        }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const { password } = await request.json();
      
      // 验证输入
      if (!password) {
        return new Response(JSON.stringify({
          success: false,
          message: '密码不能为空'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 验证密码（这里可以从环境变量或KV中获取）
      const correctPassword = this.env.LOGIN_PASSWORD || 'Xiaoshan123';
      
      if (password !== correctPassword) {
        await this.logger.log('WARN', 'Failed login attempt', { 
          ip: clientIP,
          timestamp: new Date().toISOString()
        });
        
        return new Response(JSON.stringify({
          success: false,
          message: '密码错误'
        }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 生成JWT令牌
      const token = await this.jwtAuth.generateToken({
        authenticated: true,
        ip: clientIP,
        loginTime: Date.now()
      });

      await this.logger.log('INFO', 'Successful login', { 
        ip: clientIP,
        timestamp: new Date().toISOString()
      });

      return new Response(JSON.stringify({
        success: true,
        token,
        message: '登录成功'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      await this.logger.log('ERROR', 'Auth handler error', { 
        error: error.message,
        stack: error.stack
      });
      
      return new Response(JSON.stringify({
        success: false,
        message: '服务器内部错误'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async verifyToken(request) {
    try {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false, error: 'Missing or invalid authorization header' };
      }

      const token = authHeader.substring(7);
      const result = await this.jwtAuth.verifyToken(token);
      
      if (!result.valid) {
        await this.logger.log('WARN', 'Invalid token verification', { 
          error: result.error,
          ip: request.headers.get('CF-Connecting-IP')
        });
      }

      return result;
    } catch (error) {
      await this.logger.log('ERROR', 'Token verification error', { 
        error: error.message
      });
      return { valid: false, error: error.message };
    }
  }
}