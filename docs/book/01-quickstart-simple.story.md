# Chapter 1: The 30-Second Promise

## 📖 The Story

Sarah wants to add automation to her project. She runs `arog cli` and selects Quick Start.

**The Promise:** Setup completes in < 30 seconds.

---

## ✅ The Validation Tests

```json
{
  "chapter": 1,
  "title": "The 30-Second Promise",
  "critical": true,
  "tests": [
    {
      "name": "Quick Start completes in < 30 seconds",
      "type": "timing",
      "threshold": 30000,
      "command": "arog setup",
      "expect": "completion",
      "critical": true
    },
    {
      "name": "Restart reminder appears",
      "type": "output",
      "command": "npm install",
      "expect": "restart VS Code",
      "contains": ["@arog", "verify-mcp"],
      "critical": true
    },
    {
      "name": "Directory structure created",
      "type": "filesystem",
      "expect": {
        "exists": [
          ".arog/",
          "tests/e2e/",
          "tests/unit/"
        ]
      },
      "critical": false
    }
  ],
  "validation": {
    "model": "gpt-4o-mini",
    "cost_estimate": "$0.0001",
    "speed": "< 30 seconds"
  }
}
```

---

**Status:** ✅ Chapter validated
**Last Run:** Auto-generated
