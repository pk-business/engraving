# Debug: Testing Strapi Comment API

## Steps to Debug:

1. **Check the actual Comment content type structure in Strapi:**
   - Log in to Strapi admin: https://pk-engrave-service.onrender.com/admin
   - Go to Content-Type Builder → Comment
   - Note the exact field names (case-sensitive!)

2. **Try creating a comment directly in Strapi admin:**
   - Go to Content Manager → Comments
   - Click "Create new entry"
   - Fill in the fields manually
   - Note which fields are required

3. **Test with curl to see exact error:**
   ```bash
   curl -X POST https://pk-engrave-service.onrender.com/api/comments \
     -H "Content-Type: application/json" \
     -d '{
       "data": {
         "content": "Test comment",
         "author": "Test User",
         "email": "test@example.com",
         "blogPost": 2
       }
     }'
   ```

## Possible Issues:

### Issue 1: Field Names Don't Match
Strapi field names are case-sensitive. Check if your Comment content type uses:
- `content` or `Content` or `text`?
- `author` or `Author` or `name`?
- `email` or `Email`?
- `blogPost` or `blog_post` or `post`?

### Issue 2: Relation Field Format
For Strapi v5, relations might need a different format:
```json
{
  "data": {
    "content": "Test",
    "author": "Name",
    "email": "email@example.com",
    "blogPost": {
      "connect": [2]
    }
  }
}
```

OR

```json
{
  "data": {
    "content": "Test",
    "author": "Name",
    "email": "email@example.com",
    "blogPost": 2
  }
}
```

### Issue 3: Missing Required Fields
Check if there are other required fields in the Comment content type that we're not sending.

## Quick Fix Steps:

1. Check the actual field names in Strapi Content-Type Builder
2. Update the field names in the code if they don't match
3. Check if the relation field needs a different format

## Testing URL:
- Strapi Admin: https://pk-engrave-service.onrender.com/admin
- API Endpoint: https://pk-engrave-service.onrender.com/api/comments
- Sample Blog Post ID: 2 (from your example)
