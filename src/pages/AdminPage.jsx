import { useState } from "react";
import AdminAuth from "../components/admin/AdminAuth";
import AdminLayout from "../components/admin/AdminLayout";
import InventoryTable from "../components/admin/InventoryTable";
import StoreSettings from "../components/admin/StoreSettings";
import SalesDashboard from "../components/admin/SalesDashboard";
import HomeAdmin from "../components/admin/HomeAdmin";
import TeamAdmin from "../components/admin/TeamAdmin";
import SocialAdmin from "../components/admin/SocialAdmin";
import PresentationAdmin from "../components/admin/PresentationAdmin";

// Nuevos componentes
import OrderManagement from "../components/admin/OrderManagement";
import CustomerCRM from "../components/admin/CustomerCRM";
import MarketingAdmin from "../components/admin/MarketingAdmin";
import ReviewsModeration from "../components/admin/ReviewsModeration";
import AnalyticsMetrics from "../components/admin/AnalyticsMetrics";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("inventario");

  const renderContent = () => {
    switch (activeTab) {
      case "inventario":
        return <InventoryTable />;
      case "ventas":
        return <SalesDashboard />;
      case "pedidos":
        return <OrderManagement />;
      case "clientes":
        return <CustomerCRM />;
      case "marketing":
        return <MarketingAdmin />;
      case "resenas":
        return <ReviewsModeration />;
      case "metricas":
        return <AnalyticsMetrics />;
      case "social":
        return <SocialAdmin />;
      case "configuracion":
        return <StoreSettings />;
      case "inicio":
        return <HomeAdmin />;
      case "presentacion":
        return <PresentationAdmin />;
      case "equipo":
        return <TeamAdmin />;
      default:
        return <InventoryTable />;
    }
  };

  return (
    <AdminAuth>
      <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderContent()}
      </AdminLayout>
    </AdminAuth>
  );
}
