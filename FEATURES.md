# Sela Marketplace - Feature Documentation

## 🎯 Overview
Sela is a comprehensive marketplace platform with dark red/red gradient branding, offering admin controls, seller dashboards, AI assistance, and category-based browsing.

## ✅ Implemented Features

### 1. Enhanced Seller Dashboard (`/dashboard`)
- **Product Management**
  - View all listings with approval status
  - Quick stats: Total Listings, Messages, Total Views
  - Create new products via "Post New Ad" button (routes to `/sell`)
  
- **Sales Analytics**
  - View count tracking for each product
  - Sales count tracking (future integration with payment system)
  - Profile stats (total sales, rating)

- **Communication**
  - Message inbox with conversations
  - Quick access to chat threads

### 2. Admin Dashboard (`/admin`) 🔐
**Access Control**: Role-based authentication using `user_roles` table

**Features**:
- **Platform Statistics**
  - Total users, products, pending approvals, reports count
  
- **Product Management Tab**
  - View all products with approval status
  - Approve/reject product listings
  - Filter by approval status (pending, approved, rejected)

- **User Management Tab**
  - View all users with profile information
  - See seller stats (total sales, ratings)
  - Monitor user activity

- **Reports Tab**
  - Review reported products
  - See reporter information and reason
  - Resolve reports with tracking

**Security**: Admin access verified via `has_role()` security definer function

### 3. Category-Based Product Pages (`/category/:category`)
**Available Categories**:
- Vehicles, Property, Mobile Phones, Electronics
- Home & Furniture, Fashion, Beauty, Services
- Repair, Commercial, Babies & Kids, Food, Pets, Other

**Features**:
- Dynamic category filtering
- Search within category
- Sort by: Newest, Price (Low/High), Most Popular
- Responsive grid layout
- Shows approved products only

### 4. Standardized Category Cards
- Uniform 100px height for all cards
- Consistent styling with hover effects
- Horizontal scrollable layout
- Click to navigate to category page
- Product count display per category

### 5. AI Business Assistant

#### Sidebar Mode (Global) 🌟
- **Floating Toggle Button**: Fixed bottom-right on all pages
- **Collapsible Sidebar**: Opens from bottom-right
- **Features**:
  - Real-time chat interface
  - Fullscreen/minimize toggle
  - Context-aware business advice
  - Conversation history
  - Loading states with animated dots
  
- **Available On**: Index, Category pages, Product details

#### Full Page Mode (`/ai-assistant`)
- Dedicated page with enhanced UI
- Suggested questions for quick start
- Full conversation history
- Better for extended consultations

**AI Integration**: Powered by Lovable AI (google/gemini-2.5-flash)

### 6. Product Management System

#### Add Product (`/sell`)
**Form Fields**:
- Title, Description (required)
- Price, Location (required)
- Category, Condition (required)
- Product image URL (optional)

**Workflow**:
1. User fills form
2. Product submitted with `approval_status: "pending"`
3. Admin reviews in Admin Dashboard
4. Admin approves/rejects
5. Approved products shown publicly

#### Product Details (`/product/:id`)
- Full product information display
- Seller avatar (clickable to seller profile)
- View count tracking
- Message seller button
- Responsive image gallery

### 7. Seller Profiles (`/seller/:sellerId`)
**Profile Information**:
- Avatar, Name, Location
- Bio, Rating, Total Sales
- Follower/Following counts

**Features**:
- Follow/Unfollow system
- View seller's products
- Contact seller directly
- Responsive layout

### 8. Follow System
**Database Structure**:
- `followers` table tracks relationships
- Unique constraint prevents duplicates
- Cannot follow yourself (database constraint)

**Functions**:
- `get_follower_count(user_id)`: Returns follower count
- `get_following_count(user_id)`: Returns following count

### 9. Reporting System
**Report Products**:
- Users can report inappropriate products
- Report includes reason text
- Status tracking: pending → reviewed → resolved

**Admin Resolution**:
- Review reports in Admin Dashboard
- Mark as resolved with timestamp
- Track which admin resolved it

## 🗄️ Database Schema

