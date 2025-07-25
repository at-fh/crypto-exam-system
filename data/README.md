# 题库数据说明

## 📚 题库文件

这个目录应该包含 `questions.json` 文件，该文件包含完整的4600+题库数据。

## 🔄 获取题库文件

请从原项目的 `data/questions.json` 文件复制到这个目录。

### 文件结构
```json
{
  "title": "密评考试题库",
  "description": "商用密码应用安全性评估考试题库",
  "total_questions": 4615,
  "question_types": {
    "single": 1527,
    "multiple": 1619,
    "judge": 1469
  },
  "questions": [
    {
      "id": 1,
      "type": "single",
      "question": "题目内容...",
      "options": {
        "A": "选项A",
        "B": "选项B",
        "C": "选项C",
        "D": "选项D"
      },
      "answer": "A",
      "category": "题目分类",
      "explanation": "解释说明"
    }
    // ... 更多题目
  ]
}
```

## ⚠️ 重要提示

1. **文件大小**: 题库文件约3MB，包含4615道题目
2. **文件位置**: 必须放在 `cloudflare-pages-deploy/data/questions.json`
3. **上传方式**: 
   - 可以直接复制文件
   - 也可以在KV存储中直接粘贴内容

## 🚀 部署时的处理

在部署到Cloudflare Pages时，题库数据会被上传到KV存储中，而不是作为静态文件。

请按照 `INSTALL.md` 中的步骤将题库数据上传到KV存储。