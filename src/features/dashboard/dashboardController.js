const HeroBannerService = require('../home/homeService');
const ArticleService = require('../articles/articleService');
const CareerService = require('../careers/careerService');
const ProductService = require('../products/productService');
const ProductRepository = require('../products/productRepository');
const ContactService = require('../contacts/contactService');
const CompanyProfileService = require('../company-profile/companyProfileService');
const CompanyProfileRepository = require('../company-profile/companyProfileRepository');

exports.getDashboardStats = async (req, res, next) => {
  try {
    // Instantiate services that need repositories
    const productRepository = new ProductRepository();
    const productService = new ProductService(productRepository);
    
    const companyProfileRepository = new CompanyProfileRepository();
    const companyProfileService = new CompanyProfileService(companyProfileRepository);

    // Get counts from all services
    const [
      heroBanners,
      articles,
      careers,
      products,
      contacts,
      corporateEntities
    ] = await Promise.all([
      HeroBannerService.listHome({}, 1, 1000),
      ArticleService.listArticles({}, 1, 1000),
      CareerService.listCareers({}, 1, 1000),
      productService.listProducts({}, 1, 1000),
      ContactService.listContacts({}, 1, 1000),
      companyProfileService.listProfiles({}, 1, 1000)
    ]);

    // Calculate statistics
    const stats = {
      heroBanners: {
        total: heroBanners.data?.length || 0,
        active: heroBanners.data?.filter(banner => banner.status === 'active').length || 0
      },
      articles: {
        total: articles.data?.length || 0,
        published: articles.data?.filter(article => article.publishStatus === 'published').length || 0,
        draft: articles.data?.filter(article => article.publishStatus === 'draft').length || 0
      },
      careers: {
        total: careers.data?.length || 0,
        active: careers.data?.filter(career => career.status === 'active').length || 0,
        closed: careers.data?.filter(career => career.status === 'closed').length || 0
      },
      products: {
        total: products.data?.length || 0,
        active: products.data?.filter(product => product.status === 'active').length || 0
      },
      contacts: {
        total: contacts.data?.length || 0,
        unread: contacts.data?.filter(contact => !contact.isRead).length || 0
      },
      corporateEntities: {
        total: corporateEntities.data?.length || 0
      }
    };

    // Get recent data for dashboard widgets
    const recentArticles = articles.data
      ? articles.data
          .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
          .slice(0, 5)
      : [];

    const activeCareers = careers.data
      ? careers.data
          .filter(career => career.status === 'active')
          .slice(0, 5)
      : [];

    res.json({
      status: 'success',
      data: {
        stats,
        recentArticles,
        activeCareers
      }
    });
  } catch (error) {
    next(error);
  }
}; 