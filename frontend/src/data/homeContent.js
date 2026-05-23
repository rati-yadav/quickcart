/** Wide banner images (16:5) — less crop in hero panel */
const heroImg = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&h=600&q=85`

export const HERO_SLIDES = [
  {
    title: 'Great deals',
    subtitle: 'Save big on your favorite products',
    cta: 'View deals',
    image: heroImg('photo-1607082348824-0a96f2a4b9da'),
  },
  {
    title: 'New arrivals',
    subtitle: 'Discover the latest trends',
    cta: 'Explore',
    image: heroImg('photo-1441986300917-64674bd600d8'),
  },
  {
    title: 'Prime benefits',
    subtitle: 'Fast delivery and exclusive deals',
    cta: 'Learn more',
    image: heroImg('photo-1556742049-0cfed4f6a45d'),
  },
  {
    title: 'Best sellers',
    subtitle: 'Shop our most popular items',
    cta: 'Shop now',
    image: heroImg('photo-1472851294608-062f824d29cc'),
  },
  {
    title: 'Electronics',
    subtitle: 'Upgrade your workspace',
    cta: 'Shop now',
    image: heroImg('photo-1498049794561-7780e7231661'),
  },
  {
    title: 'Home & kitchen',
    subtitle: 'Everything for your home',
    cta: 'Shop now',
    image: heroImg('photo-1556911220-bff31c812dba'),
  },
  {
    title: 'Welcome to Amazone',
    subtitle: 'Shop millions of products',
    cta: 'Shop now',
    image: heroImg('photo-1604719312566-8912e9227c6a'),
  },
  {
    title: 'Fashion',
    subtitle: 'Styles for every season',
    cta: 'Shop now',
    image: heroImg('photo-1445205170230-053b83016050'),
  },
  {
    title: 'Sports & outdoors',
    subtitle: 'Gear up and get moving',
    cta: 'Shop now',
    image: heroImg('photo-1517649763962-0c62306601b7'),
  },
]

const shopBox = (title, description, category, image, badge, options) => ({
  title,
  description,
  category,
  image,
  badge,
  options,
})

export const SHOP_BOXES = [
  shopBox(
    'Best collection on fashion',
    'Trending apparel, footwear & accessories for every season.',
    'Fashion',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
    'Up to 60% off',
    [
      { label: "Women's fashion", query: 'women', category: 'Fashion', icon: 'fa-person-dress', hint: 'Dresses & more' },
      { label: "Men's fashion", query: 'men', category: 'Fashion', icon: 'fa-shirt', hint: 'Shirts & jeans' },
      { label: 'Shoes & bags', query: 'shoes', category: 'Fashion', icon: 'fa-shoe-prints', hint: 'Top brands' },
      { label: 'Watches & jewelry', query: 'watch', category: 'Fashion', icon: 'fa-gem', hint: 'From ₹499' },
    ],
  ),
  shopBox(
    'Toys under ₹1,999',
    'Games, learning toys & outdoor fun for all ages.',
    'Toys',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=600&q=80',
    'Best sellers',
    [
      { label: 'Action figures', query: 'action', category: 'Toys', icon: 'fa-robot' },
      { label: 'Board games', query: 'game', category: 'Toys', icon: 'fa-chess' },
      { label: 'Soft toys', query: 'soft', category: 'Toys', icon: 'fa-heart' },
      { label: 'Educational kits', query: 'learn', category: 'Toys', icon: 'fa-graduation-cap' },
    ],
  ),
  shopBox(
    'Stationery bestsellers',
    'Notebooks, pens & office essentials starting at ₹99.',
    'Stationery',
    'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80',
    'From ₹99',
    [
      { label: 'Notebooks', query: 'notebook', category: 'Stationery', icon: 'fa-book' },
      { label: 'Art supplies', query: 'art', category: 'Stationery', icon: 'fa-palette' },
      { label: 'Office desk', query: 'desk', category: 'Stationery', icon: 'fa-briefcase' },
    ],
  ),
  shopBox(
    'Great prices on shoes',
    'Running, casual & formal footwear with fast delivery.',
    'Fashion',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    'Deal of the day',
    [
      { label: 'Running shoes', query: 'running', category: 'Fashion', icon: 'fa-person-running' },
      { label: 'Sneakers', query: 'sneaker', category: 'Fashion', icon: 'fa-shoe-prints' },
      { label: 'Formal shoes', query: 'formal', category: 'Fashion', icon: 'fa-user-tie' },
    ],
  ),
  shopBox(
    'Office furniture',
    'Desks, chairs & storage for work from home.',
    'Home',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
    'New arrivals',
    [
      { label: 'Office chairs', query: 'chair', category: 'Home', icon: 'fa-chair' },
      { label: 'Study desks', query: 'desk', category: 'Home', icon: 'fa-table' },
      { label: 'Lamps & decor', query: 'lamp', category: 'Home', icon: 'fa-lightbulb' },
    ],
  ),
  shopBox(
    'Deals on smartwatch',
    'Fitness tracking, calls & notifications on your wrist.',
    'Electronics',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    'Limited time',
    [
      { label: 'Smart watches', query: 'watch', category: 'Electronics', icon: 'fa-clock' },
      { label: 'Fitness bands', query: 'fitness', category: 'Electronics', icon: 'fa-heart-pulse' },
      { label: 'Accessories', query: 'band', category: 'Electronics', icon: 'fa-plug' },
    ],
  ),
  shopBox(
    'Robot vacuum cleaner',
    'Smart home cleaning with auto-charge & app control.',
    'Home',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    'Top rated',
    [
      { label: 'Robot vacuums', query: 'vacuum', category: 'Home', icon: 'fa-broom' },
      { label: 'Home appliances', query: 'home', category: 'Home', icon: 'fa-house' },
    ],
  ),
  shopBox(
    'Deals on mobiles',
    'Latest smartphones, cases & chargers.',
    'Electronics',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    'Up to 40% off',
    [
      { label: 'Smartphones', query: 'phone', category: 'Electronics', icon: 'fa-mobile-screen' },
      { label: 'Phone cases', query: 'case', category: 'Electronics', icon: 'fa-mobile' },
      { label: 'Headphones', query: 'headphone', category: 'Electronics', icon: 'fa-headphones' },
    ],
  ),
]

export const SHOP2_BOXES = [
  shopBox(
    'Deals on speakers',
    'Bluetooth, party & home audio systems.',
    'Electronics',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    'Hot deal',
    [
      { label: 'Bluetooth speakers', query: 'speaker', category: 'Electronics', icon: 'fa-volume-high' },
      { label: 'Home audio', query: 'audio', category: 'Electronics', icon: 'fa-music' },
    ],
  ),
  shopBox(
    'Safety supplies from ₹99',
    'Masks, sanitizers & personal care essentials.',
    'Health',
    'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&q=80',
    'From ₹99',
    [
      { label: 'Health & safety', query: 'mask', category: 'Health', icon: 'fa-kit-medical' },
      { label: 'Personal care', query: 'care', category: 'Health', icon: 'fa-pump-soap' },
    ],
  ),
  shopBox(
    'Gift hampers',
    'Curated gift boxes for every occasion.',
    'Gifts',
    'https://images.unsplash.com/photo-1549465220-5761434e73f0?w=600&q=80',
    'Bestseller',
    [
      { label: 'Gift boxes', query: 'gift', category: 'Gifts', icon: 'fa-gift' },
      { label: 'Festive specials', query: 'festive', category: 'Gifts', icon: 'fa-star' },
    ],
  ),
  shopBox(
    'Sports & fitness',
    'Gear up with shoes, mats & outdoor essentials.',
    'Sports',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&q=80',
    'New season',
    [
      { label: 'Sports gear', query: 'sport', category: 'Sports', icon: 'fa-football' },
      { label: 'Yoga & fitness', query: 'yoga', category: 'Sports', icon: 'fa-dumbbell' },
    ],
  ),
]

export const CATEGORY_STRIP = [
  { label: 'Electronics', category: 'Electronics', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&q=80' },
  { label: 'Fashion', category: 'Fashion', image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=300&q=80' },
  { label: 'Home', category: 'Home', image: 'https://images.unsplash.com/photo-1585386959980-a4154684a1ab?w=300&q=80' },
  { label: 'Beauty', category: 'Fashion', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&q=80' },
  { label: 'Kitchen', category: 'Kitchen', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80' },
  { label: 'Sports', category: 'Sports', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80' },
  { label: 'Gifts', category: 'Gifts', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&q=80' },
  { label: 'Health', category: 'Health', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&q=80' },
  { label: 'Deals', category: '', image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=300&q=80', query: 'deal' },
]

export const DISCOUNT_BANNERS = [
  { image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1400&q=80', title: 'Mega sale weekend', category: 'Electronics' },
  { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80', title: 'Fashion fest', category: 'Fashion' },
]
