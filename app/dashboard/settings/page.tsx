"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Headercontent from "@/components/Headercontent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    User,
    ShieldCheck,
    Lock,
    Activity,
    Paperclip,
    LucideIcon,
    Search,
    Clock,
    Loader2,
    ChevronLeft,
    ChevronRight,
    X,
    Info,
    MonitorSmartphone,
    MapPin
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NavOption {
    id: string;
    label: string;
    desc: string;
    icon: LucideIcon;
}

interface AuditLogEntry {
    id: number;
    user_id: string;
    user_name: string;
    user_email: string;
    user_role: string;
    action_type: string;
    feature: string;
    target: string;
    description: string;
    ip_address: string;
    user_agent: string;
    old_values: any | null;
    new_values: any | null;
    status: string;
    created_at: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const SettingsPage = () => {
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState<string>("profile");

    // Audit Log States
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    // Modal States
    const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const options: NavOption[] = [
        { id: "profile", label: "Profile Details", desc: "View your profile details", icon: User },
        { id: "update", label: "Update Profile", desc: "Update your profile details", icon: ShieldCheck },
        { id: "password", label: "Password Settings", desc: "Update or Reset Password", icon: Lock },
        { id: "audit", label: "Audit Logs", desc: "Track system activity and changes", icon: Activity },
    ];

    // Fetch Audit Logs Function
    const fetchAuditLogs = async () => {
        if (!token || activeTab !== "audit") return;
        setLoadingLogs(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "10",
            });
            if (search) params.append("search", search);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/audit-log?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const result = await response.json();

            if (result.success) {
                setLogs(result.data || []);
                setMeta({
                    current_page: result.pagination.current_page,
                    last_page: result.pagination.last_page,
                    per_page: result.pagination.per_page,
                    total: result.pagination.total,
                });
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        if (activeTab === "audit") {
            const timer = setTimeout(() => {
                fetchAuditLogs();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [token, page, search, activeTab]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short', day: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const handleViewDetails = (log: AuditLogEntry) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 mt-8 pb-10 relative">
            <Headercontent
                title="Settings"
                description="Manage your Personal Information"
            />

            <Card className="border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden relative z-0">
                <CardContent className="p-0 flex flex-col lg:flex-row min-h-[600px]">

                    {/* LEFT SIDE: Sub-navigation */}
                    <div className="w-full lg:w-80 border-r border-gray-100 dark:border-slate-800 p-8 space-y-10 bg-white dark:bg-slate-900 z-10">
                        {options.map((option, index) => (
                            <div
                                key={option.id}
                                onClick={() => setActiveTab(option.id)}
                                className="relative flex items-start gap-4 cursor-pointer group"
                            >
                                {index !== options.length - 1 && (
                                    <div className={`absolute left-[9px] top-6 w-[2px] h-14 transition-colors duration-300 ${
                                        activeTab === option.id ? "bg-[#FAB435]" : "bg-gray-100 dark:bg-slate-800"
                                    }`} />
                                )}

                                <div className={`z-20 w-[20px] h-[20px] rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                                    activeTab === option.id
                                        ? "bg-[#FAB435] border-[#FAB435]/20 scale-110 shadow-sm"
                                        : "bg-gray-200 dark:bg-slate-700 border-white dark:border-slate-900 shadow-sm"
                                }`} />

                                <div className="flex-1">
                                    <p className={`text-sm font-bold leading-tight transition-colors duration-300 ${
                                        activeTab === option.id ? "text-[#FAB435]" : "text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-slate-200"
                                    }`}>
                                        {option.label}
                                    </p>
                                    <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-medium">{option.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: Content Area */}
                    <div className="flex-1 p-10 bg-white dark:bg-slate-900/50 w-full overflow-hidden">

                        {/* 1. PROFILE TAB */}
                        {activeTab === "profile" && (
                            <div className="space-y-12 transition-all duration-500 opacity-100 translate-y-0">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-full bg-[#FAB435]/10 flex items-center justify-center border-2 border-[#FAB435]/20 text-[#FAB435] text-xl font-bold">
                                        {user?.name?.charAt(0) || "J"}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50 tracking-tight">{user?.name || "Jeremiah Okoja"}</h2>
                                        <p className="text-base text-gray-500 dark:text-slate-400 font-medium">
                                            Operation • <span className="text-gray-400 dark:text-slate-500">{user?.email || "jeremiah@gmail.com"}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-[#FAB435] border-b-2 border-[#FAB435] w-fit pb-1">Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
                                        <DetailItem label="Name" value={user?.name || "Jeremiah Okoja"} />
                                        <DetailItem label="Email" value={user?.email || "jeremiah@gmail.com"} />
                                        <DetailItem label="Phone" value="08011223868" />
                                        <DetailItem label="Role" value="" />
                                        <DetailItem label="Department" value="HR" />
                                        <DetailItem label="Last Login" value="Today, 9:40 AM" />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-10">
                                    <Button onClick={() => setActiveTab("update")} className="bg-[#FAB435] hover:bg-[#d99820] text-white font-bold px-10 rounded-md h-12 shadow-md active:scale-95">
                                        Edit Profile
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* 2. UPDATE TAB */}
                        {activeTab === "update" && (
                            <div className="space-y-8 transition-all duration-500 opacity-100 translate-y-0">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Update Profile</h2>
                                <div className="max-w-2xl space-y-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">Full Name</Label>
                                        <Input placeholder="Jeremiah Okoja" className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">Email Address</Label>
                                        <Input type="email" placeholder="jeremiah@gmail.com" className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">Profile Photo</Label>
                                        <div className="border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 hover:bg-orange-50/50 dark:hover:bg-[#FAB435]/5 cursor-pointer group transition-colors">
                                            <Paperclip className="text-gray-400 dark:text-slate-500 group-hover:text-[#FAB435] mb-2" />
                                            <span className="text-sm text-gray-500 dark:text-slate-400 font-medium group-hover:text-gray-700 dark:group-hover:text-slate-200">Click to upload JPG image</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button variant="ghost" onClick={() => setActiveTab("profile")} className="font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white">Cancel</Button>
                                        <Button className="bg-[#FAB435] hover:bg-[#d99820] text-white font-bold px-8 h-12 shadow-md">Save Changes</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. PASSWORD TAB */}
                        {activeTab === "password" && (
                            <div className="space-y-8 transition-all duration-500 opacity-100 translate-y-0">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Password Settings</h2>
                                <div className="max-w-xl space-y-6">
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">Current Password</Label>
                                        <Input type="password" placeholder="••••••••" className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]" />
                                    </div>
                                    <hr className="border-gray-100 dark:border-slate-800 my-4" />
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">New Password</Label>
                                        <Input type="password" placeholder="Enter new password" className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="font-bold text-gray-700 dark:text-slate-300">Confirm New Password</Label>
                                        <Input type="password" placeholder="Repeat new password" className="h-12 bg-white text-gray-900 border-gray-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435]" />
                                    </div>
                                    <div className="flex justify-end gap-4 pt-4">
                                        <Button variant="ghost" onClick={() => setActiveTab("profile")} className="font-bold text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white">Cancel</Button>
                                        <Button className="bg-[#FAB435] hover:bg-[#d99820] text-white font-bold px-8 h-12 shadow-md">Update Password</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. AUDIT LOGS TAB */}
                        {activeTab === "audit" && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Audit Logs</h2>
                                        <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Monitoring system activity for <span className="text-[#FAB435]">{user?.email || "your account"}</span></p>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="bg-gray-50 dark:bg-slate-800/80 px-4 py-2 rounded-lg border border-gray-100 dark:border-slate-700">
                                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-slate-400 tracking-widest">Total Events</p>
                                            <p className="text-lg font-bold text-gray-700 dark:text-slate-100">
                                                {meta?.total ? meta.total.toLocaleString() : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/50 dark:bg-slate-800/30 p-4 rounded-xl border border-gray-100 dark:border-slate-800">
                                    <div className="relative w-full sm:w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                                        <Input
                                            placeholder="Search feature, IP, or status..."
                                            value={search}
                                            onChange={(e) => {
                                                setSearch(e.target.value);
                                                setPage(1);
                                            }}
                                            className="pl-10 h-11 bg-white text-gray-900 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 border-gray-200 dark:border-slate-700 focus-visible:ring-[#FAB435] rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button className="flex-1 sm:flex-none bg-[#FAB435] hover:bg-[#d99820] text-white font-bold h-11 px-6 shadow-sm">
                                            Export CSV
                                        </Button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm w-full bg-white dark:bg-slate-900/50">
                                    <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                                        <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-400 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] border-b border-gray-100 dark:border-slate-800">
                                        <tr>
                                            <th className="px-6 py-5 w-[40%]">Action Event</th>
                                            <th className="px-6 py-5">Origin IP</th>
                                            <th className="px-6 py-5">Date & Time</th>
                                            <th className="px-6 py-5 text-right">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                                        {loadingLogs ? (
                                            <tr>
                                                <td colSpan={4} className="h-32 text-center">
                                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FAB435]" />
                                                </td>
                                            </tr>
                                        ) : logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="h-32 text-center text-gray-500 dark:text-slate-400">
                                                    No audit logs found.
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr
                                                    key={log.id}
                                                    onClick={() => handleViewDetails(log)}
                                                    className="group hover:bg-[#FAB435]/5 dark:hover:bg-[#FAB435]/10 transition-all duration-200 cursor-pointer"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                                <span className="font-bold text-gray-800 dark:text-slate-100 group-hover:text-[#FAB435] transition-colors">
                                                                    {log.feature} <span className="text-gray-400 dark:text-slate-500">({log.action_type})</span>
                                                                </span>
                                                            <span className="text-[11px] text-gray-400 dark:text-slate-400 font-medium truncate max-w-[300px]">{log.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 font-mono text-xs text-gray-500 dark:text-slate-400">
                                                        {log.ip_address || 'System'}
                                                    </td>
                                                    <td className="px-6 py-5 text-gray-400 dark:text-slate-400 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={13} className="text-gray-300 dark:text-slate-600" />
                                                            <span className="font-medium text-xs">{formatDate(log.created_at)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                                log.status.toLowerCase() === "success"
                                                                    ? "bg-green-100/50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-500/20"
                                                                    : "bg-red-100/50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20"
                                                            }`}>
                                                                {log.status}
                                                            </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Dynamic Pagination */}
                                {!loadingLogs && meta && meta.total > 0 && (
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-4">
                                        <p className="text-xs text-gray-400 dark:text-slate-400 font-bold uppercase tracking-widest">
                                            Showing {((meta.current_page - 1) * meta.per_page) + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} entries
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={page === 1}
                                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                                className="h-9 w-9 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>

                                            {[...Array(Math.min(5, meta.last_page))].map((_, idx) => {
                                                const p = idx + 1;
                                                return (
                                                    <Button
                                                        key={p}
                                                        variant={page === p ? "default" : "outline"}
                                                        onClick={() => setPage(p)}
                                                        className={`h-9 w-9 p-0 font-bold ${
                                                            page === p
                                                                ? "bg-[#FAB435] text-white hover:bg-[#d99820] border-[#FAB435]"
                                                                : "text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                                                        }`}
                                                    >
                                                        {p}
                                                    </Button>
                                                )
                                            })}

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                disabled={page === meta.last_page}
                                                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                                                className="h-9 w-9 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* AUDIT LOG DETAILS MODAL */}
            {isModalOpen && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4 px-4 sm:px-0 animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-transparent dark:border-slate-800 shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-[#FAB435]/10 flex items-center justify-center">
                                    <Info className="h-5 w-5 text-[#FAB435]" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-slate-50 text-lg leading-tight">Action Event Details</h3>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Log ID: #{selectedLog.id}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-full" onClick={() => setIsModalOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                            {/* Top Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Feature & Action</p>
                                    <p className="font-bold text-gray-800 dark:text-slate-100">{selectedLog.feature}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{selectedLog.action_type} • {selectedLog.target}</p>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-1">Date & Status</p>
                                    <p className="font-bold text-gray-800 dark:text-slate-100 text-sm">{formatDate(selectedLog.created_at)}</p>
                                    <div className="mt-1">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                            selectedLog.status.toLowerCase() === "success"
                                                ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                        }`}>
                                            {selectedLog.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Description */}
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">Description</h4>
                                <p className="text-sm text-gray-700 dark:text-slate-300 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-lg border border-gray-100 dark:border-slate-800 leading-relaxed">
                                    {selectedLog.description}
                                </p>
                            </div>

                            {/* Technical Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-800 pb-2">User Context</h4>
                                    <DetailItem label="Name" value={selectedLog.user_name} />
                                    <DetailItem label="Email" value={selectedLog.user_email} />
                                    <DetailItem label="Role" value={selectedLog.user_role} />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-slate-800 pb-2">System Context</h4>

                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 dark:text-slate-500 font-black flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> IP Address
                                        </p>
                                        <p className="text-sm font-mono text-gray-800 dark:text-slate-200">{selectedLog.ip_address}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 dark:text-slate-500 font-black flex items-center gap-1">
                                            <MonitorSmartphone className="h-3 w-3" /> User Agent
                                        </p>
                                        <p className="text-xs font-mono text-gray-500 dark:text-slate-400 break-words leading-tight">
                                            {selectedLog.user_agent}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 flex justify-end">
                            <Button onClick={() => setIsModalOpen(false)} variant="outline" className="font-bold border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                                Close Window
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
    <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-[0.1em] text-gray-400 dark:text-slate-500 font-black">{label}</p>
        <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{value}</p>
    </div>
);

export default SettingsPage;