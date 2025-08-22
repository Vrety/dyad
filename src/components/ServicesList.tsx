import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Database, Settings, ExternalLink, ChevronRight, ChevronDown } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock services - these would come from Rework API
const mockServices = [
  {
    id: "rework-in-action",
    name: "Rework in Action",
  },
  {
    id: "customer-onboarding",
    name: "Customer Onboarding Process",
  },
  {
    id: "procurement-process",
    name: "Healthcare Procurement Process",
  },
  {
    id: "order-fulfillment",
    name: "Electronic Components Order Fulfillment System",
  },
];

export function ServicesList({ show }: { show: boolean }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);

  // Check if Rework is configured
  const isReworkConfigured = Boolean(
    settings?.reworkApiUrl && 
    settings?.reworkAccessToken && 
    settings?.reworkPassword
  );

  const openReworkSettings = async () => {
    await navigate({ to: "/settings" });
    // Scroll to rework section after navigation
    setTimeout(() => {
      const reworkSection = document.getElementById("rework-settings");
      if (reworkSection) {
        reworkSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleAllServicesClick = async () => {
    setSelectedMenuItem("all-services");
    await navigate({ to: "/services" });
  };

  const handleServiceClick = async (serviceId: string) => {
    setSelectedMenuItem(serviceId);
    await navigate({ to: `/services/${serviceId}` });
  };

  const toggleServicesMenu = () => {
    setIsServicesExpanded(!isServicesExpanded);
  };

  if (!show) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 p-4">
        <h2 className="text-lg font-semibold tracking-tight">Services</h2>
        <p className="text-sm text-muted-foreground">
          Rework.com business workflows
        </p>
      </div>
      
      <ScrollArea className="flex-grow">
        <div className="space-y-1 p-4 pt-0">
          {!isReworkConfigured ? (
            <div className="text-center space-y-4 py-8">
              <Database className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <div className="space-y-2">
                <h3 className="font-medium">No Services Connected</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to Rework.com to access business workflow services
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openReworkSettings}
                className="inline-flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configure Rework
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Services Menu Header */}
              <button
                onClick={toggleServicesMenu}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group",
                  isServicesExpanded
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "hover:bg-sidebar-accent"
                )}
              >
                <span>Services</span>
                {isServicesExpanded ? (
                  <ChevronDown className="h-4 w-4 transition-transform" />
                ) : (
                  <ChevronRight className="h-4 w-4 transition-transform" />
                )}
              </button>

              {/* Services Submenu */}
              {isServicesExpanded && (
                <div className="space-y-1 ml-4 border-l border-sidebar-border pl-3">
                  {/* All Services Item */}
                  <button
                    onClick={handleAllServicesClick}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                      selectedMenuItem === "all-services"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "hover:bg-sidebar-accent text-muted-foreground"
                    )}
                  >
                    All services
                  </button>

                  {/* Individual Services */}
                  {mockServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                        selectedMenuItem === service.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                          : "hover:bg-sidebar-accent text-muted-foreground"
                      )}
                    >
                      <div className="break-words leading-relaxed">
                        {service.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Settings Link */}
              <div className="pt-4 mt-4 border-t">
                <Button
                  variant="link"
                  size="sm"
                  onClick={openReworkSettings}
                  className="w-full text-xs text-muted-foreground h-auto p-2"
                >
                  <Settings className="h-3 w-3 mr-2" />
                  Manage services in settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}