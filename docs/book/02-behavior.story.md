# Chapter 2: The Core Behavior

## 📖 The Story

After verifying the structure (Chapter 1), the Guardian ensures the Body is functioning.
It runs the core smoke tests to ensure logic is sound.

---

## ✅ The Validation Tests

```json
{
  "chapter": 2,
  "title": "Verifying Core Behavior",
  "critical": true,
  "tests": [
    {
      "name": "Unit Tests Pass (Core Logic)",
      "type": "command",
      "command": "npm test"
    },
    {
      "name": "E2E Smoke Tests Pass (Core Flows)",
      "type": "command",
      "command": "npm run test:e2e"
    }
  ]
}
```
