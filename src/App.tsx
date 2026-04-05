import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminOverviewPage } from "@/pages/admin/AdminOverviewPage";
import { AdminCustomersPage } from "@/pages/admin/AdminCustomersPage";
import { AdminPlaceholderPage } from "@/pages/admin/AdminPlaceholderPage";
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage";
import { BestSellersPage } from "@/pages/BestSellersPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { GenresPage } from "@/pages/GenresPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { NewReleasesPage } from "@/pages/NewReleasesPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="genres" element={<GenresPage />} />
        <Route path="new" element={<NewReleasesPage />} />
        <Route path="bestsellers" element={<BestSellersPage />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route
          path="statistics"
          element={<AdminPlaceholderPage title="Statistics" />}
        />
      </Route>
    </Routes>
  );
}
