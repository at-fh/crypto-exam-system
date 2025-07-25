// Cloudflare Pages Functions 中间件
// 这个文件会处理所有请求

import { AuthHandler } from '../src/handlers/auth.js';
import { QuestionsHandler } from '../src/handlers/questions.js';
import { StaticHandler } from '../src/handlers/static.js';
import { SecurityMiddleware } from '../src/middleware/security.js';
import { Logger } from '../src/middleware/logger.js';
import { Helpers } from '../src/utils/helpers.js';

export async function onRequest(context) {
  const { request, env, next } = context;
  const startTime = Date.now();
  const logger = new Logger(env.QUESTIONS_KV);
  
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 初始化中间件
    const security = new SecurityMiddleware(env);
    
    // 处理CORS预检请求
    const corsResponse = await security.handleCORS(request);
    if (corsResponse) {
      return corsResponse;
    }
    
    // 安全验证
    const securityCheck = await security.validateRequest(request);
    if (securityCheck) {
      return securityCheck;
    }
    
    let response;
    
    // API路由处理
    if (pathname.startsWith('/api/')) {
      response = await handleAPI(request, pathname, env);
    } else {
      // 静态文件处理
      const staticHandler = new StaticHandler(env);
      response = await staticHandler.handleStatic(pathname, request);
    }
    
    // 添加安全头
    response = await security.addSecurityHeaders(response);
    
    // 记录请求日志
    await logger.logRequest(request, response, startTime);
    
    return response;
    
  } catch (error) {
    await logger.error('Pages function error', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method
    });
    
    return Helpers.buildErrorResponse(
      'Internal Server Error',
      500,
      { requestId: crypto.randomUUID() }
    );
  }
}

// API路由处理
async function handleAPI(request, pathname, env) {
  const logger = new Logger(env.QUESTIONS_KV);
  
  try {
    switch (pathname) {
      case '/api/auth':
        if (request.method !== 'POST') {
          return Helpers.buildErrorResponse('Method not allowed', 405);
        }
        const authHandler = new AuthHandler(env);
        return await authHandler.handleAuth(request);
        
      case '/api/questions':
        if (request.method !== 'GET') {
          return Helpers.buildErrorResponse('Method not allowed', 405);
        }
        const questionsHandler = new QuestionsHandler(env);
        return await questionsHandler.handleQuestions(request);
        
      case '/api/health':
        const staticHandler = new StaticHandler(env);
        return await staticHandler.handleHealthCheck();
        
      default:
        return Helpers.buildErrorResponse('API endpoint not found', 404);
    }
  } catch (error) {
    await logger.error('API handler error', {
      pathname,
      error: error.message,
      stack: error.stack
    });
    
    return Helpers.buildErrorResponse(
      'API Error',
      500,
      { endpoint: pathname }
    );
  }
}