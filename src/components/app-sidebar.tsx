import {
  Home,
  Inbox,
  Settings,
  HelpCircle,
  Store,
  BookOpen,
  Database,
} from "lucide-react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar"; // import useSidebar hook
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { dropdownOpenAtom } from "@/atoms/uiAtoms";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatList } from "./ChatList";
import { AppList } from "./AppList";
import { HelpDialog } from "./HelpDialog"; // Import the new dialog
import { SettingsList } from "./SettingsList";
import { ServicesList } from "./ServicesList";

// Menu items.
const items = [
  {
    title: "Apps",
    to: "/",
    icon: Home,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: Inbox,
  },
  {
    title: "Services",
    to: "/services",
    icon: Database,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: Settings,
  },
  //{
  //  title: "Library",
  //  to: "/library",
  //  icon: BookOpen,
  //},
  //{
  //  title: "Hub",
  //  to: "/hub",
  //  icon: Store,
  //},
];

// Click state types
type ClickState =
  | "Apps"
  | "Chat"
  | "Services"
  | "Settings"
  | "Library"
  | null;

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar(); // retrieve current sidebar state
  const [selectedMenuItem, setSelectedMenuItem] = useState<ClickState>(null);
  const expandedByClick = useRef(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false); // State for dialog
  const [isDropdownOpen] = useAtom(dropdownOpenAtom);

  useEffect(() => {
    if (selectedMenuItem && state === "collapsed") {
      expandedByClick.current = true;
      toggleSidebar();
    }
  }, [selectedMenuItem, toggleSidebar, state]);

  const handleMenuItemClick = (item: ClickState) => {
    if (selectedMenuItem === item) {
      // Clicking the same item - collapse if expanded by click
      if (state === "expanded" && expandedByClick.current) {
        toggleSidebar();
        expandedByClick.current = false;
      }
      setSelectedMenuItem(null);
    } else {
      // Clicking a different item - show its submenu
      setSelectedMenuItem(item);
      if (state === "collapsed") {
        expandedByClick.current = true;
      }
    }
  };

  const routerState = useRouterState();
  const isAppRoute =
    routerState.location.pathname === "/" ||
    routerState.location.pathname.startsWith("/app-details");
  const isChatRoute = routerState.location.pathname === "/chat";
  const isServicesRoute = routerState.location.pathname.startsWith("/services");
  const isSettingsRoute = routerState.location.pathname.startsWith("/settings");

  // Determine which submenu to show - either clicked item or route-based
  let selectedItem: ClickState = selectedMenuItem;
  if (!selectedMenuItem && state === "expanded") {
    if (isAppRoute) {
      selectedItem = "Apps";
    } else if (isChatRoute) {
      selectedItem = "Chat";
    } else if (isServicesRoute) {
      selectedItem = "Services";
    } else if (isSettingsRoute) {
      selectedItem = "Settings";
    }
  }

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent className="overflow-hidden">
        <div className="mt-8 flex">
          {/* Left Column: Menu items */}
          <div className="">
            <SidebarTrigger />
            <AppIcons onMenuItemClick={handleMenuItemClick} selectedItem={selectedMenuItem} />
          </div>
          {/* Right Column: Chat List Section */}
          <div className="w-[240px]">
            <AppList show={selectedItem === "Apps"} />
            <ChatList show={selectedItem === "Chat"} />
            <ServicesList show={selectedItem === "Services"} />
            <SettingsList show={selectedItem === "Settings"} />
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Change button to open dialog instead of linking */}
            <SidebarMenuButton
              size="sm"
              className="mb-2 flex h-14 w-14 flex-col items-center gap-1 rounded-2xl font-medium"
              onClick={() => setIsHelpDialogOpen(true)} // Open dialog on click
            >
              <HelpCircle className="h-5 w-5" />
              <span className={"text-xs"}>Help</span>
            </SidebarMenuButton>
            <HelpDialog
              isOpen={isHelpDialogOpen}
              onClose={() => setIsHelpDialogOpen(false)}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function AppIcons({
  onMenuItemClick,
  selectedItem,
}: {
  onMenuItemClick: (item: ClickState) => void;
  selectedItem: ClickState;
}) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();

  return (
    // When collapsed: only show the main menu
    <SidebarGroup className="pr-0">
      {/* <SidebarGroupLabel>Dyad</SidebarGroupLabel> */}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              (item.to === "/" && pathname === "/") ||
              (item.to !== "/" && pathname.startsWith(item.to));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  className="w-14 font-medium"
                >
                  <Link
                    to={item.to}
                    className={`flex flex-col items-center gap-1 h-14 mb-2 rounded-2xl ${
                      isActive ? "bg-sidebar-accent" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      // Navigate to the route
                      navigate({ to: item.to });
                      // Then show the submenu
                      onMenuItemClick(item.title as ClickState);
                    }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <item.icon className="h-5 w-5" />
                      <span className={"text-xs"}>{item.title}</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
