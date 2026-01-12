# Quick Start - Blog Features

## ⚡ Quick Setup (2 minutes - Comments work immediately!)

### Important Update: Comments Work Now!

The comment system is **already working** with your current Strapi setup. The `approved` and `parentComment` fields are optional enhancements.

### Step 1: Test Comments Right Away

```bash
# Terminal 1: Frontend
npm run dev
```

Then:
1. Open http://localhost:5173
2. Go to any blog post
3. Fill in comment form and submit
4. **Comment appears immediately!** ✅

### Step 2 (Optional): Add Email Notifications
Create `.env.local` file in the project root:

```env
# Gmail Configuration (Recommended for quick start)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=premkarki.business@gmail.com
SMTP_PASS=your-gmail-app-password-here

# Strapi
STRAPI_API_URL=https://pk-engrave-service.onrender.com
```

**Get Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search for "App passwords"
4. Create new app password for "Mail"
5. Copy the 16-character password into `SMTP_PASS`

### Step 2: Configure Strapi Content Types

#### A. Comment Content Type
Log in to Strapi admin and add these fields to the `comment` content type:

| Field Name | Type | Required | Default | Note |
|------------|------|----------|---------|------|
| content | Long text | Yes | - | Comment text |
| author | Text | Yes | - | Commenter name |
| email | Email | Yes | - | Commenter email |
| blogPost | Relation | Yes | - | Many-to-One with blog-post |
| parentComment | Relation | No | - | Many-to-One with comment (self) |
| approved | Boolean | No | false | For moderation |

**Set Permissions:**
- Settings → Users & Permissions → Public
- Comment: Enable `create` and `find`

#### B. Subscriber Content Type  
Add these fields:

| Field Name | Type | Required | Unique | Note |
|------------|------|----------|--------|------|
| email | Email | Yes | Yes | Subscriber email |
| subscribedAt | DateTime | No | No | Subscription timestamp |

**Set Permissions:**
- Settings → Users & Permissions → Public
- Subscriber: Enable `create` and `find`

### Step 3: Start the Application

```bash
# Terminal 1: Backend server (for email notifications)
npm run start:server

# Terminal 2: Frontend (in a new terminal)
npm run dev
```

### Step 4: Test Everything

#### Test Newsletter (30 seconds):
1. Open http://localhost:5173
2. Scroll to footer
3. Enter email → Click "Subscribe"
4. Should see green success message
5. Check Strapi: Content Manager → Subscribers

#### Test Comments (2 minutes):
1. Go to any blog post (e.g., "Choosing the Right Laser Engraver")
2. Scroll to comments section
3. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Comment: "Great article!"
4. Click "Post Comment"
5. See message: "Comment submitted successfully! It will appear after approval."
6. **Check your email** (premkarki.business@gmail.com) for notification
7. Open Strapi → Content Manager → Comments
8. Find your comment → Set `approved` to `true` → Save
9. Refresh the blog page → Comment should now appear!

#### Test Replies (1 minute):
1. Click "Reply" button on an approved comment
2. Fill in the form
3. Submit reply
4. Check email notification (will say "This is a reply to comment #X")
5. Approve in Strapi
6. Refresh → Reply appears indented under parent comment

## ✅ You're Done!

All features are now working:
- ✅ Newsletter subscriptions save to database
- ✅ Comments with approval system
- ✅ Nested comment replies
- ✅ Email notifications to admin

## 🐛 Troubleshooting

### Email not sending?
- Check SMTP credentials in `.env.local`
- For Gmail: Use app password, not regular password
- Check server terminal for error messages
- Try sending test email: `npm run start:server` and watch logs

### Comments not appearing?
- Check if `approved` is set to `true` in Strapi
- Check browser console for API errors
- Verify public permissions are set correctly

### Newsletter not working?
- Check Strapi public permissions for Subscriber
- Check browser console for errors
- Verify email field is marked as unique in Strapi

## 📚 More Info

- **Full Documentation**: See `BLOG_FEATURES_SETUP.md`
- **Summary**: See `BLOG_FEATURES_SUMMARY.md`
- **Questions?** Check the troubleshooting section in BLOG_FEATURES_SETUP.md

---

**Need Help?** All configurations are documented in the other markdown files!
