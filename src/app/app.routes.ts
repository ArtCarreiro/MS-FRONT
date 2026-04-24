import { Routes } from '@angular/router';
import { adminGuard } from '@app/guards/admin.guard';
import { authGuard } from '@app/guards/auth.guard';
import { guestGuard } from '@app/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then((module) => module.HomePage),
    title: 'MS-FRONT | Home',
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then((module) => module.ProductsPage),
    title: 'MS-FRONT | Produtos',
  },
  {
    path: 'products/:uuid',
    loadComponent: () => import('./pages/product-detail/product-detail.page').then((module) => module.ProductDetailPage),
    title: 'MS-FRONT | Produto',
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then((module) => module.CartPage),
    title: 'MS-FRONT | Carrinho',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.page').then((module) => module.CheckoutPage),
    title: 'MS-FRONT | Checkout',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.page').then((module) => module.LoginPage),
    title: 'MS-FRONT | Login',
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/register/register.page').then((module) => module.RegisterPage),
    title: 'MS-FRONT | Cadastro',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.page').then((module) => module.ProfilePage),
    title: 'MS-FRONT | Perfil',
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.page').then((module) => module.OrdersPage),
    title: 'MS-FRONT | Pedidos',
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin.page').then((module) => module.AdminPage),
    title: 'MS-FRONT | Admin',
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((module) => module.NotFoundPage),
    title: 'MS-FRONT | 404',
  },
];
