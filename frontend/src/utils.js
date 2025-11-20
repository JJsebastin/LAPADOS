export const createPageUrl = (pageName) => {
  const pageMap = {
    'Dashboard': '/dashboard',
    'Blogs': '/blogs',
    'CreateBlog': '/create-blog',
    'BlogDetail': '/blog-detail',
    'Moduloz': '/moduloz',
    'ModuloDetail': '/modulo-detail',
    'Chatbot': '/chatbot',
    'Leaderboard': '/leaderboard',
    'Profile': '/profile',
  };
  
  const basePath = pageMap[pageName.split('?')[0]] || '/';
  const queryString = pageName.includes('?') ? '?' + pageName.split('?')[1] : '';
  
  return basePath + queryString;
};

