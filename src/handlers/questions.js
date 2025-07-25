// 题库处理模块
import { Logger } from '../middleware/logger.js';
import { CacheManager } from '../middleware/cache.js';

export class QuestionsHandler {
  constructor(env) {
    this.env = env;
    this.logger = new Logger(env.QUESTIONS_KV);
    this.cache = new CacheManager(env.QUESTIONS_KV);
  }

  async handleQuestions(request) {
    try {
      const url = new URL(request.url);
      const type = url.searchParams.get('type') || 'all';
      const count = parseInt(url.searchParams.get('count')) || 20;
      const page = parseInt(url.searchParams.get('page')) || 0;

      // 验证参数
      if (!['all', 'single', 'multiple', 'judge'].includes(type)) {
        return new Response(JSON.stringify({
          error: 'Invalid question type'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (count > 200) {
        return new Response(JSON.stringify({
          error: 'Question count too large (max 200)'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 尝试从缓存获取
      const cacheKey = `questions:${type}:${count}:${page}`;
      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return new Response(JSON.stringify(cached), {
          headers: { 
            'Content-Type': 'application/json',
            'X-Cache': 'HIT'
          }
        });
      }

      // 从KV获取题库数据
      const questions = await this.loadQuestions();
      if (!questions) {
        return new Response(JSON.stringify({
          error: 'Questions not found'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 过滤题型
      let filteredQuestions = questions.questions;
      if (type !== 'all') {
        filteredQuestions = questions.questions.filter(q => q.type === type);
      }

      // 随机选择题目
      const shuffled = this.shuffleArray([...filteredQuestions]);
      const selectedQuestions = shuffled.slice(page * count, (page + 1) * count);

      const result = {
        questions: selectedQuestions,
        total: filteredQuestions.length,
        type,
        count: selectedQuestions.length,
        page,
        hasMore: (page + 1) * count < filteredQuestions.length
      };

      // 缓存结果
      await this.cache.set(cacheKey, result, 1800); // 30分钟缓存

      await this.logger.log('INFO', 'Questions served', {
        type,
        count: selectedQuestions.length,
        total: filteredQuestions.length,
        page
      });

      return new Response(JSON.stringify(result), {
        headers: { 
          'Content-Type': 'application/json',
          'X-Cache': 'MISS'
        }
      });

    } catch (error) {
      await this.logger.log('ERROR', 'Questions handler error', {
        error: error.message,
        stack: error.stack
      });

      return new Response(JSON.stringify({
        error: 'Internal server error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  async loadQuestions() {
    try {
      // 首先尝试加载单个文件
      const questionsData = await this.env.QUESTIONS_KV.get('questions');
      if (questionsData) {
        return JSON.parse(questionsData);
      }

      // 如果没有单个文件，尝试加载分片数据
      const indexData = await this.env.QUESTIONS_KV.get('questions_index');
      if (!indexData) {
        return null;
      }

      const index = JSON.parse(indexData);
      const allQuestions = [];

      // 加载所有分片
      for (let i = 0; i < index.totalChunks; i++) {
        const chunkData = await this.env.QUESTIONS_KV.get(`questions_chunk_${i}`);
        if (chunkData) {
          const chunk = JSON.parse(chunkData);
          allQuestions.push(...chunk.questions);
        }
      }

      return {
        title: "密评考试题库",
        description: "商用密码应用安全性评估考试题库",
        total_questions: allQuestions.length,
        questions: allQuestions
      };

    } catch (error) {
      await this.logger.log('ERROR', 'Failed to load questions', {
        error: error.message
      });
      return null;
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async getStats() {
    try {
      // 尝试从缓存获取统计信息
      const cached = await this.cache.get('stats');
      if (cached) {
        return cached;
      }

      // 从KV获取统计信息
      const statsData = await this.env.QUESTIONS_KV.get('stats');
      if (statsData) {
        const stats = JSON.parse(statsData);
        await this.cache.set('stats', stats, 3600); // 1小时缓存
        return stats;
      }

      // 如果没有统计信息，从题库数据计算
      const questions = await this.loadQuestions();
      if (!questions) {
        return { total: 0, single: 0, multiple: 0, judge: 0 };
      }

      const stats = {
        total: questions.questions.length,
        single: questions.questions.filter(q => q.type === 'single').length,
        multiple: questions.questions.filter(q => q.type === 'multiple').length,
        judge: questions.questions.filter(q => q.type === 'judge').length,
        lastUpdated: new Date().toISOString()
      };

      // 保存统计信息到KV
      await this.env.QUESTIONS_KV.put('stats', JSON.stringify(stats));
      await this.cache.set('stats', stats, 3600);

      return stats;

    } catch (error) {
      await this.logger.log('ERROR', 'Failed to get stats', {
        error: error.message
      });
      return { total: 0, single: 0, multiple: 0, judge: 0 };
    }
  }
}