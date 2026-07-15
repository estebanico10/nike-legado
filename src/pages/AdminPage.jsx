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
import DropsAdmin from "../components/admin/DropsAdmin";
import CommunityAdmin from "../components/admin/CommunityAdmin";
import LoyaltyAdmin from "../components/admin/LoyaltyAdmin";

// Nuevos componentes
import OrderManagement from "../components/admin/OrderManagement";
import CustomerCRM from "../components/admin/CustomerCRM";
import MarketingAdmin from "../components/admin/MarketingAdmin";
import ReviewsModeration from "../components/admin/ReviewsModeration";
import AnalyticsMetrics from "../components/admin/AnalyticsMetrics";
import MediaManagerAdmin from "../components/admin/MediaManagerAdmin";
import AuditLogsAdmin from "../components/admin/AuditLogsAdmin";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("ventas");

  const renderContent = () => {
    switch (activeTab) {
      case "inventario":
        return <InventoryTable />;
      case "drops":
        return <DropsAdmin />;
      case "comunidad":
        return <CommunityAdmin />;
      case "fidelidad":
        return <LoyaltyAdmin />;
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
      case "media":
        return <MediaManagerAdmin />;
      case "auditoria":
        return <AuditLogsAdmin />;
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
