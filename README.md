# MS-FRONT

Frontend de marketplace construído com Angular 21, componentes standalone e consumo da MS-API.

O projeto entrega uma vitrine de produtos, carrinho persistido no navegador, cadastro de usuários, área de perfil, páginas protegidas por guardas de rota e uma base pronta para autenticação com JWT assim que o backend expuser o endpoint de login.

## Visão geral

Hoje a aplicação já cobre os seguintes fluxos:

- listagem de produtos com busca, filtro por categoria e ordenação;
- detalhe de produto com adição ao carrinho;
- carrinho com atualização de quantidade e persistência em `localStorage`;
- cadastro de usuários via `POST /users`;
- rotas protegidas para perfil, pedidos e administração;
- interceptor pronto para anexar token Bearer nas requisições;
- tratamento centralizado de erros HTTP.

Pontos importantes do estado atual:

- o login ainda não está integrado porque a MS-API atual não expõe um endpoint de autenticação/JWT;
- o checkout já possui formulário e validações, mas ainda não envia pedidos para a API;
- a tela de pedidos usa dados mockados;
- a tela administrativa hoje funciona como dashboard de leitura, sem CRUD completo.

## Stack

- Angular 21
- TypeScript 5
- RxJS 7
- Angular Router
- Angular Reactive Forms
- Vitest para testes unitários

## Requisitos

- Node.js com versão compatível com Angular 21
- npm 10+ recomendado
- MS-API disponível localmente em `http://localhost:8080`

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Confira a URL da API em [src/environments/environment.ts](/home/arthur/Projects/MS-FRONT/src/environments/environment.ts:1):

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',
} as const;
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

4. Acesse:

```text
http://localhost:4200
```

## Scripts disponíveis

- `npm start`: sobe o projeto em modo desenvolvimento.
- `npm run build`: gera o build da aplicação.
- `npm run watch`: recompila continuamente em modo desenvolvimento.
- `npm test`: executa os testes unitários.

## Integração com a MS-API

As URLs são montadas por [src/app/services/api.service.ts](/home/arthur/Projects/MS-FRONT/src/app/services/api.service.ts:1) a partir de `environment.apiBaseUrl`.

Endpoints já consumidos no frontend:

| Recurso | Endpoint base | Uso atual |
| --- | --- | --- |
| Usuários | `/users` | cadastro, listagem, detalhe, atualização e remoção |
| Produtos | `/products` | catálogo, detalhe, métricas do admin e operações CRUD via service |
| Clientes | `/customers` | service preparado para CRUD |
| Endereços | `/address` | service preparado para CRUD |

Observações:

- a constante de rotas da API fica em [src/app/shared/constants/api-routes.ts](/home/arthur/Projects/MS-FRONT/src/app/shared/constants/api-routes.ts:1);
- hoje existe apenas [src/environments/environment.ts](/home/arthur/Projects/MS-FRONT/src/environments/environment.ts:1), sem `fileReplacements` configurado no `angular.json`;
- isso significa que, no estado atual, o build de produção continua usando a mesma `apiBaseUrl` local se nada for ajustado antes do deploy.

## Autenticação e autorização

O projeto já tem a infraestrutura de sessão preparada:

- [src/app/services/session.service.ts](/home/arthur/Projects/MS-FRONT/src/app/services/session.service.ts:1) gerencia a sessão atual e persiste em `localStorage`;
- [src/app/interceptors/auth.interceptor.ts](/home/arthur/Projects/MS-FRONT/src/app/interceptors/auth.interceptor.ts:1) adiciona `Authorization: Bearer <token>`;
- [src/app/interceptors/error.interceptor.ts](/home/arthur/Projects/MS-FRONT/src/app/interceptors/error.interceptor.ts:1) normaliza erros HTTP;
- [src/app/guards/auth.guard.ts](/home/arthur/Projects/MS-FRONT/src/app/guards/auth.guard.ts:1) exige autenticação;
- [src/app/guards/guest.guard.ts](/home/arthur/Projects/MS-FRONT/src/app/guards/guest.guard.ts:1) bloqueia login/cadastro para usuário autenticado;
- [src/app/guards/admin.guard.ts](/home/arthur/Projects/MS-FRONT/src/app/guards/admin.guard.ts:1) restringe a rota administrativa ao papel `ADMINISTRATOR`.

Chaves salvas no navegador:

- `ms-front.cart`
- `ms-front.session`

### Situação atual do login

