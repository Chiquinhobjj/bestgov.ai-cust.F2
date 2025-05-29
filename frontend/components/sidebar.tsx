"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  MessageSquare,
  Grid3X3,
  Server,
  Users,
  User,
  Shield,
  LogOut,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  FileText,
  ExternalLink,
  ChevronsLeft,
  ChevronsRight,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const parsed = JSON.parse(user);
          setIsAdmin(!!parsed.is_admin);
        } catch {}
      }

      // Get saved sidebar state from localStorage
      const savedCollapsedState = localStorage.getItem("sidebar-collapsed");
      if (savedCollapsedState) {
        setIsCollapsed(savedCollapsedState === "true");
      }
    }
  }, []);

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(isCollapsed));
    }
  }, [isCollapsed]);

  const menuItems = [
    ...(!isAdmin
      ? [
          {
            name: "Agents",
            href: "/agents",
            icon: Grid3X3,
          },
          {
            name: "Chat",
            href: "/chat",
            icon: MessageSquare,
          },
          {
            name: "Documentation",
            href: "/documentation",
            icon: FileText,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            name: "MCP Servers",
            href: "/mcp-servers",
            icon: Server,
          },
          {
            name: "Clients",
            href: "/clients",
            icon: Users,
          },
          {
            name: "Documentation",
            href: "/documentation",
            icon: FileText,
          },
        ]
      : []),
  ];

  const userMenuItems = [
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      onClick: () => {}
    },
    {
      name: "Security",
      href: "/security",
      icon: Shield,
      onClick: () => {}
    },
    {
      name: "Logout",
      href: "#",
      icon: LogOut,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setLogoutDialogOpen(true)
        setUserMenuOpen(false)
      }
    },
  ];
  
  const handleLogout = () => {
    setLogoutDialogOpen(false)
    router.push("/logout")
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out border-r border-border", 
        theme === "dark"
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground",
        isCollapsed ? "w-16" : "w-56"
      )}
    >
      <TooltipProvider delayDuration={300}>
        <div className={cn("p-4 mb-6 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <Link href="/">
            {isCollapsed ? (
              <div className="h-10 w-10 flex items-center justify-center bg-muted/50 rounded-full p-1">
                <Image
                  src={`/images/bestgov-icon${theme === "dark" ? "-white" : ""}.svg`}
                  alt="BestGov"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <Image
                src={`/images/bestgov-logo${theme === "dark" ? "-white" : ""}.svg`}
                alt="BestGov Platform"
                width={120}
                height={40}
                className="mt-2"
              />
            )}
          </Link>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleSidebar}
                className="flex items-center justify-center p-1.5 rounded-full bg-muted text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>
        </div>

        <nav className="space-y-1.5 flex-1 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all",
                      isCollapsed ? "justify-center" : "",
                      isActive
                        ? isCollapsed 
                          ? "bg-accent/20 text-accent border-0" 
                          : "bg-accent/10 text-accent border-l-2 border-accent"
                        : "hover:text-accent hover:bg-muted",
                      theme === "dark" ? "text-muted-foreground" : "text-foreground"
                    )}
                  >
                    <item.icon className={cn("flex-shrink-0", isActive ? "h-5 w-5 text-accent" : "h-5 w-5")} />
                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                    {item.name}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        <div className={cn("border-t border-border pt-4 mt-2 pb-4", isCollapsed ? "px-2" : "px-4")}>
          <div className="mb-4 relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => !isCollapsed && setUserMenuOpen(!userMenuOpen)}
                  className={cn(
                    "w-full flex items-center transition-colors rounded-md px-3 py-2.5",
                    isCollapsed ? "justify-center" : "justify-between",
                    userMenuOpen
                      ? "bg-accent/10 text-accent"
                      : "hover:text-accent hover:bg-muted",
                    theme === "dark" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  <div className={cn("flex items-center", isCollapsed ? "gap-0" : "gap-3")}>
                    <User className={cn(
                      userMenuOpen ? "text-accent" : "",
                      theme === "dark" ? "text-muted-foreground" : "text-foreground", 
                      "h-5 w-5"
                    )} />
                    {!isCollapsed && <span className="font-medium">My Account</span>}
                  </div>                    {!isCollapsed && (
                    userMenuOpen ? (
                      <ChevronUp className="h-4 w-4 text-accent" />
                    ) : (
                      <ChevronDown className={cn(
                        "h-4 w-4", 
                        theme === "dark" ? "text-muted-foreground" : "text-foreground"
                      )} />
                    )
                  )}
                </button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                  My Account
                </TooltipContent>
              )}
            </Tooltip>

            {userMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-0 w-full mb-1 bg-popover rounded-md overflow-hidden border border-border">
                {userMenuItems.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={item.onClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 transition-colors",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "hover:text-accent hover:bg-muted",
                        theme === "dark" ? "text-muted-foreground" : "text-foreground"
                      )}
                    >
                      <item.icon className={cn(
                        isActive ? "text-accent" : "",
                        theme === "dark" ? "text-muted-foreground" : "text-foreground",
                        "h-5 w-5"
                      )} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme toggle and copyright */}
          <div className={cn("flex", isCollapsed ? "justify-center" : "justify-between items-center")}>
            <ThemeToggle />
            
            {!isCollapsed && (
              <div className="text-right">
                <div className="text-sm text-accent font-medium">BestGov</div>
                <div className="text-xs text-muted-foreground mt-1">
                  © {new Date().getFullYear()} BestGov Platform
                </div>
              </div>
            )}
          </div>
        </div>
      </TooltipProvider>
      
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="bg-background border-border">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500" />
              </div>
              <DialogTitle>Confirmation of Logout</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogout}
              className="bg-accent hover:bg-accent/80"
            >
              Yes, logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
