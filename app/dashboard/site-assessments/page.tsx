"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    Search,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Plus,
    ClipboardCheck,
    Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// --- Interfaces ---
interface Assessment {
    id: number;
    request_id: string;
    client_name: string;
    location: string;
    facility_type: string;
    request_date: string;
    status: "pending" | "in_progress" | "submitted";
}

interface ManningStructure {
    id: number;
    client_name: string;
    location: string;
    guards_count: number;
    shifts_count: number;
    start_date: string;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const SiteAssessmentsPage = () => {
    const { token } = useAuth();
    const router = useRouter();

    // Tab State
    const [activeTab, setActiveTab] = useState<"assessments" | "manning">("assessments");

    // Assessments States
    const [assessmentsData, setAssessmentsData] = useState<Assessment[]>([]);
    const [assessmentsMeta, setAssessmentsMeta] = useState<PaginationMeta | null>(null);
    const [assessmentsLoading, setAssessmentsLoading] = useState(false);
    const [assessmentsSearch, setAssessmentsSearch] = useState("");
    const [assessmentsPage, setAssessmentsPage] = useState(1);

    // Manning States
    const [manningData, setManningData] = useState<ManningStructure[]>([]);
    const [manningMeta, setManningMeta] = useState<PaginationMeta | null>(null);
    const [manningLoading, setManningLoading] = useState(false);
    const [manningSearch, setManningSearch] = useState("");
    const [manningPage, setManningPage] = useState(1);

    // --- Fetch Logic for Assessments ---
    const fetchAssessments = async () => {
        if (!token || activeTab !== "assessments") return;
        setAssessmentsLoading(true);
        try {
            const params = new URLSearchParams({
                page: assessmentsPage.toString(),
                per_page: "10",
            });
            if (assessmentsSearch) params.append("search", assessmentsSearch);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/operations/assessments?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const result = await response.json();
            if (result.status || result.success) {
                const responseData = result.data?.data ? result.data : result;
                setAssessmentsData(responseData.data || []);
                setAssessmentsMeta({
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    per_page: responseData.per_page,
                    total: responseData.total,
                });
            }
        } catch (error) {
            console.error("Error fetching assessments:", error);
        } finally {
            setAssessmentsLoading(false);
        }
    };

    // --- Fetch Logic for Manning Structure ---
    const fetchManningStructures = async () => {
        if (!token || activeTab !== "manning") return;
        setManningLoading(true);
        try {
            const params = new URLSearchParams({
                page: manningPage.toString(),
                per_page: "10",
            });
            if (manningSearch) params.append("search", manningSearch);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/operations/manning-structures?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const result = await response.json();
            if (result.status || result.success) {
                const responseData = result.data?.data ? result.data : result;
                setManningData(responseData.data || []);
                setManningMeta({
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    per_page: responseData.per_page,
                    total: responseData.total,
                });
            }
        } catch (error) {
            console.error("Error fetching manning structures:", error);
        } finally {
            setManningLoading(false);
        }
    };

    // --- Side Effects ---
    useEffect(() => {
        const timer = setTimeout(() => fetchAssessments(), 500);
        return () => clearTimeout(timer);
    }, [token, assessmentsPage, assessmentsSearch, activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => fetchManningStructures(), 500);
        return () => clearTimeout(timer);
    }, [token, manningPage, manningSearch, activeTab]);

