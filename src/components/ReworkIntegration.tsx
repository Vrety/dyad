import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Database,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Loader2,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { showError, showSuccess } from "@/lib/toast";

// Mock services for now - these would come from the Rework API
const mockReworkServices = [
  {
    id: "customer-workflow-001",
    name: "Customer Onboarding Workflow",
    type: "workflow",
    description: "Automated customer onboarding process for B2B SaaS",
    enabled: true,
  },
  {
    id: "product-catalog-002",
    name: "Product Catalog Management",
    type: "catalog",
    description: "Manage product inventory and pricing",
    enabled: false,
  },
  {
    id: "analytics-dashboard-003",
    name: "Business Analytics Dashboard",
    type: "analytics",
    description: "Comprehensive business metrics and KPI tracking",
    enabled: true,
  },
];

export function ReworkIntegration() {
  const { settings, updateSettings } = useSettings();
  const [apiUrl, setApiUrl] = useState(settings?.reworkApiUrl || "");
  const [accessToken, setAccessToken] = useState(settings?.reworkAccessToken || "");
  const [password, setPassword] = useState(settings?.reworkPassword || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(Boolean(settings?.reworkAccessToken));
  const [services, setServices] = useState(mockReworkServices);

  const handleConnect = async () => {
    if (!apiUrl || !accessToken || !password) {
      showError("Please fill in all fields to connect to Rework.com");
      return;
    }

    setIsConnecting(true);
    try {
      // This would normally validate credentials with Rework API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Save to settings
      await updateSettings({
        reworkApiUrl: apiUrl,
        reworkAccessToken: accessToken,
        reworkPassword: password,
      });

      setIsConnected(true);
      showSuccess("Successfully connected to Rework.com!");
    } catch (error) {
      showError(`Failed to connect to Rework.com: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await updateSettings({
        reworkApiUrl: "",
        reworkAccessToken: "",
        reworkPassword: "",
      });
      
      setApiUrl("");
      setAccessToken("");
      setPassword("");
      setIsConnected(false);
      showSuccess("Disconnected from Rework.com");
    } catch (error) {
      showError(`Failed to disconnect: ${error}`);
    }
  };

  const toggleService = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, enabled: !service.enabled }
        : service
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Rework.com Integration
          </CardTitle>
          <CardDescription>
            Connect to Rework.com to access business workflow services and AI-powered automation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rework-url">API URL</Label>
                  <Input
                    id="rework-url"
                    placeholder="https://api.rework.com"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rework-token">Access Token</Label>
                  <Input
                    id="rework-token"
                    type="password"
                    placeholder="Enter your Rework.com access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rework-password">Password</Label>
                  <Input
                    id="rework-password"
                    type="password"
                    placeholder="Enter your Rework.com password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Need a Rework.com account?{" "}
                  <a
                    href="https://rework.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-1"
                  >
                    Sign up here
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Connect to Rework.com
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600 font-medium">Connected to Rework.com</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p><strong>API URL:</strong> {apiUrl}</p>
                <p><strong>Access Token:</strong> {"*".repeat(accessToken.length)}</p>
              </div>

              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Service Management
            </CardTitle>
            <CardDescription>
              Enable or disable Rework services for your AI applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{service.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {service.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={service.enabled ? "default" : "secondary"}
                      className={service.enabled ? "bg-green-600" : ""}
                    >
                      {service.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleService(service.id)}
                    >
                      {service.enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> View and manage your enabled services from the{" "}
                <span className="font-medium">Services</span> section in the sidebar.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}