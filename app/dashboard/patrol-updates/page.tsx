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
    Eye
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

// Updated Interface
interface PatrolLog {
    id: number;
    date_time: string;
    guard_name: string; // The backend may now return a JSON string or comma separated string here
    location: string;
    patrol_area: string;
    observation: string;
    status: string;
    is_escalated: boolean;
}

interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const PatrolLogsPage = () => {
    const { token } = useAuth();
    const router = useRouter();

    const [data, setData] = useState<PatrolLog[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const fetchLogs = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: "10",
            });
            if (search) params.append("search", search);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/operations/patrol-logs?${params.toString()}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const result = await response.json();

            if (result.status || result.success) {
                const responseData = result.data?.data ? result.data : result;
                setData(responseData.data || []);
                setMeta({
                    current_page: responseData.current_page,
                    last_page: responseData.last_page,
                    per_page: responseData.per_page,
                    total: responseData.total,
                });
            }
        } catch (error) {
            console.error("Error loading logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [token, page, search]);

    return (
        <div className="space-y-6 mt-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#3A3A3A] dark:text-slate-50">Patrol Logs</h1>
                    <p className="text-gray-500 dark:text-slate-400">Monitor guard patrol activities across locations</p>
                </div>
                <Button
                    onClick={() => router.push('/dashboard/patrol-updates/create')}
                    className="bg-[#FAB435] hover:bg-[#d99820] text-white shadow-sm font-bold h-11 px-6"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Update
                </Button>
            </div>

            <Card className="border border-gray-100 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="flex flex-col sm:flex-row items-center justify-between py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 gap-4">
                    <div className="border-b-2 border-[#FAB435] pb-2 px-1 w-full sm:w-auto text-center sm:text-left">
                        <span className="font-bold text-[#3A3A3A] dark:text-slate-50">Log Records</span>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                        <Input
                            placeholder="Search patrols..."
                            className="pl-10 h-11 bg-white text-gray-900 border-gray-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 focus-visible:ring-[#FAB435] rounded-lg"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="overflow-x-auto w-full">
                        <Table className="min-w-[700px]">
                            <TableHeader className="bg-gray-50 dark:bg-slate-800/50">
                                <TableRow className="border-b border-gray-100 dark:border-slate-800 hover:bg-transparent">
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Date & Time</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Guards on Site</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Location</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Patrol Area</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5">Observation</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] text-gray-400 dark:text-slate-500 px-6 py-5 text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-50 dark:divide-slate-800">
                                {loading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#FAB435]" />
                                        </TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={6} className="h-32 text-center text-gray-500 dark:text-slate-400">No patrol logs found.</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item) => {
                                        // Attempt to parse the guards if the backend sends stringified JSON arrays
                                        let guardNames = item.guard_name;
                                        try {
                                            const parsed = JSON.parse(item.guard_name);
                                            if (Array.isArray(parsed)) guardNames = parsed.join(', ');
                                        } catch(e) {} // Keep original string if not JSON

                                        return (
                                            <TableRow key={item.id} className="group hover:bg-[#FAB435]/5 dark:hover:bg-[#FAB435]/10 transition-all duration-200 border-none">
                                                <TableCell className="px-6 py-5 font-mono text-xs text-gray-500 dark:text-slate-400">{item.date_time}</TableCell>
                                                <TableCell className="px-6 py-5 font-bold text-[#3A3A3A] dark:text-slate-200 group-hover:text-[#FAB435] transition-colors max-w-[200px] truncate" title={guardNames}>
                                                    {guardNames}
                                                </TableCell>
                                                <TableCell className="px-6 py-5 text-gray-600 dark:text-slate-300">{item.location}</TableCell>
                                                <TableCell className="px-6 py-5 text-gray-600 dark:text-slate-300">{item.patrol_area}</TableCell>
                                                <TableCell className="px-6 py-5 text-gray-500 dark:text-slate-400 max-w-xs truncate" title={item.observation}>{item.observation}</TableCell>
                                                <TableCell className="px-6 py-5 text-right">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        item.is_escalated
                                                            ? 'bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20'
                                                            : 'bg-green-100/50 text-green-600 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination Controls */}
                    {!loading && meta && meta.total > 0 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
                            <span className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                                Showing {((meta.current_page - 1) * meta.per_page) + 1} to {Math.min(meta.current_page * meta.per_page, meta.total)} of {meta.total} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline" size="icon" disabled={page === 1}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    className="h-9 w-9 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline" size="icon" disabled={page === meta.last_page}
                                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
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

export default PatrolLogsPage;