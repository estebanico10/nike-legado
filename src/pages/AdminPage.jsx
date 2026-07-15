import { useState } from "react";
import AdminAuth from "../components/admin/AdminAuth";
import AdminLayout from "../components/admin/AdminLayout";
import InventoryTable from "../components/admin/InventoryTable";
import StoreSettings from "../components/admin/StoreSettings";
import HomeAdmin from "../components/admin/HomeAdmin";
import TeamAdmin from "../components/admin/TeamAdmin";
import SalesDashboard from "../components/admin/SalesDashboard";
import AnalyticsMetrics from "../components/admin/AnalyticsMetrics";
import OrderManagement from "../components/admin/OrderManagement";
import CustomerCRM from "../components/admin/CustomerCRM";
import MarketingAdmin from "../components/admin/MarketingAdmin";
import LoyaltyAdmin from "../components/admin/LoyaltyAdmin";
import DropsAdmin from "../components/admin/DropsAdmin";
import AIStylist from "../components/admin/AIStylist";
import CommunityAdmin from "../components/admin/CommunityAdmin";
import PresentationAdmin from "../components/admin/PresentationAdmin";
import ReviewsModeration from "../components/admin/ReviewsModeration";
import SocialAdmin from "../components/admin/SocialAdmin";
import MediaManagerAdmin from "../components/admin/MediaManagerAdmin";
import AuditLogsAdmin from "../components/admin/AuditLogsAdmin";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <SalesDashboard />;
      case "metricas": return <AnalyticsMetrics />;
      
      case "pedidos": return <OrderManagement />;
      case "inventario": return <InventoryTable />;
      case "clientes": return <CustomerCRM />;
      
      case "marketing": return <MarketingAdmin />;
      case "fidelidad": return <LoyaltyAdmin />;
      case "drops": return <DropsAdmin />;
      case "ai-stylist": return <AIStylist />;
      
      case "inicio": return <HomeAdmin />;
      case "comunidad": return <CommunityAdmin />;
      case "presentacion": return <PresentationAdmin />;
      case "resenas": return <ReviewsModeration />;
      case "social": return <SocialAdmin />;
      case "medios": return <MediaManagerAdmin />;
      
      case "equipo": return <TeamAdmin />;
      case "configuracion": return <StoreSettings />;
      case "auditoria": return <AuditLogsAdmin />;
      
      default: return <SalesDashboard />;
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
