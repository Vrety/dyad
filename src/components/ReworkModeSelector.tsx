import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Database, Settings, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";

// Mock enabled services - these would come from Rework settings
const getEnabledServices = (settings: any) => [
  {
    id: "customer-workflow-001",
    name: "Customer Onboarding Workflow",
    type: "workflow",
    description: "Automated customer onboarding process for B2B SaaS",
    enabled: true,
  },
  {
    id: "analytics-dashboard-003",
    name: "Business Analytics Dashboard",
    type: "analytics",
    description: "Comprehensive business metrics and KPI tracking",
    enabled: true,
  },
];

export function ReworkModeSelector({ appId }: { appId?: number }) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Check if Rework is configured
  const isReworkConfigured = Boolean(
    settings?.reworkApiUrl && 
    settings?.reworkAccessToken && 
    settings?.reworkPassword
  );
  
  const enabledServices = isReworkConfigured ? getEnabledServices(settings) : [];

  const connectToService = async (service: typeof enabledServices[0]) => {
    if (!appId) return;
    
    try {
      // This would connect to the Rework service when implemented
      console.log(`Connecting to service ${service.id} for app ${appId}`);
      setSelectedServiceId(service.id);
    } catch (error) {
      console.error("Failed to connect to Rework service:", error);
    }
  };

  const openReworkSettings = async () => {
    await navigate({ to: "/settings" });
    // Scroll to integrations section after navigation
    setTimeout(() => {
      const integrationsSection = document.getElementById("integrations");
      if (integrationsSection) {
        integrationsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="has-[>svg]:px-1.5 flex items-center gap-1.5 h-8 border-blue-500/50 hover:bg-blue-500/10 font-medium shadow-sm shadow-blue-500/10 transition-all hover:shadow-md hover:shadow-blue-500/15"
            >
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-xs-sm">Rework</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Configure Rework.com service</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-80 border-blue-500/20">
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-1.5">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">Rework Services</span>
            </h4>
            <div className="h-px bg-gradient-to-r from-blue-500/50 via-blue-500/20 to-transparent" />
          </div>

          {!isReworkConfigured ? (
            <div className="text-sm text-center text-muted-foreground space-y-2">
              <p>Connect to Rework.com to access business workflow services</p>
              <Button
                variant="outline"
                size="sm"
                onClick={openReworkSettings}
                className="inline-flex items-center justify-center gap-2 border-blue-500/30 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
              >
                <Settings className="h-4 w-4" />
                Configure Rework
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Enabled Services</span>
                <Badge variant="outline" className="text-xs">
                  {enabledServices.length} services
                </Badge>
              </div>
              
              {enabledServices.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {enabledServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        selectedServiceId === service.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-border hover:border-blue-500/50 hover:bg-muted/50"
                      }`}
                      onClick={() => connectToService(service)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {service.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {service.type} • {service.description}
                          </p>
                        </div>
                        {selectedServiceId === service.id && (
                          <Badge className="ml-2 bg-blue-500 text-white text-xs">
                            Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-4">
                  <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No services enabled</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={openReworkSettings}
                    className="text-xs mt-1 p-0 h-auto text-blue-600"
                  >
                    Enable services in settings
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}