    // --- UI Helpers ---
    const renderStatus = (status: string) => {
        let colorClass = "bg-gray-400";
        if (status === "pending") colorClass = "bg-yellow-500";
        if (status === "in_progress") colorClass = "bg-blue-500";
        if (status === "submitted") colorClass = "bg-green-500";

        const label = status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

        return (
            <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${colorClass}`} />
                <span className="text-[#3A3A3A] dark:text-slate-200 text-sm font-medium">{label}</span>
            </div>
        );
    };

    const handleCreateNew = () => {
        if (activeTab === "assessments") {
            router.push('/dashboard/site-assessments/create');
        } else {
            router.push('/dashboard/manning-structure/create');
        }
    };

    return (
        <div className="space-y-6 mt-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-slate-50">
                        Site Management
                    </h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">
                        Manage your site assessments and manning structures.
                    </p>
                </div>

                <Button
                    onClick={handleCreateNew}
                    className="bg-[#FAB435] hover:bg-[#d99820] text-white shadow-sm font-bold h-11 px-6"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {activeTab === "assessments" ? "New Assessment" : "New Structure"}
                </Button>
            </div>

            {/* Custom Tab Navigation */}
            <div className="flex gap-8 border-b border-gray-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab("assessments")}
                    className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
                        activeTab === "assessments"
                            ? "text-[#FAB435]"
                            : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <ClipboardCheck className="h-4 w-4" />
                    Assessment Requests
                    {activeTab === "assessments" && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FAB435] rounded-t-md" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("manning")}
                    className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative ${
                        activeTab === "manning"
                            ? "text-[#FAB435]"
                            : "text-gray-500 hover:text-gray-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                >
                    <Users className="h-4 w-4" />
                    Manning Structure
                    {activeTab === "manning" && (
                        <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FAB435] rounded-t-md" />
                    )}
                </button>
            </div>

            <Card className="border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                {/* Search & Filter Bar */}
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 gap-4">
                    <h3 className="font-bold text-[#3A3A3A] dark:text-slate-50 w-full sm:w-auto text-center sm:text-left">
                        {activeTab === "assessments" ? "Requests List" : "Structure Overview"}
                    </h3>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 h-11 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435] rounded-lg"
                            value={activeTab === "assessments" ? assessmentsSearch : manningSearch}
                            onChange={(e) => {
                                if (activeTab === "assessments") {
                                    setAssessmentsSearch(e.target.value);
                                    setAssessmentsPage(1);
                                } else {
                                    setManningSearch(e.target.value);
                                    setManningPage(1);
                                }
                            }}
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto w-full">
                        <Table className="min-w-[700px]">
                            <TableHeader className="bg-gray-50 dark:bg-slate-800/50">
                                {activeTab === "assessments" ? (
                                    <TableRow className="border-b border-gray-100 dark:border-slate-800 hover:bg-transparent">
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Request ID</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Client Name</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Location</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Facility Type</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Request Date</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Status</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5 text-right">Action</TableHead>
                                    </TableRow>
                                ) : (
                                    <TableRow className="border-b border-gray-100 dark:border-slate-800 hover:bg-transparent">
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Client Name</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Location/Site</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Guards</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Shifts</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Start Date</TableHead>
                                        <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5 text-right">Action</TableHead>
                                    </TableRow>
                                )}
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-50 dark:divide-slate-800">
                                {/* Loading State */}
                                {(activeTab === "assessments" ? assessmentsLoading : manningLoading) ? (
                                        <TableRow className="hover:bg-transparent">
                                            <TableCell colSpan={7} className="h-32 text-center">
                                                <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FAB435]" />
                                            </TableCell>
                                        </TableRow>
                                    ) :

                                    /* Assessments Data */
                                    activeTab === "assessments" ? (
                                            assessmentsData.length === 0 ? (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell colSpan={7} className="h-32 text-center text-gray-500 dark:text-slate-400">
                                                        No assessment requests found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                assessmentsData.map((item) => (
                                                    <TableRow key={item.id} className="group hover:bg-[#FAB435]/5 dark:hover:bg-[#FAB435]/10 transition-all duration-200 border-none">
                                                        <TableCell className="px-6 py-5 font-bold text-[#3A3A3A] dark:text-slate-200 group-hover:text-[#FAB435] transition-colors">{item.request_id}</TableCell>
                                                        <TableCell className="px-6 py-5 text-gray-600 dark:text-slate-300 font-medium">{item.client_name}</TableCell>
                                                        <TableCell className="px-6 py-5 text-gray-500 dark:text-slate-400 truncate max-w-[150px]">{item.location}</TableCell>
                                                        <TableCell className="px-6 py-5 text-gray-600 dark:text-slate-300">{item.facility_type}</TableCell>
                                                        <TableCell className="px-6 py-5 font-mono text-xs text-gray-500 dark:text-slate-400">{item.request_date}</TableCell>
                                                        <TableCell className="px-6 py-5">{renderStatus(item.status)}</TableCell>
                                                        <TableCell className="px-6 py-5 text-right">
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#FAB435]/20 hover:bg-[#FAB435]/30 text-[#E89500] dark:bg-[#FAB435]/10 dark:hover:bg-[#FAB435]/20 border-none font-semibold w-24"
                                                                onClick={() => router.push(`/dashboard/site-assessments/${item.request_id}`)}
                                                            >
                                                                {item.status === "pending" ? "Start" : item.status === "in_progress" ? "Continue" : "View"}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )
                                        ) :

                                        /* Manning Structure Data */
                                        (
                                            manningData.length === 0 ? (
                                                <TableRow className="hover:bg-transparent">
                                                    <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-slate-400">
                                                        No manning structures found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                manningData.map((item) => (
                                                    <TableRow key={item.id} className="group hover:bg-[#FAB435]/5 dark:hover:bg-[#FAB435]/10 transition-all duration-200 border-none">
                                                        <TableCell className="px-6 py-5 font-bold text-[#3A3A3A] dark:text-slate-200 group-hover:text-[#FAB435] transition-colors">{item.client_name}</TableCell>
                                                        <TableCell className="px-6 py-5 text-gray-500 dark:text-slate-400 truncate max-w-[200px]">{item.location}</TableCell>
                                                        <TableCell className="px-6 py-5 font-bold text-gray-600 dark:text-slate-300">{item.guards_count}</TableCell>
                                                        <TableCell className="px-6 py-5 text-gray-600 dark:text-slate-300">{item.shifts_count}</TableCell>
                                                        <TableCell className="px-6 py-5 font-mono text-xs text-gray-500 dark:text-slate-400">{item.start_date}</TableCell>
                                                        <TableCell className="px-6 py-5 text-right">
                                                            <Button
                                                                size="sm"
                                                                className="bg-[#FAB435]/20 hover:bg-[#FAB435]/30 text-[#E89500] dark:bg-[#FAB435]/10 dark:hover:bg-[#FAB435]/20 border-none font-semibold w-20"
                                                                onClick={() => router.push(`/dashboard/site-assessments/manning-structure/${item.id}`)}
                                                            >
                                                                View
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )
                                        )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!(activeTab === "assessments" ? assessmentsLoading : manningLoading) &&
                        (activeTab === "assessments" ? assessmentsMeta : manningMeta) &&
                        (activeTab === "assessments" ? assessmentsMeta!.total > 0 : manningMeta!.total > 0) && (

                            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                            <span className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                {(() => {
                                    const meta = activeTab === "assessments" ? assessmentsMeta! : manningMeta!;
                                    return `Showing ${((meta.current_page - 1) * meta.per_page) + 1} to ${Math.min(meta.current_page * meta.per_page, meta.total)} of ${meta.total} entries`;
                                })()}
                            </span>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={(activeTab === "assessments" ? assessmentsPage : manningPage) === 1}
                                        onClick={() => activeTab === "assessments" ? setAssessmentsPage(p => Math.max(1, p - 1)) : setManningPage(p => Math.max(1, p - 1))}
                                        className="h-9 w-9 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {(() => {
                                        const meta = activeTab === "assessments" ? assessmentsMeta! : manningMeta!;
                                        const currentPage = activeTab === "assessments" ? assessmentsPage : manningPage;
                                        const setPage = activeTab === "assessments" ? setAssessmentsPage : setManningPage;

                                        return [...Array(Math.min(5, meta.last_page))].map((_, idx) => {
                                            const p = idx + 1;
                                            return (
                                                <Button
                                                    key={p}
                                                    variant={currentPage === p ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setPage(p)}
                                                    className={`h-9 w-9 p-0 font-bold ${
                                                        currentPage === p
                                                            ? "bg-[#FAB435] text-white hover:bg-[#d99820] border-[#FAB435]"
                                                            : "text-gray-400 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800"
                                                    }`}
                                                >
                                                    {p}
                                                </Button>
                                            )
                                        });
                                    })()}

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={(activeTab === "assessments" ? assessmentsPage : manningPage) === (activeTab === "assessments" ? assessmentsMeta!.last_page : manningMeta!.last_page)}
                                        onClick={() => activeTab === "assessments" ? setAssessmentsPage(p => Math.min(assessmentsMeta!.last_page, p + 1)) : setManningPage(p => Math.min(manningMeta!.last_page, p + 1))}
                                        className="h-9 w-9 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SiteAssessmentsPage;