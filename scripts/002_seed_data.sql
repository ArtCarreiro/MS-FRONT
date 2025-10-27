-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Eletrônicos', 'eletronicos', 'Smartphones, tablets, notebooks e mais', '/placeholder.svg?height=400&width=600'),
  ('Moda', 'moda', 'Roupas, calçados e acessórios', '/placeholder.svg?height=400&width=600'),
  ('Casa e Decoração', 'casa-decoracao', 'Móveis, decoração e utilidades domésticas', '/placeholder.svg?height=400&width=600'),
  ('Esportes', 'esportes', 'Equipamentos e roupas esportivas', '/placeholder.svg?height=400&width=600');

-- Insert sample products
INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock, is_featured) 
SELECT 
  'Smartphone Premium X1',
  'smartphone-premium-x1',
  'Smartphone de última geração com câmera de 108MP, tela AMOLED de 6.7" e processador octa-core',
  2999.90,
  3499.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  50,
  true
FROM categories WHERE slug = 'eletronicos';

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock, is_featured)
SELECT 
  'Notebook Ultra Pro',
  'notebook-ultra-pro',
  'Notebook profissional com Intel i7, 16GB RAM, SSD 512GB e tela Full HD de 15.6"',
  4599.00,
  5299.00,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600', '/placeholder.svg?height=600&width=600'],
  30,
  true
FROM categories WHERE slug = 'eletronicos';

INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock, is_featured)
SELECT 
  'Fone Bluetooth Premium',
  'fone-bluetooth-premium',
  'Fone de ouvido com cancelamento de ruído ativo, bateria de 30h e som Hi-Fi',
  599.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  100,
  true
FROM categories WHERE slug = 'eletronicos';

INSERT INTO products (name, slug, description, price, compare_at_price, category_id, image_url, images, stock)
SELECT 
  'Camiseta Básica Premium',
  'camiseta-basica-premium',
  'Camiseta 100% algodão com corte moderno e acabamento premium',
  89.90,
  129.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  200,
  false
FROM categories WHERE slug = 'moda';

INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock)
SELECT 
  'Tênis Esportivo Pro',
  'tenis-esportivo-pro',
  'Tênis profissional para corrida com tecnologia de amortecimento avançada',
  399.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  80,
  false
FROM categories WHERE slug = 'esportes';

INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock, is_featured)
SELECT 
  'Sofá Moderno 3 Lugares',
  'sofa-moderno-3-lugares',
  'Sofá confortável com design moderno, estrutura em madeira e tecido premium',
  1899.00,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  15,
  true
FROM categories WHERE slug = 'casa-decoracao';

INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock)
SELECT 
  'Kit Halteres Ajustáveis',
  'kit-halteres-ajustaveis',
  'Kit com 2 halteres ajustáveis de 2kg a 10kg cada, ideal para treino em casa',
  299.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  45,
  false
FROM categories WHERE slug = 'esportes';

INSERT INTO products (name, slug, description, price, category_id, image_url, images, stock)
SELECT 
  'Luminária LED Inteligente',
  'luminaria-led-inteligente',
  'Luminária com controle por app, 16 milhões de cores e compatível com assistentes de voz',
  179.90,
  id,
  '/placeholder.svg?height=600&width=600',
  ARRAY['/placeholder.svg?height=600&width=600'],
  120,
  false
FROM categories WHERE slug = 'casa-decoracao';
