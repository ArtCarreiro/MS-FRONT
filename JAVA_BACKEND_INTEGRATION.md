# Integração com Backend Java

Este frontend React/Next.js está configurado para consumir APIs REST de um backend Java.

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### 2. Endpoints Esperados do Backend Java

O frontend espera os seguintes endpoints REST:

#### Autenticação
- `POST /api/auth/login` - Login do usuário
  - Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id, email, name, createdAt } }`

- `POST /api/auth/register` - Registro de novo usuário
  - Body: `{ email: string, password: string, name?: string }`
  - Response: `{ token: string, user: { id, email, name, createdAt } }`

#### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/featured` - Listar produtos em destaque
- `GET /api/products/{slug}` - Buscar produto por slug
- `GET /api/products/category/{categorySlug}` - Produtos por categoria

#### Categorias
- `GET /api/categories` - Listar todas as categorias

#### Carrinho (requer autenticação)
- `GET /api/cart` - Obter carrinho do usuário
- `POST /api/cart/items` - Adicionar item ao carrinho
  - Body: `{ productId: string, quantity: number }`
- `PUT /api/cart/items/{productId}` - Atualizar quantidade
  - Body: `{ quantity: number }`
- `DELETE /api/cart/items/{productId}` - Remover item
- `DELETE /api/cart` - Limpar carrinho

#### Pedidos (requer autenticação)
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/{orderId}` - Buscar pedido específico
- `POST /api/orders` - Criar novo pedido
  - Body: `{ shippingName, shippingAddress, shippingCity, shippingState, shippingZip }`

### 3. Autenticação JWT

O frontend armazena o token JWT no `localStorage` e o envia em todas as requisições autenticadas:

\`\`\`
Authorization: Bearer {token}
\`\`\`

### 4. Estrutura de Dados

#### Product
\`\`\`typescript
{
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  imageUrl: string
  images?: string[]
  stock: number
  categoryId: string
  isFeatured: boolean
  isActive: boolean
  createdAt: string
}
\`\`\`

#### Order
\`\`\`typescript
{
  id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total: number
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  createdAt: string
  orderItems: OrderItem[]
}
\`\`\`

### 5. CORS

Certifique-se de que seu backend Java está configurado para aceitar requisições do frontend:

\`\`\`java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
\`\`\`

### 6. Exemplo de Controller Java (Spring Boot)

\`\`\`java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @GetMapping
    public List<Product> getAllProducts() {
        // Retornar lista de produtos
    }
    
    @GetMapping("/featured")
    public List<Product> getFeaturedProducts() {
        // Retornar produtos em destaque
    }
    
    @GetMapping("/{slug}")
    public Product getProductBySlug(@PathVariable String slug) {
        // Retornar produto por slug
    }
}
\`\`\`

## Arquivos Principais

- `lib/api/client.ts` - Cliente HTTP base com interceptors
- `lib/api/auth.ts` - Serviço de autenticação
- `lib/api/products.ts` - Serviço de produtos
- `lib/api/cart.ts` - Serviço de carrinho
- `lib/api/orders.ts` - Serviço de pedidos
- `hooks/use-auth.tsx` - Hook de autenticação
- `hooks/use-cart.tsx` - Hook de carrinho (com sincronização)

## Instalação e Execução

\`\`\`bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
\`\`\`

O frontend estará disponível em `http://localhost:3000`
\`\`\`