### Core Tables
- `products`: Product listings with approval workflow
- `profiles`: Extended user information
- `conversations`: Chat threads between buyers/sellers
- `messages`: Individual chat messages
- `user_roles`: Role-based access control (admin, moderator, seller, user)
- `followers`: User follow relationships
- `reported_products`: Product reports with resolution tracking
- `categories`: Category definitions (future enhancement)

### Key Columns Added
**products**:
- `approval_status`: 'pending' | 'approved' | 'rejected'
- `sales_count`: Track number of sales
- `views_count`: Track product views

**profiles**:
- `bio`: User biography
- `rating`: Numeric rating (0-5.00)
- `total_sales`: Total sales count

## 🔒 Security Implementation

### Role-Based Access Control
```sql
-- Security definer function prevents RLS recursion
CREATE FUNCTION has_role(user_id, role) 
RETURNS BOOLEAN 
SECURITY DEFINER;

-- Admin policies use this function
CREATE POLICY "Admins can manage X" 
ON table_name 
USING (has_role(auth.uid(), 'admin'));
```

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only modify their own data
- Admins have elevated permissions via role checks
- Public data (approved products) viewable by all

## 🎨 Design System

### Color Scheme (Dark Red Theme)
```css
--primary: hsl(0 72% 41%)        /* Dark red */
--accent: hsl(0 84% 60%)         /* Normal red */
--gradient-primary: linear-gradient(135deg, dark-red, red)
```

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Typography
- Headings: Bold, sans-serif
- Body: Regular weight
- Semantic tokens used throughout

## 📱 Mobile Responsiveness
- All pages fully responsive
- Category cards scroll horizontally on mobile
- AI sidebar adapts to screen size
- Product grids adjust from 1-4 columns
- Touch-friendly buttons and spacing

## 🚀 Navigation Flow

### Public Users
1. Home (`/`) → Browse categories & trending products
2. Category page → Filter & search products
3. Product details → View product, see seller
4. Auth → Sign up/Login

### Authenticated Users
1. Dashboard → Manage products, view messages
2. Add Product → Create new listing
3. Messages → Chat with buyers/sellers
4. AI Assistant → Get business advice
5. Seller Profiles → Follow sellers, view products

### Admins
1. Admin Dashboard → Manage platform
2. Approve products → Review pending listings
3. Handle reports → Resolve user reports
4. User management → Monitor platform users

## 🔑 Getting Started as Admin

### Create First Admin User
```sql
-- After creating an account, run in Supabase SQL editor:
INSERT INTO user_roles (user_id, role) 
VALUES ('your-user-id-here', 'admin');
```

### Access Admin Dashboard
1. Sign in to your account
2. Admin button appears in header automatically
3. Click "Admin" to access dashboard
4. Manage products, users, and reports

## 📊 Analytics & Insights

### Product Metrics
- View count (auto-incremented on page view)
- Sales count (manual/future payment integration)
- Approval status tracking

### User Metrics
- Total sales per seller
- Rating system (0-5.00)
- Follower counts

### Platform Metrics (Admin)
- Total users
- Total products
- Pending approvals
- Active reports

## 🤖 AI Assistant Configuration

### Edge Function
- Location: `supabase/functions/business-assistant`
- Model: `google/gemini-2.5-flash`
- Rate limits: Per Lovable AI workspace limits

### Usage
- Free tier included with Lovable AI
- Context-aware responses
- Business-focused training
- Streaming disabled for stability

## 🎯 Future Enhancements

### Planned Features
1. ✅ Enhanced Seller Dashboard - COMPLETED
2. ✅ Admin Dashboard - COMPLETED
3. ✅ Category Pages - COMPLETED
4. ✅ Standardized Category Cards - COMPLETED
5. ✅ AI Assistant Sidebar - COMPLETED

### Potential Additions
- Payment integration (Stripe/Flutterwave)
- Image uploads to Supabase Storage
- Advanced search with filters
- Email notifications
- SMS integration
- Product reviews and ratings
- Wishlist functionality
- Real-time notifications
- Mobile app (React Native)

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Review Network tab for API failures
3. Verify database RLS policies
4. Check admin role assignment
5. Review edge function logs in Lovable Cloud

---

**Built with**: React, TypeScript, Tailwind CSS, Supabase, Lovable Cloud
**Theme**: Dark Red & Red Gradient
**Last Updated**: 2025