A tela de login existe, mas o método `login()` em [src/app/services/auth.service.ts](/home/arthur/Projects/MS-FRONT/src/app/services/auth.service.ts:1) retorna erro `501` de forma intencional enquanto o backend não disponibiliza o contrato de autenticação.

### Como simular sessão localmente

Enquanto o backend não expõe login/JWT, dá para testar rotas protegidas inserindo uma sessão manualmente no `localStorage` do navegador:

```js
localStorage.setItem('ms-front.session', JSON.stringify({
  accessToken: 'token-de-teste',
  issuedAt: new Date().toISOString(),
  user: {
    uuid: 'usuario-demo',
    email: 'admin@demo.com',
    role: 'ADMINISTRATOR'
  }
}));
```

Depois disso, recarregue a página.

## Rotas da aplicação

| Rota | Acesso | Finalidade |
| --- | --- | --- |
| `/` | público | home com destaques e categorias |
| `/products` | público | catálogo com busca, filtros e ordenação |
| `/products/:uuid` | público | detalhe do produto |
| `/cart` | público | carrinho de compras |
| `/checkout` | público | formulário de checkout ainda não integrado à API |
| `/login` | apenas visitantes | tela de login preparada para futuro JWT |
| `/register` | apenas visitantes | cadastro de usuários |
| `/profile` | autenticado | resumo da sessão do usuário |
| `/orders` | autenticado | histórico de pedidos mockado |
| `/admin` | autenticado + `ADMINISTRATOR` | dashboard resumido |
| `**` | público | página 404 |

As rotas estão definidas em [src/app/app.routes.ts](/home/arthur/Projects/MS-FRONT/src/app/app.routes.ts:1).

## Estrutura do projeto

```text
src/
  app/
    components/    componentes reutilizáveis, como navbar, footer e card de produto
    guards/        regras de acesso por rota
    interceptors/  token Bearer e normalização de erros
    models/        contratos TypeScript usados pelo frontend
    pages/         páginas principais da aplicação
    services/      integração com API, sessão e carrinho
    shared/        constantes e utilitários
  environments/    configuração de ambiente
```

## Organização da arquitetura

- `pages`: orquestram fluxo de tela e formulários.
- `components`: encapsulam UI reutilizável.
- `services`: concentram regras de integração e estado compartilhado.
- `models`: tipam o contrato entre frontend e backend.
- `shared/utils/product.util.ts`: concentra busca, filtro, ordenação e extração de categorias.

Detalhes relevantes:

- [src/app/services/product.service.ts](/home/arthur/Projects/MS-FRONT/src/app/services/product.service.ts:1) usa cache em memória com `shareReplay` para reaproveitar a listagem;
- [src/app/services/cart.service.ts](/home/arthur/Projects/MS-FRONT/src/app/services/cart.service.ts:1) mantém o carrinho reativo e persistido;
- o projeto usa aliases `@app/*` e `@env/*`, definidos em [tsconfig.json](/home/arthur/Projects/MS-FRONT/tsconfig.json:1).

## Modelos principais

Os contratos mais importantes hoje são:

- `Product`: produto com `name`, `price`, `estoque`, `skuCode` e `keywords`;
- `User`: usuário com `email` e `role`;
- `AuthSession`: sessão com `accessToken`, datas e dados do usuário;
- `Customer` e `Address`: contratos preparados para expandir o fluxo de checkout e perfil;
- `Order`: modelo usado atualmente pela tela de pedidos mockada.

Veja os arquivos em [src/app/models](/home/arthur/Projects/MS-FRONT/src/app/models).

## Testes

No momento existe cobertura inicial em [src/app/app.spec.ts](/home/arthur/Projects/MS-FRONT/src/app/app.spec.ts:1), validando a criação do shell principal e a renderização do cabeçalho.

Para executar:

```bash
npm test
```

## Limitações atuais

- login real depende de endpoint JWT no backend;
- pedidos ainda não são persistidos;
- checkout ainda não chama a MS-API;
- dashboard admin ainda não possui CRUD completo;
- falta configuração separada de ambiente para produção.

## Próximos passos recomendados

1. Expor autenticação na MS-API e concluir o fluxo de login/logout.
2. Criar endpoints de pedidos e integrar o checkout.
3. Trocar os dados mockados de pedidos por consumo real da API.
4. Adicionar `environment` de produção com `fileReplacements`.
5. Expandir a cobertura de testes para guards, services e páginas críticas.
