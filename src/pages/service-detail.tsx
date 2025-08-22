import { useState } from "react";
import { useRouter, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Database,
  Settings,
  Workflow,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { mockServiceData } from "@/data/mockServiceData";

interface ServiceField {
  id: string;
  name: string;
  code: string;
  type: string;
  required: boolean;
  placeholder?: string;
}

interface WorkflowStage {
  id: number;
  name: string;
  content: string;
  metatype: string;
  duration: number;
  required_todos: number;
  form: ServiceField[];
}

interface ServiceJob {
  name: string;
  content: string;
  status: number;
  form: Array<{
    id: string;
    code: string;
    name: string;
    value: string;
    display: string;
    type: string;
  }>;
}

interface ServiceData {
  name: string;
  content: string;
  tags: Array<{ name: string; color: string }>;
  stages: WorkflowStage[];
  jobs: ServiceJob[];
}

// Mock service configurations - in real app this would come from API
const getServiceData = (serviceId: string): ServiceData => {
  const serviceConfigs: Record<string, Partial<ServiceData>> = {
    "rework-in-action": {
      name: "Rework in Action 💃",
      content:
        "<p>Video workflow automation service for creating business use case demonstrations</p>",
      tags: [
        { name: "video", color: "#cc2491" },
        { name: "automation", color: "#25d8ec" },
        { name: "workflow", color: "#efb300" },
      ],
    },
    "customer-onboarding": {
      name: "Customer Onboarding Process",
      content:
        "<p>Streamlined customer onboarding workflow for B2B SaaS companies</p>",
      tags: [
        { name: "onboarding", color: "#22c55e" },
        { name: "customer", color: "#3b82f6" },
        { name: "b2b", color: "#8b5cf6" },
      ],
    },
    "procurement-process": {
      name: "Healthcare Procurement Process",
      content:
        "<p>Automated procurement workflow specifically designed for healthcare clinics</p>",
      tags: [
        { name: "healthcare", color: "#ef4444" },
        { name: "procurement", color: "#f59e0b" },
        { name: "clinic", color: "#10b981" },
      ],
    },
    "order-fulfillment": {
      name: "Order Fulfillment System",
      content:
        "<p>Electronic components order processing and fulfillment workflow</p>",
      tags: [
        { name: "fulfillment", color: "#6366f1" },
        { name: "orders", color: "#ec4899" },
        { name: "electronics", color: "#14b8a6" },
      ],
    },
  };

  const config = serviceConfigs[serviceId] || {};
  return {
    ...mockServiceData,
    ...config,
  };
};

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams({ from: "/services/$serviceId" });
  const { settings } = useSettings();
  const serviceId = params.serviceId;
  const [serviceData] = useState<ServiceData>(getServiceData(serviceId));

  const isReworkConfigured = Boolean(
    settings?.reworkApiUrl &&
      settings?.reworkAccessToken &&
      settings?.reworkPassword,
  );

  if (!isReworkConfigured) {
    return (
      <div className="min-h-screen px-8 py-4">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => router.history.back()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
            <Database className="h-16 w-16 text-muted-foreground/50" />
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">No Services Connected</h2>
              <p className="text-muted-foreground max-w-md">
                Connect to Rework.com to access and manage your business
                workflow services.
              </p>
            </div>
            <Button
              onClick={() => router.navigate({ to: "/settings" })}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Configure Rework Integration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStageStatusIcon = (metatype: string) => {
    switch (metatype) {
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "No duration";
    const days = Math.floor(seconds / 86400);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    const hours = Math.floor(seconds / 3600);
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  const getJobStatusBadge = (status: number) => {
    switch (status) {
      case 10:
        return <Badge className="bg-green-600">Completed</Badge>;
      case 0:
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">In Progress</Badge>;
    }
  };

  return (
    <div className="min-h-screen px-8 py-4">
      <div className="max-w-5xl mx-auto">
        <Button
          onClick={() => router.history.back()}
          variant="outline"
          size="sm"
          className="flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>

        {/* Service Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{serviceData.name}</h1>
                <div className="flex flex-wrap gap-2 mb-2">
                  {serviceData.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      style={{ backgroundColor: tag.color }}
                      className="text-white"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                {serviceData.content && (
                  <div
                    className="text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: serviceData.content }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflow" className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="fields" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Fields
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Service Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Workflow Stages
                    </h3>
                    <p className="text-2xl font-bold">
                      {serviceData.stages?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Job Templates
                    </h3>
                    <p className="text-2xl font-bold">
                      {serviceData.jobs?.length || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Active Stages
                    </h3>
                    <p className="text-2xl font-bold">
                      {serviceData.stages?.filter(
                        (s) => s.metatype === "active",
                      ).length || 0}
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">
                      Total Fields
                    </h3>
                    <p className="text-2xl font-bold">
                      {serviceData.stages?.reduce(
                        (acc, stage) => acc + (stage.form?.length || 0),
                        0,
                      ) || 0}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-medium mb-4">Service Description</h3>
                  {serviceData.content ? (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: serviceData.content }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      No description available for this service.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workflow Stages Tab */}
          <TabsContent value="workflow" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Workflow Stages ({serviceData.stages?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {serviceData.stages?.map((stage, index) => (
                      <div
                        key={stage.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStageStatusIcon(stage.metatype)}
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">
                                {index + 1}. {stage.name}
                              </h3>
                              {stage.content && (
                                <div
                                  className="text-sm text-muted-foreground mt-1"
                                  dangerouslySetInnerHTML={{
                                    __html: stage.content,
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                            <span>{formatDuration(stage.duration)}</span>
                            {stage.required_todos > 0 && (
                              <span className="text-xs">
                                {stage.required_todos} required task
                                {stage.required_todos > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        {stage.form && stage.form.length > 0 && (
                          <div className="mt-3 pl-7">
                            <h4 className="text-sm font-medium mb-2">
                              Stage Fields ({stage.form.length}):
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {stage.form.map((field) => (
                                <div
                                  key={field.id}
                                  className="text-xs p-2 bg-muted/50 rounded border"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                      {field.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Badge
                                        variant="outline"
                                        className="text-xs h-5"
                                      >
                                        {field.type}
                                      </Badge>
                                      {field.required && (
                                        <Badge
                                          variant="destructive"
                                          className="text-xs h-5"
                                        >
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-muted-foreground mt-1">
                                    Code: {field.code}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Templates Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Templates ({serviceData.jobs?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-6">
                    {serviceData.jobs?.map((job, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-2">
                              {job.name}
                            </h3>
                            {job.content && (
                              <p className="text-sm text-muted-foreground">
                                {job.content}
                              </p>
                            )}
                          </div>
                          {getJobStatusBadge(job.status)}
                        </div>

                        {job.form && job.form.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-3">
                              Job Fields ({job.form.length}):
                            </h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {job.form.map((field) => (
                                <div
                                  key={field.id}
                                  className="p-3 bg-muted/30 rounded border"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">
                                      {field.name}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {field.type}
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Code: {field.code}
                                  </div>
                                  {field.value && (
                                    <div className="text-xs">
                                      <span className="font-medium">
                                        Value:
                                      </span>{" "}
                                      <span className="text-muted-foreground">
                                        {field.display || field.value}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <Separator />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Fields Tab */}
          <TabsContent value="fields" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  All Service Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {serviceData.stages?.map((stage) =>
                      stage.form?.map((field) => (
                        <div
                          key={field.id}
                          className="p-4 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{field.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {field.type}
                              </Badge>
                              {field.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Field Code:
                              </span>{" "}
                              <span className="font-mono">{field.code}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Stage:
                              </span>{" "}
                              <span>{stage.name}</span>
                            </div>
                          </div>
                          {field.placeholder && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">
                                Placeholder:
                              </span>{" "}
                              <span>{field.placeholder}</span>
                            </div>
                          )}
                        </div>
                      )),
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
